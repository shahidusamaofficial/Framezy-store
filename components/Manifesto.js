"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Manifesto — a scroll-pinned statement section. The text reveals
 * word-by-word as the user scrolls through the section, going from
 * blurred + dim to sharp + bright. This is the "wow" moment of the
 * homepage.
 *
 * Implementation: the outer section is 250vh tall. Inside, a sticky
 * div pins to the top of the viewport for the duration. As
 * scrollYProgress goes 0→1, each word's opacity + blur transform
 * cycles in turn. Scroll controls the pace.
 */
export default function Manifesto() {
  // The statement — words that should be gold are wrapped in [[double brackets]].
  const statement =
    "Your walls deserve more than posters. They deserve [[frames]] that hold light, hold memory, hold the room together — printed gallery-grade, built to outlast trends, and delivered anywhere in [[Pakistan]].";

  // Parse: split into tokens, mark gold ones, then split into words.
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

  const wordCount = tokens.filter((t) => !t.space).length;

  return <ManifestoInner tokens={tokens} wordCount={wordCount} />;
}

function ManifestoInner({ tokens, wordCount }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  let revealIndex = 0;

  return (
          <section ref={sectionRef} className="relative bg-ink">
      <div className="flex min-h-screen items-center justify-center overflow-hidden py-24 md:sticky md:top-0 md:h-screen md:py-0">
        {/* Ambient orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[160px]"
        />

        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          {/* Eyebrow */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60">
              Why we make these
            </span>
            <span className="h-px w-8 bg-gold/40" />
          </div>

          {/* The statement — each word reveals based on scroll */}
          <p className="font-display text-display font-medium text-cream md:text-huge">
            {tokens.map((tok, i) => {
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
                >
                  {tok.text}
                </ScrollWord>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

function ScrollWord({ children, progress, start, end, gold }) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const filter = useTransform(progress, [start, end], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.span
      style={{ opacity, filter }}
      className={`inline-block mr-[0.25em] ${gold ? "text-gradient-gold" : ""}`}
    >
      {children}
    </motion.span>
  );
}
