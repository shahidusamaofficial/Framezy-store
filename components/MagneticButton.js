"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

/**
 * MagneticButton — wraps any element so it gently pulls toward the
 * cursor when hovered. The pull strength is configurable (default
 * 0.35 = 35% of the cursor offset). Resets smoothly on mouse leave.
 *
 * Usage:
 *   <MagneticButton href="/shop" className="...">Shop</MagneticButton>
 *   <MagneticButton as="button" onClick={...}>Add to cart</MagneticButton>
 *
 * Disabled on touch devices (no hover) and reduced-motion.
 */
export default function MagneticButton({
  children,
  href,
  as = "a",
  strength = 0.35,
  className = "",
  ...props
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  function handleMove(e) {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * strength, y: y * strength });
  }

  function handleLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const MotionTag = motion[as] || motion.a;

  const commonProps = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    className: `magnetic inline-flex items-center justify-center ${className}`,
    animate: { x: offset.x, y: offset.y },
    transition: { type: "spring", stiffness: 200, damping: 15, mass: 0.3 },
    ...props,
  };

  if (href) {
    return (
      <MotionTag href={href} {...commonProps}>
        {children}
      </MotionTag>
    );
  }
  return <MotionTag {...commonProps}>{children}</MotionTag>;
}