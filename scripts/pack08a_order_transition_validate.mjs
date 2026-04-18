import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are required");
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function randomSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function createConfirmedUser(tag) {
  const email = `pack08a.order.${tag}.${randomSuffix()}@gmail.com`;
  const password = `P08a!${Math.random().toString(36).slice(2, 8)}Abc12345`;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { source: "pack08a_order_validate", tag },
  });
  if (createError) throw new Error(`admin.createUser failed (${tag}): ${createError.message}`);

  const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({ email, password });
  if (signInError) throw new Error(`signInWithPassword failed (${tag}): ${signInError.message}`);

  const token = signInData.session?.access_token;
  const userId = signInData.user?.id ?? created.user?.id;
  if (!token || !userId) throw new Error(`failed to get user session (${tag})`);

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  return { userId, userClient };
}

async function countByUser(table, userId, userColumn = "user_id") {
  const { count, error } = await admin
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(userColumn, userId);
  if (error) throw new Error(`count ${table} failed: ${error.message}`);
  return count ?? 0;
}

async function insertOrderRow(payload) {
  const withLegacy = { ...payload, user_id: payload.buyer_id };
  let res = await admin.from("orders").insert(withLegacy).select("*").single();
  if (!res.error) return res.data;

  const code = res.error.code ?? "";
  const msg = res.error.message ?? "";
  const unknownColumn = code === "PGRST204" || msg.includes("column") || msg.includes("schema cache");
  if (!unknownColumn) {
    throw new Error(`insert order failed: ${res.error.message}`);
  }

  res = await admin.from("orders").insert(payload).select("*").single();
  if (res.error) throw new Error(`insert order failed fallback: ${res.error.message}`);
  return res.data;
}

async function createOrder({ buyerId, sellerId, status, title }) {
  const row = await insertOrderRow({
    buyer_id: buyerId,
    seller_id: sellerId,
    order_type: "skill_service",
    biz_ref_type: "manual",
    title,
    amount: 99,
    currency: "CNY",
    point_amount: 0,
    status,
    paid_at: status === "paid" || status === "in_service" || status === "completed" ? new Date().toISOString() : null,
    completed_at: null,
    closed_at: null,
  });
  return row;
}

const report = {
  created: {},
  checks: {},
  transitions: [],
  sideEffects: {},
  errors: [],
};

