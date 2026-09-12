"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart, updateQty, removeItem } = useCart();
  const isAdvancePayment = (paymentMethod) =>
    paymentMethod === "safepay" || paymentMethod === "card";
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", payment: "cod" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const advancePaymentSelected = isAdvancePayment(form.payment);
  const effectiveShipping = advancePaymentSelected ? 0 : shipping;
  const effectiveTotal = subtotal + effectiveShipping;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    // Safepay (card / JazzCash / Easypaisa) — hands off to a server route
    // that creates the order and returns a Safepay checkout URL to
    // redirect to. The cart is only cleared after a real successful
    // payment, confirmed by the webhook — not here.
    if (form.payment === "safepay") {
      try {
        const res = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            address: form.address,
            city: form.city,
            items,
            subtotal,
            shipping: effectiveShipping,
            total: effectiveTotal,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.url) {
          throw new Error(data.error || "Could not start payment.");
        }
        window.location.href = data.url;
        return;
      } catch (err) {
        setError("Something went wrong starting your payment. Please try again or choose Cash on Delivery.");
        setSubmitting(false);
        return;
      }
    }

    // Cash on Delivery / bank transfer — existing direct-insert flow.
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
          shipping: effectiveShipping,
          total: effectiveTotal,
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: "cod", label: "Cash on Delivery" },
                { id: "safepay", label: "Card / JazzCash / Easypaisa" },
                { id: "card", label: "Bank Transfer" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => update("payment", opt.id)}
                  className={`rounded-xl border py-2.5 px-3 text-sm transition ${
                    form.payment === opt.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-white/15 text-cream/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {form.payment === "safepay" && (
              <p className="mt-2 text-xs text-cream/50">
                You'll be redirected to Safepay's secure checkout to complete payment.
              </p>
            )}
            {advancePaymentSelected && shipping > 0 && (
              <p className="mt-2 text-xs text-gold">
                Shipping fee waived for advance payment 🎉
              </p>
            )}
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-clay py-3.5 text-sm font-semibold text-cream transition hover:bg-rust disabled:opacity-60"
          >
            {submitting
              ? form.payment === "safepay"
                ? "Redirecting to Safepay…"
                : "Placing order…"
              : `Place Order — ${formatPKR(effectiveTotal)}`}
          </button>
        </form>

        <div className="glass h-fit space-y-4 rounded-2xl p-6">
          <h2 className="font-display text-xl text-cream">Order Summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.lineId} className="flex gap-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm leading-snug text-cream">{item.name}</p>
                    {item.size && <p className="text-xs text-cream/50">{item.size}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-white/15">
                      <button
                        type="button"
                        onClick={() => updateQty(item.lineId, item.qty - 1)}
                        className="p-1.5 text-cream/60 hover:text-cream"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.lineId, item.qty + 1)}
                        className="p-1.5 text-cream/60 hover:text-cream"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-medium text-cream">
                      {formatPKR(item.price * item.qty)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.lineId)}
                  aria-label="Remove item"
                  className="self-start p-1 text-cream/30 hover:text-clay"
                >
                  <Trash2 size={15} />
                </button>
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
              <span>
                {effectiveShipping === 0 ? (
                  <span className="text-gold">Free</span>
                ) : (
                  formatPKR(effectiveShipping)
                )}
              </span>
            </div>
            {advancePaymentSelected && shipping > 0 && (
              <p className="text-[11px] text-gold/80">Waived for advance payment</p>
            )}
            <div className="flex justify-between pt-2 text-base font-semibold text-cream">
              <span>Total</span>
              <span>{formatPKR(effectiveTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
