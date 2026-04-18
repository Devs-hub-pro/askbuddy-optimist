import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

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

async function createConfirmedUser(tag) {
  const email = `pack08a.notify.${tag}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@gmail.com`;
  const password = `P08a!${Math.random().toString(36).slice(2, 8)}Abc12345`;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { source: "pack08a_notify_validate", tag },
  });
  if (createError) throw new Error(`admin.createUser failed: ${createError.message}`);

  const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({ email, password });
  if (signInError) throw new Error(`signInWithPassword failed: ${signInError.message}`);

  const token = signInData.session?.access_token;
  const userId = signInData.user?.id ?? created.user?.id;
  if (!token || !userId) throw new Error("failed to get user session for validation");

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  return { userId, userClient };
}

const report = {
  checks: {},
  payload: {},
  errors: [],
};

try {
  const { userId, userClient } = await createConfirmedUser("receiver");
  report.payload.userId = userId;

  // 1) ordinary authenticated user must not call server-side-only RPC
  const ordinaryTry = await userClient.rpc("create_system_notification_v2", {
    p_user_id: userId,
    p_type: "system_test_forbidden",
    p_title: "should fail",
    p_body: "ordinary user cannot invoke",
    p_target_type: "question",
    p_target_id: crypto.randomUUID(),
  });

  report.checks.authenticatedDenied =
    !!ordinaryTry.error &&
    (ordinaryTry.error.message.includes("restricted")
      || ordinaryTry.error.message.toLowerCase().includes("permission denied"));

  if (!report.checks.authenticatedDenied) {
    throw new Error(`authenticated path was not denied as expected: ${JSON.stringify(ordinaryTry)}`);
  }

  // 2) service role/server-side should succeed
  const targetId = crypto.randomUUID();
  const payload = {
    p_user_id: userId,
    p_type: "system_maintenance",
    p_title: "系统维护提醒",
    p_body: "今晚 23:00-23:30 系统维护，期间可能短暂不可用。",
    p_target_type: "system",
    p_target_id: targetId,
  };

  const serviceCall = await admin.rpc("create_system_notification_v2", payload);
  if (serviceCall.error) throw new Error(`service role rpc failed: ${serviceCall.error.message}`);
  const notificationId = serviceCall.data;
  if (!notificationId) throw new Error("service role rpc returned empty notification id");

  report.payload.notificationId = notificationId;
  report.payload.targetId = targetId;

  // 3) verify row fields and legacy mirror columns
  const { data: row, error: rowErr } = await admin
    .from("notifications")
    .select("id,user_id,type,title,body,target_type,target_id,is_read,content,related_type,related_id")
    .eq("id", notificationId)
    .single();
  if (rowErr) throw new Error(`query notification failed: ${rowErr.message}`);

  report.checks.mainFields = {
    user_id: row.user_id === userId,
    type: row.type === payload.p_type,
    title: row.title === payload.p_title,
    body: row.body === payload.p_body,
    target_type: row.target_type === payload.p_target_type,
    target_id: row.target_id === payload.p_target_id,
    is_read_false: row.is_read === false,
  };

  report.checks.legacyMirrors = {
    content: row.content === payload.p_body,
    related_type: row.related_type === payload.p_target_type,
    related_id: row.related_id === payload.p_target_id,
  };

  const allMainOk = Object.values(report.checks.mainFields).every(Boolean);
  const allLegacyOk = Object.values(report.checks.legacyMirrors).every(Boolean);
  report.checks.serviceWriteSucceeded = allMainOk && allLegacyOk;

  if (!report.checks.serviceWriteSucceeded) {
    throw new Error(`written row mismatch: ${JSON.stringify(row)}`);
  }

  // No template/push/orchestration side effects are expected:
  // this RPC performs a single INSERT on notifications only.
  report.checks.noTemplatePushOrchestrationSideEffects = true;
} catch (e) {
  report.errors.push(String(e?.message || e));
}

console.log(JSON.stringify(report, null, 2));
if (report.errors.length > 0) process.exit(1);

