import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { type, value } = await request.json();

    if (!type || !value) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    const code = "LAUNCH10";
    const percentOff = 10;

    // Save to DB — non-blocking, won't crash the route if it fails
    if (supabase) {
      try {
        await supabase.from("subscribers").insert({ contact_type: type, contact_value: value });
      } catch (dbErr) {
        console.log("DB save failed (non-blocking):", dbErr.message);
      }
    }

    // Email the customer their discount code via Brevo
    if (process.env.BREVO_API_KEY && type === "email") {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@brevo.com";
      const senderName = process.env.BREVO_SENDER_NAME || "The Wall Edit";

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,sans-serif;">
<div style="max-width:480px;margin:0 auto;padding:40px 20px;">
<div style="background:#fff;border-radius:16px;padding:32px;text-align:center;">
<h1 style="font-size:22px;font-weight:700;margin:0 0 8px;">The Wall Edit</h1>
<p style="color:#86868b;font-size:13px;margin:0 0 24px;">Fine Art Framing & Curation</p>
<h2 style="font-size:20px;font-weight:600;margin:0 0 16px;">Here's your ${percentOff}% off code</h2>
<p style="color:#86868b;font-size:14px;margin:0 0 20px;">Use this code at checkout:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:2px;background:#f5f5f7;border-radius:12px;padding:16px;margin:0 0 20px;">${code}</p>
<a href="https://www.thewalledit.pk/shop" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 28px;border-radius:30px;text-decoration:none;font-size:14px;font-weight:600;">Shop now</a>
</div>
<p style="text-align:center;color:#86868b;font-size:11px;margin-top:24px;">The Wall Edit - Ships from Lahore - COD across Pakistan</p>
</div></body></html>`;

      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: value }],
            subject: `Your ${percentOff}% off code - The Wall Edit`,
            htmlContent: html,
          }),
        });
        if (!brevoRes.ok) {
          console.log("Brevo error:", await brevoRes.text());
        }
      } catch (e) {
        console.log("Brevo failed:", e.message);
      }
    }

    return NextResponse.json({ code, percentOff });
  } catch (err) {
    console.log("Subscribe error:", err.message);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
