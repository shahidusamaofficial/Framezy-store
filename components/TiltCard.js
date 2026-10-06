"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * TiltCard — wraps children in a 3D tilt effect that responds to
 * cursor position. Subtle: max 8deg rotation, with a glare highlight
 * that follows the cursor. Resets smoothly on leave.
 *
 * The glare is a radial gradient overlay that brightens on hover —
 * gives the "liquid glass" surface real depth.
 *
 * Disabled on touch + reduced-motion.
 */
export default function TiltCard({ children, className = "", max = 8, glare = true }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // Smooth the motion values with springs so the tilt lags slightly
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  // Glare position — follows the cursor
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  function handleMove(e) {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: prefersReduced ? 0 : rotateX,
        rotateY: prefersReduced ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}
      {/* Glare overlay */}
      {glare && !prefersReduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle 200px at ${x} ${y}, rgb(var(--c-cream) / 0.18), transparent 70%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
}