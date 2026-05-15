module.exports = {
  environment: 'staging',
  supabaseUrl: '',
  supabaseAnonKey: '',
  // 默认走 staging 请求层；请求异常时再降级 mock。
  useMockFallback: true
};
