"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";

/**
 * FestiveBanner — a slim banner above the navbar for Eid/Ramadan
 * greetings + a discount code. Toggleable via the `active` prop
 * so you can turn it off outside the festive season without
 * removing the component.
 *
 * Set active={false} (or just remove the component from layout.js)
 * when the season is over.
 */
export default function FestiveBanner({
  active = true,
  message = "Eid Mubarak — celebrate with 15% off using code EID15",
}) {
  const [closed, setClosed] = useState(false);
  if (!active) return null;

  return (
    <AnimatePresence>
      {!closed && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden festive-banner"
        >
          <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2.5 text-center">
            <Sparkles size={13} className="text-gold" />
            <span className="text-xs sm:text-sm text-cream">
              <span className="urdu text-gradient-gold mr-2">عید مبارک</span>
              {message}
            </span>
            <button
              onClick={() => setClosed(true)}
              aria-label="Dismiss"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-cream/60 transition hover:bg-cream/10 hover:text-cream"
            >
              <X size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}