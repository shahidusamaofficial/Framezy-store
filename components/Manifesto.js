"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Manifesto — scroll-pinned statement section.
 *
 * Desktop: pins to the top of the viewport, words reveal one-by-one
 * as the user scrolls (scroll-driven motion via useScroll + useVelocity).
 *
 * Mobile: simpler entrance — the whole paragraph fades in + rises when
 * the section enters the viewport. No scroll-pinning, no scroll-driven
 * word reveal. iOS Safari's scroll events are unreliable for this kind
 * of effect, and the original version was leaving the words invisible
 * until the user scrolled back and forth to "wake it up."
 *
 * Detection: window.innerWidth >= 768 = desktop, else mobile.
 */
export default function Manifesto() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const statement =
    "Your walls deserve more than posters. They deserve [[frames]] that hold light, hold memory, hold the room together — printed gallery-grade, built to outlast trends, and delivered anywhere in [[Pakistan]].";

  const parts = statement.split(/(\[\[[^\]]+\]\])/g).filter(Boolean);
  const tokens = [];
  parts.forEach((part) => {
    if (part.startsWith("[[")) {
      const inner = part.slice(2, -2);
      inner.split(/(\s+)/).forEach((w) => {
        if (w.trim()) tokens.push({ text: w, gold: true });
        else tokens.push({ text: w, gold: false, space: true });
      });
    } else {
      part.split(/(\s+)/).forEach((w) => {
        if (w.trim()) tokens.push({ text: w, gold: false });
        else if (w.length) tokens.push({ text: w, gold: false, space: true });
      });
    }
  });

  if (isMobile) {
    return <MobileManifesto tokens={tokens} />;
  }
  return <DesktopManifesto tokens={tokens} />;
}

/**
 * Mobile version — simple fade + rise entrance, no scroll pinning.
 * Each word fades in with a slight stagger for a subtle reveal effect.
 */
function MobileManifesto({ tokens }) {
  const words = tokens.filter((t) => !t.space);
  return (
    <section className="relative bg-ink py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60">
            Why we make these
          </span>
          <span className="h-px w-8 bg-gold/40" />
        </div>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
          className="font-display text-2xl font-medium leading-snug text-cream md:text-3xl"
        >
          {tokens.map((tok, i) => {
            if (tok.space) return <span key={i}>{tok.text}</span>;
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0.15, filter: "blur(6px)" },
                  show: {
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className={`inline-block mr-[0.2em] ${tok.gold ? "text-gradient-gold" : ""}`}
              >
                {tok.text}
              </motion.span>
            );
          })}
        </motion.p>
      </div>
    </section>
  );
}

/**
 * Desktop version — original scroll-pinned reveal. Unchanged.
 */
function DesktopManifesto({ tokens }) {
  const sectionRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const wordCount = tokens.filter((t) => !t.space).length;

  return (
    <section ref={sectionRef} className="relative h-[250vh] bg-ink">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[160px]"
        />

        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60">
              Why we make these
            </span>
            <span className="h-px w-8 bg-gold/40" />
          </div>

          <p className="font-display text-display font-medium text-cream md:text-huge">
            {(() => {
              let revealIndex = 0;
              return tokens.map((tok, i) => {
                if (tok.space) return <span key={i}>{tok.text}</span>;
                const myIndex = revealIndex++;
                const start = myIndex / wordCount;
                const end = (myIndex + 1) / wordCount;
                return (
                  <ScrollWord
                    key={i}
                    progress={scrollYProgress}
                    start={start}
                    end={end}
                    gold={tok.gold}
                    reduced={prefersReduced}
                  >
                    {tok.text}
                  </ScrollWord>
                );
              });
            })()}
          </p>
        </div>
      </div>
    </section>
  );
}

function ScrollWord({ children, progress, start, end, gold, reduced }) {
  // If reduced motion is requested, just show the word fully visible
  const opacity = reduced ? 1 : useTransform(progress, [start, end], [0.15, 1]);
  const filter = reduced
    ? "blur(0px)"
    : useTransform(progress, [start, end], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.span
      style={{ opacity, filter }}
      className={`inline-block mr-[0.25em] ${gold ? "text-gradient-gold" : ""}`}
    >
      {children}
    </motion.span>
  );
}
