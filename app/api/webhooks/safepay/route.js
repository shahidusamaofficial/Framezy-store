import { Safepay } from '@sfpy/node-sdk';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENVIRONMENT,
  apiKey: process.env.SAFEPAY_API_KEY,
  v1Secret: process.env.SAFEPAY_V1_SECRET,
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role, not anon, so it can write server-side
);

export async function POST(request) {
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
Webhook something
