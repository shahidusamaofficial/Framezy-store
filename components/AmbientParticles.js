"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/**
 * AmbientParticles — floating gold dots that drift slowly in the
 * background of the hero. Each particle has a random size, position,
 * and drift duration (15–28s). Purely decorative.
 *
 * Rendered as a fixed full-viewport layer with pointer-events: none.
 * Hidden on reduced-motion (the dots would be a constant distraction
 * for users who asked for less motion).
 *
 * Particles count: 18 — enough to feel alive, not enough to cost FPS.
 */
export default function AmbientParticles({ count = 18 }) {
  const prefersReduced = useReducedMotion();
  // Generate particles once on mount — stable across re-renders.
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        // Random position across the viewport (5–95%)
        left: 5 + Math.random() * 90,
        top: 5 + Math.random() * 90,
        // Random size 1–3px
        size: 1 + Math.random() * 2,
        // Random drift duration 15–28s
        duration: 15 + Math.random() * 13,
        // Random delay so they don't sync
        delay: -Math.random() * 20,
        // Random opacity 0.2–0.6
        opacity: 0.2 + Math.random() * 0.4,
      })),
    [count]
  );

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
          animate={{
            // Drift up + slightly sideways, with opacity pulsing
            y: [0, -30, 0],
            x: [0, 12, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}