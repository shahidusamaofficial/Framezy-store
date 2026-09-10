"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartToast() {
  const { toast, setIsOpen } = useCart();

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[100]">
      <AnimatePresence>
        {toast && (
          <motion.button
            key={toast.id}
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-cream shadow-lift"
          >
            <CheckCircle2 size={16} className="text-moss" />
            Added &quot;{toast.name}&quot; to bag
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
