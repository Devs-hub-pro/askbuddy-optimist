import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY are required for rpc smoke tests.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const checks = [
  async () => {
    const { data, error } = await supabase.rpc('search_app_content', {
      p_query: '测试',
      p_limit: 3,
    });
    if (error) throw error;
    if (!data || typeof data !== 'object') {
      throw new Error('search_app_content returned invalid payload');
    }
  },
];

for (const check of checks) {
  await check();
}

console.log('RPC smoke tests passed.');
