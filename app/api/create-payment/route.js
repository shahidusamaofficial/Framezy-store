import { NextResponse } from "next/server";
import { getSafepayClient } from "@/lib/safepay";
import { supabase } from "@/lib/supabaseClient";
import { SITE_URL } from "@/lib/site-config";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, address, city, items, subtotal, shipping, total } = body;

    if (!name || !phone || !address || !city || !items?.length || !total) {
      return NextResponse.json({ error: "Missing required order details." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase isn't configured on the server." },
        { status: 500 }
      );
    }

    // 1. Save the order first, as "pending" — the webhook flips it to
    // "paid" once Safepay confirms the payment actually succeeded.
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
      return NextResponse.json({ error: "Could not create order." }, { status: 500 });
    }

    // 2. Ask Safepay for a payment token.
    // NOTE: I'm sending the amount in paisa (PKR x 100), matching the
    // smallest-currency-unit convention most payment APIs use (like
    // Stripe). This is the most likely convention based on Safepay's own
    // SDK examples, but I could not 100% confirm it without a live test.
    // ⚠️ Before going live: run one sandbox test transaction and check
    // the amount shown in the Safepay dashboard matches what you expect.
    // If it's off by 100x in either direction, remove or add the `* 100`
    // below.
    const safepay = getSafepayClient();
    const paymentResponse = await safepay.payments.create({
      amount: Math.round(total * 100),
      currency: "PKR",
    });
    const token = paymentResponse?.data?.token;

    if (!token) {
      console.error("Safepay did not return a token:", paymentResponse);
      return NextResponse.json({ error: "Could not start payment session." }, { status: 502 });
    }

    // 3. Turn that token into an actual checkout URL to redirect the
    // customer to.
    const checkoutUrl = await safepay.checkout.create({
      token,
      orderId: order.id,
      cancelUrl: `${SITE_URL}/checkout/cancelled`,
      redirectUrl: `${SITE_URL}/checkout/success`,
      source: "custom",
      webhooks: true,
    });

    return NextResponse.json({ url: checkoutUrl, orderId: order.id });
  } catch (err) {
    console.error("create-payment error:", err);
    return NextResponse.json({ error: "Something went wrong starting payment." }, { status: 500 });
  }
}
