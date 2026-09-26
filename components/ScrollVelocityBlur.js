"use client";

import { useRef } from "react";
import { motion, useScroll, useVelocity, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * ScrollVelocityBlur — wraps children (usually an <Image>) and
 * applies a blur + slight scale based on how fast the user is
 * scrolling. When you stop scrolling, it sharpens back to normal.
 *
 * The effect is driven by useVelocity on scrollY, mapped through
 * a spring to smooth jitter. Max blur is 6px — enough to feel
 * cinematic without being nauseating.
 *
 * Disabled on reduced-motion.
 */
export default function ScrollVelocityBlur({ children, className = "", maxBlur = 6 }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Smooth the velocity so the blur doesn't flicker
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map velocity (px/s) to blur (px). 0 → 0 blur, 2000+ → maxBlur.
  const blur = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [maxBlur, 0, maxBlur]
  );
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  // Slight scale-down when scrolling fast — adds to the "moving" feel
  const scale = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [0.97, 1, 0.97]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        filter: prefersReduced ? "none" : filter,
        scale: prefersReduced ? 1 : scale,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
