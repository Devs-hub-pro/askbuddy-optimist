const mock = require('./mock');
const env = require('./env');

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

function ensureEnvReady() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('staging config missing: supabaseUrl/supabaseAnonKey');
  }
}

async function callRpcHttp(functionName, payload = {}, options = {}) {
  ensureEnvReady();

  const app = getApp();
  const userToken = options.userToken || app.globalData.authToken;
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

  throw new Error(`rpc ${functionName} failed: ${response.statusCode}`);
}

async function selectTable(table, query, options = {}) {
  ensureEnvReady();

  const app = getApp();
  const userToken = options.userToken || app.globalData.authToken;
  const url = `${env.supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ''}`;
  const response = await wxRequest({
    url,
    method: 'GET',
    header: buildHeaders(userToken)
  });

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  }

  throw new Error(`select ${table} failed: ${response.statusCode}`);
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

  if (name === 'callV1Invoke') {
    const rpcName = payload && payload.rpcName;
    const rpcPayload = payload && payload.payload ? payload.payload : {};
    if (!rpcName) throw new Error('A_CONTRACT_GAP: missing call rpcName');
    return callRpcHttp(rpcName, rpcPayload);
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
