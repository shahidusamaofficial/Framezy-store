"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, formatPKR } from "@/lib/cart-context";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", payment: "cod" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      if (supabase) {
        const { error: dbError } = await supabase.from("orders").insert({
          customer_name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          payment_method: form.payment,
          items,
          subtotal,
          shipping,
          total,
        });
        if (dbError) throw dbError;
      }
      clearCart();
      router.push("/checkout/success");
    } catch (err) {
      setError(
        supabase
          ? "Something went wrong saving your order. Please try again or WhatsApp us directly."
          : "Supabase isn't connected yet — add your env vars to enable real checkout. Your cart is untouched."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-cream">Your bag is empty</h1>
        <p className="mt-3 text-cream/60">Add a few frames before checking out.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-display text-4xl text-cream">Checkout</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Phone number</label>
            <input
              required
              type="tel"
              placeholder="03xx-xxxxxxx"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Delivery address</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Payment</label>
            <div className="flex gap-3">
              {[
                { id: "cod", label: "Cash on Delivery" },
                { id: "card", label: "Card / Bank Transfer" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => update("payment", opt.id)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm transition ${
                    form.payment === opt.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-white/15 text-cream/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-clay py-3.5 text-sm font-semibold text-cream transition hover:bg-rust disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place Order — ${formatPKR(total)}`}
          </button>
        </form>

        <div className="glass h-fit space-y-4 rounded-2xl p-6">
          <h2 className="font-display text-xl text-cream">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.lineId} className="flex justify-between text-sm text-cream/70">
                <span>
                  {item.name} {item.size ? `(${item.size})` : ""} × {item.qty}
                </span>
                <span>{formatPKR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-cream/70">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-cream/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold text-cream">
              <span>Total</span>
              <span>{formatPKR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
