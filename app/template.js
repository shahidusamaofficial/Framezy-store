"use client";

import { motion } from "framer-motion";

/**
 * template.js — Next.js wraps every route's children in this
 * component. When the route changes, the whole page animates
 * (fades + slides up). This is the official Next.js way to do
 * page transitions with App Router.
 *
 * The key is `pathname` — framer-motion re-mounts on key change,
 * re-triggering the entrance animation.
 */
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}