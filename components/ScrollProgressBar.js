"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin gold gradient bar fixed to the very top of the viewport that
 * fills as the user scrolls down the page. Sits above the navbar (z-[60])
 * but is pointer-events-none so it never interferes with nav clicks.
 *
 * The spring smooths jitter on mobile scroll, and the gradient uses the
 * brand gold + butter tokens so it harmonizes with the existing palette
 * in both dark and light themes.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-clay via-gold to-butter"
      aria-hidden
    />
  );
}