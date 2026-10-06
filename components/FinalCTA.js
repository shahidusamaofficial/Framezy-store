"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Mail, MessageCircle, Loader2, Check, ArrowUpRight } from "lucide-react";

/**
 * FinalCTA — the closing section. A full-bleed image background
 * with a glass panel containing the discount signup form. The
 * background image slowly parallaxes as you scroll into view.
 *
 * Form logic is identical to the original DiscountSignup — same
 * /api/subscribe endpoint, same code reveal UI.
 */
export default function FinalCTA() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const [type, setType] = useState("email");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
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
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-24 md:py-32">
      {/* Full-bleed background image with parallax */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10 scale-110">
        <Image
          src="/brand/hero-photo.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      </motion.div>

      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-hero rounded-3xl px-6 py-12 text-center md:px-16 md:py-16"
        >
          {result ? (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
                <Check size={24} className="text-gold" />
              </div>
              <h2 className="font-display text-huge font-medium text-cream">
                You&apos;re in.
              </h2>
              <p className="mt-4 text-cream/70">
                Use this code at checkout for {result.percentOff}% off your order:
              </p>
              <p className="mt-5 inline-block rounded-full border border-gold/40 bg-gold/10 px-7 py-2.5 font-display text-2xl tracking-wide text-gold">
                {result.code}
              </p>
            </>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs uppercase tracking-[0.3em] text-gold">
                  Start your wall
                </span>
                <span className="h-px w-8 bg-gold" />
              </div>
              <h2 className="font-display text-huge font-medium text-cream">
                Get 10% off
                <br />
                <span className="italic font-light text-cream/70">your first piece.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-cream/70">
                Sign up with your email or WhatsApp and we&apos;ll send a code
                you can use today.
              </p>

              {/* Toggle */}
              <div className="mx-auto mt-7 flex w-fit rounded-full border border-cream/15 p-1 text-sm">
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

              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  required
                  type={type === "email" ? "email" : "tel"}
                  placeholder={type === "email" ? "you@example.com" : "03xx-xxxxxxx"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex-1 rounded-full border border-cream/15 bg-cream/5 px-5 py-3 text-sm text-cream outline-none transition focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="magnetic inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? "Sending…" : "Get my code"}
                  {!submitting && <ArrowUpRight size={14} />}
                </button>
              </form>

              {error && <p className="mt-3 text-sm text-clay">{error}</p>}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}