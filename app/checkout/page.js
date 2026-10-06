"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Tag, Loader2 as LoaderIcon, X, Truck, ShieldCheck, RotateCcw, MessageCircle, Lock } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";
import { supabase } from "@/lib/supabaseClient";

const SHIPPING_FLAT_RATE = 250;
const FREE_SHIPPING_THRESHOLD = 6000;

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart, updateQty, removeItem } = useCart();
  const isAdvancePayment = (paymentMethod) =>
    paymentMethod === "safepay" || paymentMethod === "card";
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", payment: "cod" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const advancePaymentSelected = isAdvancePayment(form.payment);
  const discountAmount = appliedDiscount
    ? Math.round(subtotal * (appliedDiscount.percentOff / 100))
    : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const effectiveShipping = advancePaymentSelected ? 0 : shipping;
  const effectiveTotal = discountedSubtotal + effectiveShipping;

  // Free shipping progress
  const shippingProgress = advancePaymentSelected
    ? 100
    : Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function applyDiscount() {
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    setApplyingDiscount(true);
    setDiscountError("");
    try {
      if (!supabase) throw new Error("Discounts aren't available right now.");
      const { data, error: lookupError } = await supabase
        .from("discount_codes")
        .select("code, percent_off")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();
      if (lookupError || !data) {
        setDiscountError("That code isn't valid or has expired.");
        setAppliedDiscount(null);
        return;
      }
      setAppliedDiscount({ code: data.code, percentOff: data.percent_off });
      setDiscountInput("");
    } catch (err) {
      setDiscountError("That code isn't valid or has expired.");
      setAppliedDiscount(null);
    } finally {
      setApplyingDiscount(false);
    }
  }

  function removeDiscount() {
    setAppliedDiscount(null);
    setDiscountError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    const discountFields = appliedDiscount
      ? { discount_code: appliedDiscount.code, discount_amount: discountAmount }
      : { discount_code: null, discount_amount: 0 };

    if (form.payment === "safepay") {
      try {
        const res = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            items,
            subtotal,
            shipping: effectiveShipping,
            total: effectiveTotal,
            ...discountFields,
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

    try {
      if (supabase) {
        const { error: dbError } = await supabase.from("orders").insert({
          customer_name: form.name,
          customer_email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          payment_method: form.payment,
          items,
          subtotal,
          shipping: effectiveShipping,
          total: effectiveTotal,
          ...discountFields,
        });
        if (dbError) throw dbError;
      }

      try {
        await fetch("/api/order-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            items,
            subtotal,
            shipping: effectiveShipping,
            total: effectiveTotal,
            discountCode: appliedDiscount?.code || null,
            discountAmount,
          }),
        });
      } catch (emailErr) {
        // Ignore — order is already saved.
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
      <main className="mx-auto max-w-xl px-5 py-32 text-center">
        <div className="mb-6 text-6xl opacity-20">🛍️</div>
        <h1 className="font-display text-4xl font-medium text-cream">Your bag is empty</h1>
        <p className="mt-3 text-cream/60">Add a few frames before checking out.</p>
        <a
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold"
        >
          Browse the collection
        </a>
      </main>
    );
  }

  return (
    <main className="bg-ink">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-16">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Almost there
            </span>
          </motion.div>
          <h1 className="font-display text-huge font-medium text-cream">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="block pb-4 pt-1 leading-[1.1]"
              >
                Checkout
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Free shipping progress bar */}
        {!advancePaymentSelected && remainingForFreeShipping > 0 && (
          <div className="mb-8 rounded-2xl border border-cream/10 bg-charcoal/40 p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-cream/70">
                <Truck size={14} className="text-gold" />
                Add {formatPKR(remainingForFreeShipping)} more for free shipping
              </span>
              <span className="text-cream/40">{formatPKR(subtotal)} / {formatPKR(FREE_SHIPPING_THRESHOLD)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cream/10">
              <motion.div
                className="h-full bg-gradient-to-r from-gold to-butter"
                initial={{ width: 0 }}
                animate={{ width: `${shippingProgress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        {advancePaymentSelected && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm text-gold">
            <Truck size={16} />
            Free shipping unlocked with advance payment 🎉
          </div>
        )}
      </section>

      {/* Main checkout layout */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          {/* LEFT: form + payment */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Contact details */}
            <div className="rounded-2xl border border-cream/10 bg-charcoal/40 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">1</span>
                <h2 className="font-display text-xl font-medium text-cream">Contact details</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-cream/50">Full name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Ahmed Khan"
                    className="w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-cream/50">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-cream/50">Phone (WhatsApp)</label>
                  <input
                    required
                    type="tel"
                    placeholder="03xx-xxxxxxx"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="rounded-2xl border border-cream/10 bg-charcoal/40 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">2</span>
                <h2 className="font-display text-xl font-medium text-cream">Delivery address</h2>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-cream/50">Street address</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="House #, street, area, landmarks"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-cream/50">City</label>
                  <input
                    required
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl border border-cream/10 bg-charcoal/40 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">3</span>
                <h2 className="font-display text-xl font-medium text-cream">Payment method</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "cod", label: "Cash on Delivery", desc: "Pay when your frames arrive. Rs. 250 shipping applies.", icon: Truck },
                  { id: "safepay", label: "Card / JazzCash / Easypaisa", desc: "Pay online via Safepay. Free shipping included.", icon: Lock },
                  { id: "card", label: "Bank Transfer", desc: "Transfer to our bank, send receipt on WhatsApp. Free shipping.", icon: ShieldCheck },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => update("payment", opt.id)}
                    className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                      form.payment === opt.id
                        ? "border-gold bg-gold/10"
                        : "border-cream/15 hover:border-gold/40"
                    }`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      form.payment === opt.id ? "border-gold bg-gold" : "border-cream/30"
                    }`}>
                      {form.payment === opt.id && <span className="h-2 w-2 rounded-full bg-ink" />}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <opt.icon size={15} className={form.payment === opt.id ? "text-gold" : "text-cream/40"} />
                        <span className={`text-sm font-semibold ${form.payment === opt.id ? "text-gold" : "text-cream"}`}>{opt.label}</span>
                      </div>
                      <p className="mt-1 text-xs text-cream/50">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-clay/30 bg-clay/10 p-4 text-sm text-clay">
                {error}
              </div>
            )}

            {/* Place order button (mobile shows below summary, desktop here) */}
            <button
              type="submit"
              disabled={submitting}
              className="magnetic flex items-center justify-center gap-2 rounded-full bg-cream py-4 text-sm font-semibold text-ink transition hover:bg-gold disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderIcon size={16} className="animate-spin" />
                  {form.payment === "safepay" ? "Redirecting to Safepay…" : "Placing order…"}
                </>
              ) : (
                <>Place Order — {formatPKR(effectiveTotal)}</>
              )}
            </button>

            <p className="text-center text-xs text-cream/40">
              By placing this order, you agree to our terms. Your data is secure and never shared.
            </p>
          </form>

          {/* RIGHT: order summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-cream/10 bg-charcoal/40 p-6 md:p-8">
              <h2 className="mb-6 font-display text-xl font-medium text-cream">Order summary</h2>

              {/* Items */}
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.lineId} className="flex gap-3">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream/5">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm leading-snug text-cream">{item.name}</p>
                        {item.size && <p className="text-xs text-cream/50">{item.size}</p>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-cream/15">
                          <button
                            type="button"
                            onClick={() => updateQty(item.lineId, item.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center text-cream/60 transition hover:text-cream"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.lineId, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center text-cream/60 transition hover:text-cream"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-gold">
                          {formatPKR(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.lineId)}
                      aria-label="Remove item"
                      className="self-start p-1 text-cream/30 transition hover:text-clay"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Discount code */}
              <div className="mt-6 border-t border-cream/10 pt-4">
                {appliedDiscount ? (
                  <div className="flex items-center justify-between rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-sm">
                    <span className="flex items-center gap-1.5 text-gold">
                      <Tag size={13} /> {appliedDiscount.code} ({appliedDiscount.percentOff}% off)
                    </span>
                    <button type="button" onClick={removeDiscount} aria-label="Remove discount code">
                      <X size={14} className="text-cream/50 transition hover:text-cream" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        placeholder="Discount code"
                        className="flex-1 rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-sm text-cream outline-none transition focus:border-gold"
                      />
                      <button
                        type="button"
                        onClick={applyDiscount}
                        disabled={applyingDiscount || !discountInput.trim()}
                        className="flex items-center gap-1.5 rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/80 transition hover:border-gold hover:text-gold disabled:opacity-50"
                      >
                        {applyingDiscount && <LoaderIcon size={13} className="animate-spin" />}
                        Apply
                      </button>
                    </div>
                    {discountError && <p className="mt-1.5 text-xs text-clay">{discountError}</p>}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2 border-t border-cream/10 pt-4 text-sm">
                <div className="flex justify-between text-cream/70">
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-gold">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-{formatPKR(discountAmount)}</span>
                  </div>
                )}
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
                <div className="flex justify-between border-t border-cream/10 pt-3 text-base font-semibold text-cream">
                  <span>Total</span>
                  <span className="font-display text-xl text-gold">{formatPKR(effectiveTotal)}</span>
                </div>
              </div>

              {/* Trust mini-bar */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-cream/10 pt-6">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <ShieldCheck size={16} className="text-gold" />
                  <span className="text-[10px] text-cream/50">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <RotateCcw size={16} className="text-gold" />
                  <span className="text-[10px] text-cream/50">7-day returns</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <MessageCircle size={16} className="text-gold" />
                  <span className="text-[10px] text-cream/50">WhatsApp support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
