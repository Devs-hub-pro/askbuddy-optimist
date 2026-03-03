import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const encoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

const createSignature = async (payload: string, secret: string) => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
  return toHex(signature);
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const authHeader = request.headers.get('Authorization');
  const wechatAppId = Deno.env.get('WECHAT_APP_ID');
  const wechatMchId = Deno.env.get('WECHAT_MCH_ID');
  const wechatNotifyUrl = Deno.env.get('WECHAT_NOTIFY_URL');
  const signingSecret = Deno.env.get('WECHAT_PAY_SIGNING_SECRET');

  if (!supabaseUrl || !anonKey || !authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Supabase context' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!wechatAppId || !wechatMchId || !wechatNotifyUrl || !signingSecret) {
    return new Response(JSON.stringify({ error: 'Missing WeChat pay config' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { points } = await request.json();
  const normalizedPoints = Number(points);

  if (!Number.isFinite(normalizedPoints) || normalizedPoints <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid points amount' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data, error } = await supabase.rpc('create_recharge_payment_order', {
    p_points: normalizedPoints,
    p_payment_method: 'wechat',
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const order = data as {
    order_id: string;
    provider_order_id: string;
    points: number;
    cash_amount: number;
  };

  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  const nonceStr = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
  const prepayId = `mock_${order.provider_order_id}`;
  const packageValue = `Sign=WXPay;prepay_id=${prepayId}`;
  const signType = 'HMAC-SHA256';
  const signPayload = [
    wechatAppId,
    timestamp,
    nonceStr,
    packageValue,
  ].join('\n');
  const paySign = await createSignature(signPayload, signingSecret);

  return new Response(
    JSON.stringify({
      ...order,
      provider: 'wechat',
      payment_payload: {
        appid: wechatAppId,
        partnerid: wechatMchId,
        prepayid: prepayId,
        package: packageValue,
        noncestr: nonceStr,
        timestamp,
        sign: paySign,
        signType,
        notify_url: wechatNotifyUrl,
        sign_mode: 'server_hmac_sha256',
        merchant_order_id: order.provider_order_id,
        amount_fen: Math.round(order.cash_amount * 100),
        is_mock_gateway: true,
      },
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});
