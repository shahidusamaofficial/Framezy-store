"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Custom cursor — a small gold dot that follows the mouse with a
 * springy lag. Grows into a soft gold blob when hovering interactive
 * elements (links, buttons). Hidden on touch devices and reduced-motion.
 *
 * Implemented as a single div whose transform is updated directly via
 * requestAnimationFrame — no React state, no re-renders, ~0 cost.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === "undefined") return;
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let raf;

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Grow the dot when hovering interactive elements
      const target = e.target;
      if (
        target instanceof Element &&
        target.closest("a, button, input, textarea, select, [role='button']")
      ) {
        dot.classList.add("is-hovering");
      } else {
        dot.classList.remove("is-hovering");
      }
    }

    function tick() {
      // Spring towards the mouse — the 0.22 factor gives a slight lag
      dotX += (mouseX - dotX) * 0.22;
      dotY += (mouseY - dotY) * 0.22;
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;
  return <div ref={dotRef} className="cursor-dot" aria-hidden />;
}