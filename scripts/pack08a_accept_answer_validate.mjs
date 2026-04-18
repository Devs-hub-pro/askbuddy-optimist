import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
}

const now = Date.now();
const rand = Math.random().toString(36).slice(2, 8);

function mkCred(role) {
  return {
    email: `pack08a.${role}.${now}.${rand}@gmail.com`,
    password: `P08a!${rand}Abc12345`,
  };
}

async function ensureSignedClient(role) {
  const cred = mkCred(role);
  let signed = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  let userId = null;
  let accessToken = null;

  // Prefer admin-created confirmed user if service role key is available.
  if (SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const createRes = await admin.auth.admin.createUser({
      email: cred.email,
      password: cred.password,
      email_confirm: true,
      user_metadata: { source: "pack08a_validate", role },
    });
    if (createRes.error) {
      throw new Error(`admin.createUser(${role}) failed: ${createRes.error.message}`);
    }
    const signInRes = await signed.auth.signInWithPassword({
      email: cred.email,
      password: cred.password,
    });
    if (signInRes.error) {
      throw new Error(`signIn(${role}) failed: ${signInRes.error.message}`);
    }
    accessToken = signInRes.data.session?.access_token ?? null;
    userId = signInRes.data.user?.id ?? null;
  } else {
    // Fallback 1: anonymous sign-in if enabled.
    const anonRes = await signed.auth.signInAnonymously();
    if (!anonRes.error) {
      userId = anonRes.data.user?.id ?? null;
      accessToken = anonRes.data.session?.access_token ?? null;
    } else {
    // Fallback: email sign-up + sign-in.
      const signUpRes = await signed.auth.signUp({
        email: cred.email,
        password: cred.password,
      });
      if (signUpRes.error) {
        throw new Error(`signUp(${role}) failed: ${signUpRes.error.message}`);
      }
      userId = signUpRes.data.user?.id ?? null;
      accessToken = signUpRes.data.session?.access_token ?? null;

      if (!accessToken) {
        const signInRes = await signed.auth.signInWithPassword({
          email: cred.email,
          password: cred.password,
        });
        if (signInRes.error) {
          throw new Error(`signIn(${role}) failed: ${signInRes.error.message}`);
        }
        accessToken = signInRes.data.session?.access_token ?? null;
        userId = signInRes.data.user?.id ?? userId;
      }
    }
  }

  if (!accessToken || !userId) {
    throw new Error(`no usable session for ${role}`);
  }
  signed = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  return { role, userId, client: signed, cred };
}

async function countRows(client, table, eqColumn, eqValue) {
  const { count, error } = await client
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(eqColumn, eqValue);
  if (error) throw new Error(`count ${table} failed: ${error.message}`);
  return count ?? 0;
}

async function expectRpcError(client, qid, aid, contains) {
  const { data, error } = await client.rpc("accept_answer_v2", {
    p_question_id: qid,
    p_answer_id: aid,
  });
  if (!error) {
    throw new Error(`expected rpc error containing "${contains}", got success ${JSON.stringify(data)}`);
  }
  if (!error.message.includes(contains)) {
    throw new Error(`unexpected rpc error: "${error.message}", expected include "${contains}"`);
  }
  return error.message;
}

const out = {
  created: {},
  checks: {},
  sideEffects: {},
  errors: [],
};

