"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Mail, MessageCircle, Loader2, Check, Sparkles } from "lucide-react";

/**
 * ExitIntentPopup — detects when the user is about to leave (mouse
 * moves toward the top of the viewport, like closing the tab) and
 * shows a discount capture popup. Also triggers after 30 seconds
 * of inactivity as a fallback.
 *
 * Shows ONCE per browser (localStorage flag), so it never annoys
 * returning visitors. Disabled entirely on mobile (no reliable exit
 * intent signal) and for reduced-motion users.
 *
 * Uses the same /api/subscribe endpoint as the homepage FinalCTA,
 * so discount codes work identically.
 */
const STORAGE_KEY = "twe_exit_popup_shown";
const INACTIVITY_MS = 30000; // 30 seconds

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("email");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    // Skip on mobile — no reliable exit intent
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Skip if already shown
    if (localStorage.getItem(STORAGE_KEY)) return;

    let inactivityTimer;
    let hasShown = false;

    function show() {
      if (hasShown) return;
      hasShown = true;
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, "1");
      clearTimeout(inactivityTimer);
    }

    function onMouseLeave(e) {
      // Only trigger when the mouse leaves through the TOP of the viewport
      if (e.clientY <= 0) {
        show();
        document.removeEventListener("mouseleave", onMouseLeave);
      }
    }

    function resetInactivity() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(show, INACTIVITY_MS);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousemove", resetInactivity);
    document.addEventListener("scroll", resetInactivity);
    document.addEventListener("keydown", resetInactivity);
    resetInactivity(); // start the initial timer

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousemove", resetInactivity);
      document.removeEventListener("scroll", resetInactivity);
      document.removeEventListener("keydown", resetInactivity);
      clearTimeout(inactivityTimer);
    };
  }, [prefersReduced]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

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

  function close() {
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-ink/80 backdrop-blur-md"
            onClick={close}
          />

          {/* Popup */}
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-hero relative w-full max-w-md overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 text-cream/60 transition hover:bg-cream/20 hover:text-cream"
              >
                <X size={16} />
              </button>

              {/* Ambient orb */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/15 blur-[100px]"
              />

              <div className="relative p-8 md:p-10">
                {result ? (
                  // Success state
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
                      <Check size={26} className="text-gold" />
                    </div>
                    <h2 className="font-display text-3xl font-medium text-cream">
                      You&apos;re in!
                    </h2>
                    <p className="mt-3 text-sm text-cream/70">
                      Use this code at checkout for {result.percentOff}% off your first order:
                    </p>
                    <p className="mt-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-6 py-2.5 font-display text-xl tracking-wide text-gold">
                      {result.code}
                    </p>
                    <button
                      onClick={close}
                      className="mt-6 w-full rounded-full bg-cream py-3 text-sm font-semibold text-ink transition hover:bg-gold"
                    >
                      Start shopping
                    </button>
                  </div>
                ) : (
                  // Capture state
                  <>
                    {/* Eyebrow */}
                    <div className="mb-4 flex items-center justify-center gap-2">
                      <Sparkles size={13} className="text-gold" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                        Wait — before you go
                      </span>
                    </div>

                    <h2 className="text-center font-display text-3xl font-medium leading-tight text-cream md:text-4xl">
                      Get 10% off
                      <br />
                      <span className="italic font-light text-cream/70">your first piece.</span>
                    </h2>
                    <p className="mt-4 text-center text-sm text-cream/60">
                      Drop your email or WhatsApp and we&apos;ll send a code you can use today. No spam, ever.
                    </p>

                    {/* Toggle */}
                    <div className="mx-auto mt-6 flex w-fit rounded-full border border-cream/15 p-1 text-sm">
                      <button
                        type="button"
                        onClick={() => setType("email")}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition ${
                          type === "email" ? "bg-gold text-ink" : "text-cream/60"
                        }`}
                      >
                        <Mail size={13} /> Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setType("whatsapp")}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition ${
                          type === "whatsapp" ? "bg-gold text-ink" : "text-cream/60"
                        }`}
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                      <input
                        required
                        type={type === "email" ? "email" : "tel"}
                        placeholder={type === "email" ? "you@example.com" : "03xx-xxxxxxx"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                        className="w-full rounded-full border border-cream/15 bg-cream/5 px-5 py-3 text-sm text-cream outline-none transition focus:border-gold"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="magnetic flex items-center justify-center gap-2 rounded-full bg-cream py-3 text-sm font-semibold text-ink transition hover:bg-gold disabled:opacity-60"
                      >
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        {submitting ? "Sending…" : "Get my 10% code"}
                      </button>
                    </form>

                    {error && <p className="mt-3 text-center text-sm text-clay">{error}</p>}

                    <button
                      onClick={close}
                      className="mt-4 w-full text-center text-xs text-cream/40 transition hover:text-cream/60"
                    >
                      No thanks, I&apos;ll pay full price
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
