"use client";

import { motion } from "framer-motion";

export default function SuccessCheckmark() {
  return (
    <motion.svg width="72" height="72" viewBox="0 0 72 72" initial="hidden" animate="visible">
      <motion.circle
        cx="36"
        cy="36"
        r="33"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-gold"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
        }}
      />
      <motion.path
        d="M22 37 L32 47 L50 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut", delay: 0.5 } },
        }}
      />
    </motion.svg>
  );
}