try {
  const buyer = await createConfirmedUser("buyer");
  const seller = await createConfirmedUser("seller");
  const outsider = await createConfirmedUser("outsider");
  report.created.users = { buyer: buyer.userId, seller: seller.userId, outsider: outsider.userId };

  // 1) authenticated user cannot invoke transition RPC directly
  const nonServiceTry = await outsider.userClient.rpc("transition_order_status_v2", {
    p_order_id: "00000000-0000-0000-0000-000000000000",
    p_to_status: "paid",
    p_reason: "should fail",
  });
  report.checks.authenticatedDenied =
    !!nonServiceTry.error &&
    (nonServiceTry.error.message.includes("restricted") ||
      nonServiceTry.error.message.toLowerCase().includes("permission denied"));
  if (!report.checks.authenticatedDenied) {
    throw new Error(`authenticated path was not denied as expected: ${JSON.stringify(nonServiceTry)}`);
  }

  const before = {
    buyerPointTx: await countByUser("point_transactions", buyer.userId),
    buyerEarningTx: await countByUser("earning_transactions", buyer.userId),
    buyerNotif: await countByUser("notifications", buyer.userId),
    sellerPointTx: await countByUser("point_transactions", seller.userId),
    sellerEarningTx: await countByUser("earning_transactions", seller.userId),
    sellerNotif: await countByUser("notifications", seller.userId),
  };

  const allowed = [
    { from: "pending_payment", to: "paid", expectTimestamp: "paid_at" },
    { from: "paid", to: "in_service", expectTimestamp: null },
    { from: "in_service", to: "completed", expectTimestamp: "completed_at" },
    { from: "paid", to: "refunded", expectTimestamp: null },
    { from: "pending_payment", to: "closed", expectTimestamp: "closed_at" },
  ];

  for (const tc of allowed) {
    const order = await createOrder({
      buyerId: buyer.userId,
      sellerId: seller.userId,
      status: tc.from,
      title: `pack08a allowed ${tc.from}->${tc.to} ${randomSuffix()}`,
    });
    const beforeUpdatedAt = order.updated_at;

    const { data, error } = await admin.rpc("transition_order_status_v2", {
      p_order_id: order.id,
      p_to_status: tc.to,
      p_reason: "pack08a validation",
    });
    if (error) throw new Error(`allowed transition failed ${tc.from}->${tc.to}: ${error.message}`);

    const { data: latest, error: latestErr } = await admin
      .from("orders")
      .select("id,status,paid_at,completed_at,closed_at,updated_at")
      .eq("id", order.id)
      .single();
    if (latestErr) throw new Error(`fetch transitioned order failed: ${latestErr.message}`);

    const timestampOk = tc.expectTimestamp ? latest[tc.expectTimestamp] !== null : true;
    const updatedAtMoved = latest.updated_at !== beforeUpdatedAt;
    report.transitions.push({
      from: tc.from,
      to: tc.to,
      rpc_ok: data?.ok === true,
      rpc_idempotent: data?.idempotent === false,
      db_status_ok: latest.status === tc.to,
      timestamp_ok: timestampOk,
      updated_at_changed: updatedAtMoved,
    });
  }

  // 3) illegal transition must be rejected
  const illegalOrder = await createOrder({
    buyerId: buyer.userId,
    sellerId: seller.userId,
    status: "completed",
    title: `pack08a illegal ${randomSuffix()}`,
  });
  const illegalTry = await admin.rpc("transition_order_status_v2", {
    p_order_id: illegalOrder.id,
    p_to_status: "paid",
    p_reason: "illegal should fail",
  });
  report.checks.illegalTransitionDenied =
    !!illegalTry.error && illegalTry.error.message.includes("illegal order status transition");
  if (!report.checks.illegalTransitionDenied) {
    throw new Error(`illegal transition not denied as expected: ${JSON.stringify(illegalTry)}`);
  }

  // 4) idempotent same-status behavior
  const sameOrder = await createOrder({
    buyerId: buyer.userId,
    sellerId: seller.userId,
    status: "paid",
    title: `pack08a idempotent ${randomSuffix()}`,
  });
  const sameTry = await admin.rpc("transition_order_status_v2", {
    p_order_id: sameOrder.id,
    p_to_status: "paid",
    p_reason: "same status idempotent",
  });
  if (sameTry.error) throw new Error(`idempotent call failed: ${sameTry.error.message}`);
  report.checks.idempotentSameStatus = sameTry.data?.ok === true && sameTry.data?.idempotent === true;
  if (!report.checks.idempotentSameStatus) {
    throw new Error(`idempotent response unexpected: ${JSON.stringify(sameTry.data)}`);
  }

  const after = {
    buyerPointTx: await countByUser("point_transactions", buyer.userId),
    buyerEarningTx: await countByUser("earning_transactions", buyer.userId),
    buyerNotif: await countByUser("notifications", buyer.userId),
    sellerPointTx: await countByUser("point_transactions", seller.userId),
    sellerEarningTx: await countByUser("earning_transactions", seller.userId),
    sellerNotif: await countByUser("notifications", seller.userId),
  };

  report.sideEffects = {
    before,
    after,
    noPointTxSideEffect: before.buyerPointTx === after.buyerPointTx && before.sellerPointTx === after.sellerPointTx,
    noEarningTxSideEffect:
      before.buyerEarningTx === after.buyerEarningTx && before.sellerEarningTx === after.sellerEarningTx,
    noNotificationSideEffect: before.buyerNotif === after.buyerNotif && before.sellerNotif === after.sellerNotif,
  };

  report.checks.transitionMatrixAllPassed = report.transitions.every(
    (t) => t.rpc_ok && t.rpc_idempotent && t.db_status_ok && t.timestamp_ok && t.updated_at_changed,
  );
} catch (e) {
  report.errors.push(String(e?.message || e));
}

console.log(JSON.stringify(report, null, 2));
if (report.errors.length > 0) process.exit(1);
