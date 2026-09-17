import { NextResponse } from "next/server";

function formatPKR(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

const OWNER_EMAIL = "hello@thewalledit.pk";

export async function POST(request) {
  try {
    const { email, name, items, subtotal, shipping, total, discountCode, discountAmount } =
      await request.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email." }, { status: 400 });
    }

    if (!process.env.BREVO_API_KEY) {
      // No email service configured — don't fail the order over this.
      return NextResponse.json({ sent: false });
    }

    const itemsHtml = (items || [])
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;color:#3a2a1e;">${item.name}${item.size ? ` (${item.size})` : ""} × ${item.qty}</td>
            <td style="padding:8px 0;text-align:right;color:#3a2a1e;">${formatPKR(item.price * item.qty)}</td>
          </tr>`
      )
      .join("");

    const discountHtml =
      discountCode && discountAmount > 0
        ? `<tr><td style="padding:4px 0;color:#b08d57;">Discount (${discountCode})</td><td style="padding:4px 0;text-align:right;color:#b08d57;">-${formatPKR(discountAmount)}</td></tr>`
        : "";

    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h1 style="color:#3a2a1e; font-size: 22px;">Thanks for your order, ${name || "there"}!</h1>
        <p style="color:#6b5a4a;">We've got it and we're getting it ready. Here's a summary:</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
          ${itemsHtml}
        </table>
        <table style="width:100%; border-collapse: collapse; margin-top: 12px; border-top: 1px solid #e5ddd0; padding-top: 8px;">
          <tr><td style="padding:4px 0;color:#6b5a4a;">Subtotal</td><td style="padding:4px 0;text-align:right;color:#6b5a4a;">${formatPKR(subtotal)}</td></tr>
          ${discountHtml}
          <tr><td style="padding:4px 0;color:#6b5a4a;">Shipping</td><td style="padding:4px 0;text-align:right;color:#6b5a4a;">${shipping === 0 ? "Free" : formatPKR(shipping)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#3a2a1e;">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold;color:#3a2a1e;">${formatPKR(total)}</td></tr>
        </table>
        <p style="color:#6b5a4a; margin-top: 20px;">Expect delivery in 5–7 working days. Questions? Just reply to this email or message us on WhatsApp.</p>
        <p style="color:#3a2a1e; margin-top: 20px;">— The Wall Edit</p>
      </div>
    `;

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: OWNER_EMAIL, name: "The Wall Edit" },
        to: [{ email, name: name || undefined }],
        subject: "Your order is confirmed — The Wall Edit",
        htmlContent: html,
      }),
    });

    if (!brevoRes.ok) {
      return NextResponse.json({ sent: false });
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    // Best-effort — never let a failed email block order placement.
    return NextResponse.json({ sent: false });
  }
}
