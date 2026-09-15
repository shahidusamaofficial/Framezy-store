"use client";

import { useState } from "react";
import { Mail, MessageCircle, Loader2, Check } from "lucide-react";

export default function DiscountSignup() {
  const [type, setType] = useState("email");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { code, percentOff } | null
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value: value.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <div className="glass rounded-3xl border border-gold/20 px-6 py-10 text-center md:px-14 md:py-14">
        {result ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
              <Check size={22} className="text-gold" />
            </div>
            <h2 className="font-display text-2xl text-cream md:text-3xl">You're in!</h2>
            <p className="mt-3 text-cream/70">
              Use this code at checkout for {result.percentOff}% off your order:
            </p>
            <p className="mt-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-6 py-2 font-display text-xl tracking-wide text-gold">
              {result.code}
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl text-cream md:text-3xl">Get 10% off your first order</h2>
            <p className="mt-3 text-cream/70">
              Sign up with your email or WhatsApp number and we'll send you a discount code.
            </p>

            <div className="mx-auto mt-6 flex w-fit rounded-full border border-white/15 p-1 text-sm">
              <button
                type="button"
                onClick={() => setType("email")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition ${
                  type === "email" ? "bg-gold text-ink" : "text-cream/60"
                }`}
              >
                <Mail size={14} /> Email
              </button>
              <button
                type="button"
                onClick={() => setType("whatsapp")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition ${
                  type === "whatsapp" ? "bg-gold text-ink" : "text-cream/60"
                }`}
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto mt-5 flex max-w-sm flex-col gap-3 sm:flex-row">
              <input
                required
                type={type === "email" ? "email" : "tel"}
                placeholder={type === "email" ? "you@example.com" : "03xx-xxxxxxx"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-cream outline-none focus:border-gold"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-full bg-clay px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? "Sending…" : "Get My Code"}
              </button>
            </form>

            {error && <p className="mt-3 text-sm text-clay">{error}</p>}
          </>
        )}
      </div>
    </section>
  );
}
