"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

export default function CountUp({ value, format }) {
  const nodeRef = useRef(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      node.textContent = format ? format(value) : Math.round(value);
      prevValue.current = value;
      return;
    }

    const controls = animate(prevValue.current, value, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = format ? format(Math.round(latest)) : Math.round(latest);
      },
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, format]);

  return <span ref={nodeRef}>{format ? format(0) : 0}</span>;
}
