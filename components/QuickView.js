"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { X, Minus, Plus, Star } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";

export default function QuickView({ product, open, onClose }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  function handleAdd() {
    addItem(product, { size, qty });
    onClose();
    setQty(1);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              className="glass relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] p-0"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
            >
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute right-4 top-4 z-10 rounded-full bg-ink/50 p-1.5 text-cream transition hover:bg-ink/80"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto">
                  <Image src={product.image} alt={product.name} fill sizes="400px" className="object-cover" />
                </div>

                <div className="flex flex-col gap-4 p-6 md:p-7">
                  <p className="text-[11px] uppercase tracking-wider text-gold/80">
                    {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
                  </p>
                  <h2 className="font-display text-2xl leading-tight text-cream">{product.name}</h2>
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 text-xs text-cream/50">
                      <Star size={12} className="fill-gold text-gold" />
                      {product.rating} · {product.reviews} reviews
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-cream/70">{product.description}</p>

                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-cream">{formatPKR(product.price)}</span>
                    {product.compareAt && (
                      <span className="text-sm text-cream/40 line-through">{formatPKR(product.compareAt)}</span>
                    )}
                  </div>

                  {product.sizes?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-wide text-cream/50">Size</p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                              size === s
                                ? "border-gold bg-gold text-ink font-semibold"
                                : "border-white/20 text-cream/70 hover:border-gold/50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.isCustom && (
                    <p className="rounded-xl bg-white/5 p-3 text-xs text-cream/60">
                      After checkout, WhatsApp us your names/date and we'll confirm the layout before printing.
                    </p>
                  )}

                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center rounded-full border border-white/20">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="p-2.5 text-cream/70 hover:text-cream"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="p-2.5 text-cream/70 hover:text-cream"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={handleAdd}
                      className="flex-1 rounded-full bg-clay py-3 text-sm font-semibold text-cream transition hover:bg-rust"
                    >
                      Add to Cart — {formatPKR(product.price * qty)}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
