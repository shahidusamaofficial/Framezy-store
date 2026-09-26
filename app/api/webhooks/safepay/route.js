import { Safepay } from '@sfpy/node-sdk';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Lazy-init both clients — only creates them when the webhook is
// actually called, not at build time. This prevents the build from
// crashing when env vars aren't set yet.
let _safepay = null;
let _supabase = null;

function getSafepay() {
  if (_safepay) return _safepay;
  _safepay = new Safepay({
    environment: process.env.SAFEPAY_ENVIRONMENT,
    apiKey: process.env.SAFEPAY_API_KEY,
    v1Secret: process.env.SAFEPAY_V1_SECRET,
    webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
  });
  return _safepay;
}

function getSupabase() {
  if (_supabase) return _supabase;
  _supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  return _supabase;
}

export async function POST(request) {
  // Guard: if env vars aren't set, return a clear error instead of crashing
  if (!process.env.SAFEPAY_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(
      { error: 'Webhook not configured — missing env vars.' },
      { status: 500 }
    );
  }

  const safepay = getSafepay();
  const supabase = getSupabase();

  const valid = await safepay.verify.webhook(request);
  if (!valid) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  const body = await request.json();
  const orderId = body.orderId; // confirm the exact field name against a real sandbox webhook payload

  await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', orderId);

  return NextResponse.json({ received: true });
}
