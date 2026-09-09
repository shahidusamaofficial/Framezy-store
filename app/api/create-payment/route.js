import { Safepay } from '@sfpy/node-sdk';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENVIRONMENT,
  apiKey: process.env.SAFEPAY_API_KEY,
  v1Secret: process.env.SAFEPAY_V1_SECRET,
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});

export async function POST(request) {
  try {
    const { name, phone, address, city, items, subtotal, shipping, total } = await request.json();

    // Save the order first, marked "pending" until the webhook confirms payment
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        customer_name: name,
        phone,
        address,
        city,
        payment_method: "safepay",
        items,
        subtotal,
        shipping,
        total,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    const { token } = await safepay.payments.create({
      amount: total,
      currency: "PKR",
    });

    const url = safepay.checkout.create({
      token,
      orderId: order.id,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${order.id}`,
      source: "custom",
      webhooks: true,
    });

    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: "Could not start payment." }, { status: 500 });
  }
}
