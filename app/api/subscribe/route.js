import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const OWNER_EMAIL = "hello@thewalledit.pk";
const DEFAULT_CODE = "TWE10";

export async function POST(request) {
  try {
    const { type, value } = await request.json();

    if (!type || !value || !["email", "whatsapp"].includes(type)) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    // Save the signup.
    if (supabase) {
      const { error: dbError } = await supabase.from("subscribers").insert({
        contact_type: type,
        contact_value: value,
      });
      if (dbError) {
        return NextResponse.json({ error: "Could not save your details." }, { status: 500 });
      }
    }

    // Look up the active discount code to hand back to the customer.
    let code = DEFAULT_CODE;
    let percentOff = 10;
    if (supabase) {
      const { data } = await supabase
        .from("discount_codes")
        .select("code, percent_off")
        .eq("active", true)
        .limit(1)
        .maybeSingle();
      if (data) {
        code = data.code;
        percentOff = data.percent_off;
      }
    }

    // Email the owner via Brevo, if configured. This is best-effort — the
    // signup itself already succeeded above, so a failed notification email
    // shouldn't fail the whole request.
    if (process.env.BREVO_API_KEY) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { email: OWNER_EMAIL, name: "The Wall Edit — Website" },
            to: [{ email: OWNER_EMAIL }],
            subject: "New discount signup",
            htmlContent: `<p>New signup for the ${percentOff}% off code:</p>
              <p><strong>${type === "email" ? "Email" : "WhatsApp"}:</strong> ${value}</p>`,
          }),
        });
      } catch (emailError) {
        // Swallow — the signup already succeeded, don't block on the email.
      }
    }

    return NextResponse.json({ code, percentOff });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
