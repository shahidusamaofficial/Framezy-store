"use client";

import { useReducedMotion } from "framer-motion";

/**
 * IslamicPattern — a fixed full-viewport overlay with a subtle
 * girih (Islamic geometric) pattern. Very low opacity (3-5%) so
 * it reads as texture, not decoration. Slowly rotates for life.
 *
 * Hidden on reduced-motion.
 */
export default function IslamicPattern({ opacity = 0.04 }) {
  const prefersReduced = useReducedMotion();
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[1] islamic-pattern ${
        prefersReduced ? "" : "islamic-pattern-animated"
      }`}
      style={{ opacity }}
    />
  );
}