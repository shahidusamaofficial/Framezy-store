import { Safepay } from '@sfpy/node-sdk';
import { NextResponse } from 'next/server';

const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENVIRONMENT, // 'sandbox' or 'production'
  apiKey: process.env.SAFEPAY_API_KEY,
  v1Secret: process.env.SAFEPAY_V1_SECRET,
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});

export async function POST(request) {
  const { amount, orderId } = await request.json();
  // amount should be in the smallest currency unit conventions Safepay expects — confirm PKR format in sandbox testing

  const { token } = await safepay.payments.create({
    amount,
    currency: 'PKR',
  });

  const url = safepay.checkout.create({
    token,
    orderId,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${orderId}`,
    source: 'custom',
    webhooks: true,
  });

  return NextResponse.json({ url });
}
add payment creation route
