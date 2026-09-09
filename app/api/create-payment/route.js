import { Safepay } from '@sfpy/node-sdk';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENVIRONMENT,
  apiKey: process.env.SAFEPAY_API_KEY,
  v1Secret: process.env.SAFEPAY_V1_SECRET,
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});

export async function POST(request) {
  try {
    // Validate Supabase configuration
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase isn't configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, phone, address, city, items, subtotal, shipping, total } = body;

    // Validate required order details
    if (!name || !phone || !address || !city || !items?.length || !total) {
      return NextResponse.json(
        { error: "Missing required order details." },
        { status: 400 }
      );
    }

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
        status: "pending",
      })
      .select()
      .single();

    if (dbError || !order) {
      console.error("Order insert failed:", dbError);
      return NextResponse.json(
        { error: "Could not create order." },
        { status: 500 }
      );
    }

    // Create payment token with amount in paisa (PKR x 100)
    // NOTE: Safepay expects the smallest currency unit (paisa for PKR)
    const paymentResponse = await safepay.payments.create({
      amount: Math.round(total),
      currency: "PKR",
    });

    const token = paymentResponse?.token;

    if (!token) {
      console.error("Safepay did not return a token:", paymentResponse);
      return NextResponse.json(
        { error: "Could not start payment session." },
        { status: 502 }
      );
    }

    // Create checkout URL
    const checkoutUrl = await safepay.checkout.create({
      token,
      orderId: order.id,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${order.id}`,
      source: "custom",
      webhooks: true,
    });

    return NextResponse.json({ url: checkoutUrl, orderId: order.id });
  } catch (err) {
    console.error("create-payment error:", err);
    return NextResponse.json(
      { error: "Could not start payment." },
      { status: 500 }
    );
  }
}
