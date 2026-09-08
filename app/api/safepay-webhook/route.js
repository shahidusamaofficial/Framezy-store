import { NextResponse } from "next/server";
import { getSafepayClient } from "@/lib/safepay";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Configure this exact URL in your Safepay dashboard under Webhooks:
//   https://yourdomain.com/api/safepay-webhook
//
// ⚠️ Untested against a live Safepay account — the official SDK docs show
// `safepay.verify.webhook(request)` but don't specify exactly what shape
// `request` needs to be. Next.js Route Handlers hand you a standard Web
// API Request object, which should work if the SDK supports it — but if
// signature verification fails in testing, check Safepay's support for
// the exact expected format (it may need raw body text extracted
// differently, or specific headers passed separately).
export async function POST(request) {
  try {
    const safepay = getSafepayClient();

    let isValid = false;
    try {
      isValid = await safepay.verify.webhook(request);
    } catch (verifyErr) {
      console.error("Webhook verification threw an error:", verifyErr);
      return NextResponse.json({ error: "Verification failed." }, { status: 400 });
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    const payload = await request.json();
    // The exact field name Safepay uses for "your order id" in the
    // webhook payload wasn't confirmed from documentation — common names
    // are `order_id` or `orderId`. Check the actual payload you receive
    // in a sandbox test and adjust this line if neither matches.
    const orderId = payload?.order_id || payload?.orderId || payload?.data?.order_id;
    const paymentStatus = payload?.status || payload?.data?.status;

    if (!orderId) {
      console.error("Webhook payload missing an order id:", payload);
      return NextResponse.json({ error: "Missing order reference." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error("SUPABASE_SERVICE_ROLE_KEY isn't configured — cannot update order status.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });
    }

    const isSuccess = !paymentStatus || ["success", "paid", "completed"].includes(
      String(paymentStatus).toLowerCase()
    );

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: isSuccess ? "paid" : "payment_failed" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order status:", updateError);
      return NextResponse.json({ error: "Could not update order." }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("safepay-webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
