import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-provider, x-webhook-timestamp, x-webhook-signature',
};

const encoder = new TextEncoder();

const getProviderSecret = (provider: string) => {
  if (provider === 'wechat') return Deno.env.get('WECHAT_WEBHOOK_SECRET');
  if (provider === 'alipay') return Deno.env.get('ALIPAY_WEBHOOK_SECRET');
  if (provider === 'stripe') return Deno.env.get('STRIPE_WEBHOOK_SECRET');
  return null;
};

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
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const provider = request.headers.get('x-provider')?.toLowerCase() || '';
  const webhookTimestamp = request.headers.get('x-webhook-timestamp') || '';
  const providedSignature = request.headers.get('x-webhook-signature') || '';

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Missing Supabase env config' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const providerSecret = getProviderSecret(provider);
  if (!providerSecret) {
    return new Response(JSON.stringify({ error: 'Unsupported provider or missing secret' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rawBody = await request.text();
  const timestampMs = Number(webhookTimestamp);
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
    return new Response(JSON.stringify({ error: 'Webhook timestamp expired' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const expectedSignature = await createSignature(`${provider}.${webhookTimestamp}.${rawBody}`, providerSecret);
  if (providedSignature !== expectedSignature) {
    return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payload = JSON.parse(rawBody);
  const orderId = payload.order_id as string | undefined;
  const providerTransactionId = payload.provider_transaction_id as string | undefined;
  const paidCash = Number(payload.paid_cash || 0);

  if (!orderId || !providerTransactionId || !Number.isFinite(paidCash) || paidCash <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc('confirm_recharge_payment', {
    p_order_id: orderId,
    p_provider_transaction_id: providerTransactionId,
    p_paid_cash: paidCash,
    p_callback_payload: {
      ...payload,
      provider,
      verified_at: new Date().toISOString(),
      verification_mode: 'hmac_sha256',
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: !!data }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
