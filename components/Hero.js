"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-sm font-medium text-cream/50"
        >
          Pakistan's frame drop of the season
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-massive"
        >
          Walls that{" "}
          <span className="font-bold">feel like you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-lg text-cream/50"
        >
          Gallery-grade prints, built to survive monsoon humidity. Honest
          prices, delivered anywhere in Pakistan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3 text-sm font-medium text-cream transition hover:opacity-90"
          >
            Shop the Collection
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/shop?bundles=1"
            className="text-sm font-medium text-cream/60 transition hover:text-cream"
          >
            Browse bundles ›
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 flex justify-center gap-12"
        >
          {[
            { v: "4 sizes", l: "A4 → A1" },
            { v: "Rs. 1,850+", l: "Starting price" },
            { v: "5–7 days", l: "Delivery in PK" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-xl font-semibold">{s.v}</div>
              <div className="mt-1 text-xs text-cream/40">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
