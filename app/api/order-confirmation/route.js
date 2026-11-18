export async function POST(request) {
  try {
    const { email, name, items, subtotal, shipping, total, discountCode, discountAmount } = await request.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@brevo.com";
    const senderName = process.env.BREVO_SENDER_NAME || "The Wall Edit";

    if (!apiKey) {
      console.log("Brevo not configured — skipping email");
      return Response.json({ ok: true, skipped: true });
    }

    const itemsHtml = items.map((item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;">
          ${item.name}${item.size ? ' (' + item.size + ')' : ''} × ${item.qty}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">
          Rs. ${(item.price * item.qty).toLocaleString()}
        </td>
      </tr>
    `).join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;margin:0;">The Wall Edit</h1>
      <p style="color:#86868b;font-size:13px;margin:4px 0 0;">Fine Art Framing & Curation</p>
    </div>

    <div style="background:#fff;border-radius:16px;padding:32px;">
      <h2 style="font-size:20px;font-weight:600;color:#1a1a1a;margin:0 0 8px;">Order confirmed ✅</h2>
      <p style="color:#86868b;font-size:14px;margin:0 0 24px;">Thank you, ${name}. Your order is being prepared.</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1a1a1a;">
        ${itemsHtml}
      </table>

      <div style="margin-top:16px;padding-top:16px;border-top:2px solid #1a1a1a;font-size:14px;">
        <div style="display:flex;justify-content:space-between;padding:4px 0;color:#86868b;">
          <span>Subtotal</span><span>Rs. ${subtotal.toLocaleString()}</span>
        </div>
        ${discountCode ? `
        <div style="display:flex;justify-content:space-between;padding:4px 0;color:#52a853;">
          <span>Discount (${discountCode})</span><span>-Rs. ${(discountAmount || 0).toLocaleString()}</span>
        </div>` : ""}
        <div style="display:flex;justify-content:space-between;padding:4px 0;color:#86868b;">
          <span>Shipping</span><span>${shipping === 0 ? "Free" : "Rs. " + shipping.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:12px 0 0;font-size:18px;font-weight:700;color:#1a1a1a;">
          <span>Total</span><span>Rs. ${total.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div style="text-align:center;margin-top:24px;padding:24px;background:#fff;border-radius:16px;">
      <p style="font-size:13px;color:#86868b;margin:0 0 12px;">Questions about your order?</p>
      <a href="https://wa.me/923016337624" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:30px;text-decoration:none;font-size:14px;font-weight:600;">WhatsApp us →</a>
    </div>

    <p style="text-align:center;color:#86868b;font-size:12px;margin-top:32px;">
      © 2026 The Wall Edit · Ships from Lahore · COD across Pakistan
    </p>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email, name: name || undefined }],
        subject: `Order confirmed — Rs. ${total.toLocaleString()} · The Wall Edit`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Brevo error:", err);
      return Response.json({ ok: true, emailFailed: true });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Order confirmation error:", err);
    return Response.json({ ok: true, error: err.message });
  }
}
