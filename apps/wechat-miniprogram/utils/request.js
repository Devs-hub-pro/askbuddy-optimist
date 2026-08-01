const mock = require('./mock');
const env = require('./env');

const CALL_RPC_NAMES = new Set([
  'create_call_session_v1',
  'accept_call_v1',
  'reject_call_v1',
  'end_call_v1'
]);

const CALL_REQUEST_NAMES = new Set(['callV1Invoke', 'fetchCallSession']);

function isJwtToken(token) {
  if (!token || typeof token !== 'string') return false;
  return token.split('.').length === 3;
}

function normalizeError(error) {
  if (!error) return new Error('unknown error');
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);
  return new Error(JSON.stringify(error));
}

function wxRequest({ url, method = 'GET', header = {}, data }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      header,
      data,
      success: resolve,
      fail: reject
    });
  });
}

function buildHeaders(userToken) {
  const token = isJwtToken(userToken) ? userToken : env.supabaseAnonKey;
  return {
    apikey: env.supabaseAnonKey,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };
}

function requireUserJwt(userToken) {
  if (isJwtToken(userToken)) return;
  const error = new Error('CALL_UNAUTHORIZED: 请先完成 Supabase 登录');
  error.code = 'CALL_UNAUTHORIZED';
  throw error;
}

function createHttpError(scope, response) {
  const message = response && response.data && response.data.message
    ? String(response.data.message)
    : `${scope} failed: ${response ? response.statusCode : 'unknown'}`;
  const error = new Error(message);
  const matchedCode = message.match(/CALL_[A-Z_]+/);
  if (matchedCode) error.code = matchedCode[0];
  return error;
}

function ensureEnvReady() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('staging config missing: supabaseUrl/supabaseAnonKey');
  }
}

async function callRpcHttp(functionName, payload = {}, options = {}) {
  ensureEnvReady();

  const app = getApp();
  const userToken = options.userToken || app.globalData.authToken;
  if (options.requireAuth) requireUserJwt(userToken);
  const url = `${env.supabaseUrl}/rest/v1/rpc/${functionName}`;
  const response = await wxRequest({
    url,
    method: 'POST',
    header: buildHeaders(userToken),
    data: payload
  });

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  }

  throw createHttpError(`rpc ${functionName}`, response);
}

async function selectTable(table, query, options = {}) {
  ensureEnvReady();

  const app = getApp();
  const userToken = options.userToken || app.globalData.authToken;
  if (options.requireAuth) requireUserJwt(userToken);
  const url = `${env.supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ''}`;
  const response = await wxRequest({
    url,
    method: 'GET',
    header: buildHeaders(userToken)
  });

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  }

  throw createHttpError(`select ${table}`, response);
}

function getSearchBag(payload) {
  const bag = payload || {};
  return {
    question: bag.questions || [],
    expert: bag.experts || [],
    skill: bag.skills || [],
    post: bag.posts || []
  };
}

async function fromStaging(name, payload = {}) {
  if (name === 'fetchHomeFeed') {
    return selectTable(
      'questions',
      'select=id,title,content,status,category,user_id,created_at,view_count&is_hidden=eq.false&order=created_at.desc&limit=20'
    );
  }

  if (name === 'searchContent') {
    try {
      const v2 = await callRpcHttp('search_app_content_v2', {
        p_query: (payload.keyword || '').trim(),
        p_limit: 10
      });
      return getSearchBag(v2 || {});
    } catch (error) {
      const legacy = await callRpcHttp('search_app_content', {
        p_query: (payload.keyword || '').trim(),
        p_limit: 10
      });
      return {
        question: legacy.questions || [],
        expert: legacy.users || [],
        skill: [],
        post: legacy.topics || []
      };
    }
  }

  if (name === 'fetchQuestionDetailWithAnswers') {
    const questionId = payload.questionId;
    if (!questionId) throw new Error('questionId required');

    const [questionList, answers] = await Promise.all([
      selectTable(
        'questions',
        `select=*&id=eq.${encodeURIComponent(questionId)}&is_hidden=eq.false&limit=1`
      ),
      selectTable(
        'answers',
        `select=id,content,question_id,user_id,is_accepted,likes_count,created_at&question_id=eq.${encodeURIComponent(questionId)}&is_hidden=eq.false&order=is_accepted.desc,likes_count.desc,created_at.asc`
      )
    ]);

    const question = Array.isArray(questionList) && questionList.length > 0 ? questionList[0] : null;
    if (!question) return null;
    return { question, answers: Array.isArray(answers) ? answers : [] };
  }

  if (name === 'fetchNotificationList') {
    return selectTable(
      'notifications',
      'select=id,type,title,content,related_id,related_type,sender_id,is_read,created_at&order=created_at.desc&limit=50'
    );
  }

  if (name === 'fetchUnreadNotificationCount') {
    const data = await callRpcHttp('get_my_unread_notification_count', {});
    return Number(data || 0);
  }

  if (name === 'fetchCallSession') {
    const callSessionId = payload && payload.callSessionId;
    if (!callSessionId) throw new Error('CALL_NOT_FOUND: missing callSessionId');
    const rows = await selectTable(
      'call_sessions',
      `select=id,order_id,target_type,target_id,caller_id,callee_id,mode,status,started_at,ended_at,end_reason,rtc_channel,created_at,updated_at&id=eq.${encodeURIComponent(callSessionId)}&limit=1`,
      { requireAuth: true }
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  if (name === 'callV1Invoke') {
    const rpcName = payload && payload.rpcName;
    const rpcPayload = payload && payload.payload ? payload.payload : {};
    if (!CALL_RPC_NAMES.has(rpcName)) {
      const error = new Error(`A_CONTRACT_GAP: unapproved call RPC ${rpcName || 'empty'}`);
      error.code = 'A_CONTRACT_GAP';
      throw error;
    }
    return callRpcHttp(rpcName, rpcPayload, { requireAuth: true });
  }

  throw new Error(`unsupported request: ${name}`);
}

async function callRpc(name, payload = {}) {
  const app = getApp();
  const useMockOnly = app.globalData.useMock === true;

  if (useMockOnly) {
    if (typeof mock[name] !== 'function') throw new Error(`mock rpc not found: ${name}`);
    return mock[name](payload);
  }

  try {
    return await fromStaging(name, payload);
  } catch (error) {
    if (CALL_REQUEST_NAMES.has(name)) {
      throw normalizeError(error);
    }
    if (!env.useMockFallback) {
      throw normalizeError(error);
    }
    if (typeof mock[name] !== 'function') {
      throw normalizeError(error);
    }
    return mock[name](payload);
  }
}

module.exports = {
  callRpc
};