try {
  const author = await ensureSignedClient("author");
  const answerer = await ensureSignedClient("answerer");
  const outsider = await ensureSignedClient("outsider");

  out.created.users = {
    author: author.userId,
    answerer: answerer.userId,
    outsider: outsider.userId,
  };

  const before = {
    authorPointTx: await countRows(author.client, "point_transactions", "user_id", author.userId),
    authorEarningTx: await countRows(author.client, "earning_transactions", "user_id", author.userId),
    authorNotif: await countRows(author.client, "notifications", "user_id", author.userId),
    answererPointTx: await countRows(answerer.client, "point_transactions", "user_id", answerer.userId),
    answererEarningTx: await countRows(answerer.client, "earning_transactions", "user_id", answerer.userId),
    answererNotif: await countRows(answerer.client, "notifications", "user_id", answerer.userId),
  };

  const qTitle = `Pack08A test question ${now}-${rand}`;
  const { data: q, error: qErr } = await author.client
    .from("questions")
    .insert({
      user_id: author.userId,
      author_id: author.userId,
      title: qTitle,
      description: "pack08a accept-answer rpc validation",
      status: "open",
      reward_points: 0,
    })
    .select("id, author_id, status, accepted_answer_id")
    .single();
  if (qErr) throw new Error(`insert question failed: ${qErr.message}`);

  const { data: a1, error: a1Err } = await answerer.client
    .from("answers")
    .insert({
      user_id: answerer.userId,
      question_id: q.id,
      author_id: answerer.userId,
      content: "answer 1",
      status: "active",
    })
    .select("id, question_id, author_id, status, is_accepted")
    .single();
  if (a1Err) throw new Error(`insert answer1 failed: ${a1Err.message}`);

  const { data: q2, error: q2Err } = await author.client
    .from("questions")
    .insert({
      user_id: author.userId,
      author_id: author.userId,
      title: `${qTitle} - another`,
      description: "for belongs check",
      status: "open",
      reward_points: 0,
    })
    .select("id")
    .single();
  if (q2Err) throw new Error(`insert question2 failed: ${q2Err.message}`);

  const { data: aOther, error: aOtherErr } = await answerer.client
    .from("answers")
    .insert({
      user_id: answerer.userId,
      question_id: q2.id,
      author_id: answerer.userId,
      content: "answer on another question",
      status: "active",
    })
    .select("id, question_id")
    .single();
  if (aOtherErr) throw new Error(`insert other answer failed: ${aOtherErr.message}`);

  out.checks.nonAuthorDenied = await expectRpcError(
    answerer.client,
    q.id,
    a1.id,
    "only question author can accept an answer",
  );

  out.checks.belongsDenied = await expectRpcError(
    author.client,
    q.id,
    aOther.id,
    "answer does not belong to question",
  );

  const beforeRpc = {
    authorPointTx: await countRows(author.client, "point_transactions", "user_id", author.userId),
    authorEarningTx: await countRows(author.client, "earning_transactions", "user_id", author.userId),
    authorNotif: await countRows(author.client, "notifications", "user_id", author.userId),
    answererPointTx: await countRows(answerer.client, "point_transactions", "user_id", answerer.userId),
    answererEarningTx: await countRows(answerer.client, "earning_transactions", "user_id", answerer.userId),
    answererNotif: await countRows(answerer.client, "notifications", "user_id", answerer.userId),
  };

  const { data: firstAccept, error: firstAcceptErr } = await author.client.rpc("accept_answer_v2", {
    p_question_id: q.id,
    p_answer_id: a1.id,
  });
  if (firstAcceptErr) throw new Error(`first accept failed: ${firstAcceptErr.message}`);
  out.checks.firstAccept = firstAccept;

  const { data: secondAccept, error: secondAcceptErr } = await author.client.rpc("accept_answer_v2", {
    p_question_id: q.id,
    p_answer_id: a1.id,
  });
  if (secondAcceptErr) throw new Error(`second accept failed: ${secondAcceptErr.message}`);
  out.checks.secondAccept = secondAccept;

  const afterRpc = {
    authorPointTx: await countRows(author.client, "point_transactions", "user_id", author.userId),
    authorEarningTx: await countRows(author.client, "earning_transactions", "user_id", author.userId),
    authorNotif: await countRows(author.client, "notifications", "user_id", author.userId),
    answererPointTx: await countRows(answerer.client, "point_transactions", "user_id", answerer.userId),
    answererEarningTx: await countRows(answerer.client, "earning_transactions", "user_id", answerer.userId),
    answererNotif: await countRows(answerer.client, "notifications", "user_id", answerer.userId),
  };

  const { data: a2, error: a2Err } = await outsider.client
    .from("answers")
    .insert({
      user_id: outsider.userId,
      question_id: q.id,
      author_id: outsider.userId,
      content: "answer 2",
      status: "active",
    })
    .select("id")
    .single();
  if (a2Err) throw new Error(`insert answer2 failed: ${a2Err.message}`);

  out.checks.replaceDenied = await expectRpcError(
    author.client,
    q.id,
    a2.id,
    "question already has a different accepted answer",
  );

  const { data: qAfter, error: qAfterErr } = await author.client
    .from("questions")
    .select("id, status, accepted_answer_id")
    .eq("id", q.id)
    .single();
  if (qAfterErr) throw new Error(`fetch question after failed: ${qAfterErr.message}`);

  const { data: a1After, error: a1AfterErr } = await answerer.client
    .from("answers")
    .select("id, status, is_accepted")
    .eq("id", a1.id)
    .single();
  if (a1AfterErr) throw new Error(`fetch accepted answer failed: ${a1AfterErr.message}`);

  out.checks.stateAfterAccept = { question: qAfter, acceptedAnswer: a1After };

  const directQ = await author.client
    .from("questions")
    .update({ accepted_answer_id: null })
    .eq("id", q.id)
    .select("id");
  out.checks.directQuestionWriteBlocked =
    !!directQ.error && directQ.error.message.includes("system-managed fields");

  const directA = await answerer.client
    .from("answers")
    .update({ is_accepted: false })
    .eq("id", a1.id)
    .select("id");
  out.checks.directAnswerWriteBlocked =
    !!directA.error && directA.error.message.includes("system-managed fields");

  const after = {
    authorPointTx: await countRows(author.client, "point_transactions", "user_id", author.userId),
    authorEarningTx: await countRows(author.client, "earning_transactions", "user_id", author.userId),
    authorNotif: await countRows(author.client, "notifications", "user_id", author.userId),
    answererPointTx: await countRows(answerer.client, "point_transactions", "user_id", answerer.userId),
    answererEarningTx: await countRows(answerer.client, "earning_transactions", "user_id", answerer.userId),
    answererNotif: await countRows(answerer.client, "notifications", "user_id", answerer.userId),
  };

  out.sideEffects = {
    before,
    beforeRpc,
    afterRpc,
    after,
    noPointTxDelta: beforeRpc.authorPointTx === afterRpc.authorPointTx && beforeRpc.answererPointTx === afterRpc.answererPointTx,
    noEarningTxDelta: beforeRpc.authorEarningTx === afterRpc.authorEarningTx && beforeRpc.answererEarningTx === afterRpc.answererEarningTx,
    noNotificationDelta: beforeRpc.authorNotif === afterRpc.authorNotif && beforeRpc.answererNotif === afterRpc.answererNotif,
  };
} catch (e) {
  out.errors.push(String(e?.message || e));
}

console.log(JSON.stringify(out, null, 2));

if (out.errors.length > 0) {
  process.exit(1);
}
