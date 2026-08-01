import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceRoleKey) {
  throw new Error("SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are required");
}

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anonymous = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const suffix = `${Date.now()}.${Math.random().toString(36).slice(2, 9)}`;
const createdUserIds = [];
const createdSessionIds = [];
const checks = {};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function createUser(role) {
  const email = `call.v1.${role}.${suffix}@example.com`;
  const password = `CallV1!${suffix}Aa9`;
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { source: "call_v1_validation", role },
  });
  if (createError || !created.user) {
    throw new Error(`create ${role} failed: ${createError?.message ?? "missing user"}`);
  }
  createdUserIds.push(created.user.id);

  const authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: signed, error: signInError } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !signed.session) {
    throw new Error(`sign in ${role} failed: ${signInError?.message ?? "missing session"}`);
  }

  return {
    id: created.user.id,
    client: createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${signed.session.access_token}` } },
    }),
  };
}

async function expectRpcError(client, rpc, params, expected) {
  const { data, error } = await client.rpc(rpc, params);
  assert(error, `${rpc} should fail, got ${JSON.stringify(data)}`);
  assert(
    error.message.includes(expected),
    `${rpc} error should include ${expected}, got ${error.message}`,
  );
  return true;
}

async function createSession(caller, callee) {
  const { data, error } = await caller.client.rpc("create_call_session_v1", {
    p_callee_id: callee.id,
    p_mode: "video",
    p_target_type: "manual",
  });
  if (error) throw new Error(`create session failed: ${error.message}`);
  assert(data?.call_session_id, "create session should return call_session_id");
  assert(data?.status === "ringing", `created status should be ringing, got ${data?.status}`);
  createdSessionIds.push(data.call_session_id);
  return data.call_session_id;
}

async function countForUser(table, userId) {
  const { count, error } = await admin
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw new Error(`count ${table} failed: ${error.message}`);
  return count ?? 0;
}

async function getSideEffects(userIds) {
  const result = {};
  for (const userId of userIds) {
    result[userId] = {
      notifications: await countForUser("notifications", userId),
      pointTransactions: await countForUser("point_transactions", userId),
      earningTransactions: await countForUser("earning_transactions", userId),
    };
  }
  return result;
}

try {
  const caller = await createUser("caller");
  const callee = await createUser("callee");
  const outsider = await createUser("outsider");
  const testUserIds = [caller.id, callee.id, outsider.id];
  const effectsBefore = await getSideEffects(testUserIds);

  checks.anonymousCreateBlocked = await expectRpcError(
    anonymous,
    "create_call_session_v1",
    { p_callee_id: callee.id, p_mode: "video" },
    "permission denied",
  );

  checks.selfCallBlocked = await expectRpcError(
    caller.client,
    "create_call_session_v1",
    { p_callee_id: caller.id, p_mode: "voice" },
    "CALL_INVALID_PARTICIPANT",
  );

  const answeredSessionId = await createSession(caller, callee);

  const callerRead = await caller.client
    .from("call_sessions")
    .select("id,status,caller_id,callee_id")
    .eq("id", answeredSessionId)
    .single();
  assert(!callerRead.error && callerRead.data?.id === answeredSessionId, "caller should read session");
  checks.callerCanRead = true;

  const calleeRead = await callee.client
    .from("call_sessions")
    .select("id")
    .eq("id", answeredSessionId)
    .single();
  assert(!calleeRead.error && calleeRead.data?.id === answeredSessionId, "callee should read session");
  checks.calleeCanRead = true;

  const outsiderRead = await outsider.client
    .from("call_sessions")
    .select("id")
    .eq("id", answeredSessionId);
  assert(!outsiderRead.error && outsiderRead.data?.length === 0, "outsider should not read session");
  checks.outsiderCannotRead = true;

  const directUpdate = await caller.client
    .from("call_sessions")
    .update({ status: "answered" })
    .eq("id", answeredSessionId);
  assert(directUpdate.error, "direct authenticated update should be blocked");
  checks.directUpdateBlocked = true;

  checks.outsiderCannotAccept = await expectRpcError(
    outsider.client,
    "accept_call_v1",
    { p_call_session_id: answeredSessionId },
    "CALL_FORBIDDEN",
  );
  checks.callerCannotAccept = await expectRpcError(
    caller.client,
    "accept_call_v1",
    { p_call_session_id: answeredSessionId },
    "CALL_FORBIDDEN",
  );

  const firstAccept = await callee.client.rpc("accept_call_v1", {
    p_call_session_id: answeredSessionId,
  });
  assert(!firstAccept.error, `callee accept failed: ${firstAccept.error?.message}`);
  assert(firstAccept.data?.status === "answered" && firstAccept.data?.idempotent === false, "first accept result invalid");
  checks.calleeAccepts = true;

  const secondAccept = await callee.client.rpc("accept_call_v1", {
    p_call_session_id: answeredSessionId,
  });
  assert(!secondAccept.error, `idempotent accept failed: ${secondAccept.error?.message}`);
  assert(secondAccept.data?.idempotent === true, "second accept should be idempotent");
  checks.acceptIsIdempotent = true;

  const firstEnd = await caller.client.rpc("end_call_v1", {
    p_call_session_id: answeredSessionId,
    p_reason: "validation_complete",
  });
  assert(!firstEnd.error, `end call failed: ${firstEnd.error?.message}`);
  assert(firstEnd.data?.status === "ended" && firstEnd.data?.idempotent === false, "end result invalid");
  checks.participantCanEnd = true;

  const secondEnd = await callee.client.rpc("end_call_v1", {
    p_call_session_id: answeredSessionId,
  });
  assert(!secondEnd.error && secondEnd.data?.idempotent === true, "second end should be idempotent");
  checks.endIsIdempotent = true;

  const finalAnswered = await caller.client
    .from("call_sessions")
    .select("status,started_at,ended_at,end_reason")
    .eq("id", answeredSessionId)
    .single();
  assert(!finalAnswered.error, `read ended session failed: ${finalAnswered.error?.message}`);
  assert(
    finalAnswered.data?.status === "ended" && finalAnswered.data?.started_at && finalAnswered.data?.ended_at,
    "ended session timestamps invalid",
  );
  checks.answeredLifecycleTimestamps = true;

  const rejectedSessionId = await createSession(caller, callee);
  checks.callerCannotReject = await expectRpcError(
    caller.client,
    "reject_call_v1",
    { p_call_session_id: rejectedSessionId },
    "CALL_FORBIDDEN",
  );
  const rejected = await callee.client.rpc("reject_call_v1", {
    p_call_session_id: rejectedSessionId,
    p_reason: "not_available",
  });
  assert(!rejected.error && rejected.data?.status === "cancelled", "callee reject failed");
  const rejectedAgain = await callee.client.rpc("reject_call_v1", {
    p_call_session_id: rejectedSessionId,
  });
  assert(!rejectedAgain.error && rejectedAgain.data?.idempotent === true, "reject should be idempotent");
  checks.rejectLifecycle = true;

  const cancelledSessionId = await createSession(caller, callee);
  const cancelled = await caller.client.rpc("end_call_v1", {
    p_call_session_id: cancelledSessionId,
    p_reason: "caller_cancelled",
  });
  assert(!cancelled.error && cancelled.data?.status === "cancelled", "caller cancellation failed");
  checks.callerCanCancelRinging = true;

  const effectsAfter = await getSideEffects(testUserIds);
  assert(JSON.stringify(effectsBefore) === JSON.stringify(effectsAfter), "Call RPCs introduced ledger or notification side effects");
  checks.noNotificationOrLedgerSideEffects = true;

  console.log(JSON.stringify({ ok: true, checks }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, checks, error: String(error?.message ?? error) }, null, 2));
  process.exitCode = 1;
} finally {
  if (createdSessionIds.length > 0) {
    await admin.from("call_sessions").delete().in("id", createdSessionIds);
  }
  for (const userId of createdUserIds.reverse()) {
    await admin.auth.admin.deleteUser(userId);
  }
}
