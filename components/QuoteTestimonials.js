"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * QuoteTestimonials — one large quote at a time, with prev/next
 * controls. Auto-advances every 7s, pauses on hover. The quote
 * is huge Playfair italic — feels like a magazine pull-quote.
 */
const reviews = [
  {
    text: "The quality genuinely surprised me — feels premium in person, not just in photos.",
    name: "Rana Hammad Ali",
    role: "Lahore",
    rating: 5,
  },
  {
    text: "Best purchase I've made this year for my room. It looks amazing on the wall.",
    name: "Hira Subhan",
    role: "Karachi",
    rating: 5,
  },
  {
    text: "Outstanding build quality — the border finish alone feels worth the price.",
    name: "Usman Afridi",
    role: "Islamabad",
    rating: 5,
  },
  {
    text: "Really impressed with the wood backing — feels sturdy, not flimsy like other frames.",
    name: "Ahmed Zaheer",
    role: "Rawalpindi",
    rating: 5,
  },
];

export default function QuoteTestimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(id);
  }, [paused]);

  function next() {
    setIndex((i) => (i + 1) % reviews.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  }

  return (
    <section
      className="relative bg-ink py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[140px]"
      />

      <div className="relative mx-auto max-w-4xl px-5 md:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              From our customers
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </span>
            <span className="text-sm text-cream/60">4.9 average · 380+ reviews</span>
          </div>
        </div>

        {/* The quote — AnimatePresence for cross-fade */}
        <div className="relative min-h-[280px] md:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="font-display text-display font-medium italic text-cream md:text-huge">
                <span className="text-gold">&ldquo;</span>
                {reviews[index].text}
                <span className="text-gold">&rdquo;</span>
              </p>
              <footer className="mt-8 text-sm uppercase tracking-[0.2em] text-cream/60">
                {reviews[index].name}
                <span className="mx-2 text-gold">·</span>
                <span className="text-cream/40">{reviews[index].role}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Prev / Next controls + dots */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold hover:text-gold"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-gold" : "w-1.5 bg-cream/30 hover:bg-cream/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold hover:text-gold"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}