"use client";

import { motion } from "framer-motion";
import { Truck, Wallet, MessageCircle, MapPin, ShieldCheck } from "lucide-react";

/**
 * PakistaniTrustBar — a horizontal strip of trust badges that
 * matter to Pakistani online buyers: COD, JazzCash, Easypaisa,
 * WhatsApp ordering, ships from Lahore, secure packaging.
 *
 * Each badge is a small pill with an icon + label. The bar sits
 * below the hero, before the Manifesto, to immediately establish
 * "this is a real Pakistani store, you can pay how you actually pay."
 */
const badges = [
  { icon: Truck, label: "Cash on Delivery" },
  { icon: Wallet, label: "JazzCash · Easypaisa" },
  { icon: MessageCircle, label: "WhatsApp ordering" },
  { icon: MapPin, label: "Ships from Lahore" },
  { icon: ShieldCheck, label: "Secure packaging" },
];

export default function PakistaniTrustBar() {
  return (
    <section className="relative z-10 -mt-10 mb-4">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-dark flex flex-wrap items-center justify-center gap-2 rounded-2xl px-4 py-4 md:gap-3 md:px-6"
        >
          {badges.map((b, i) => (
            <motion.span
              key={b.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="trust-badge"
            >
              <b.icon size={13} className="text-gold" />
              {b.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}