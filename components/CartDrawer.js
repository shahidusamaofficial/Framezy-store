"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, Truck } from "lucide-react";
import { useCart, formatPKR, FREE_SHIPPING_THRESHOLD } from "@/lib/cart-context";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQty,
    removeItem,
    subtotal,
    shipping,
    total,
    amountToFreeShipping,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            className="glass-dark fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col border-l border-white/10 p-5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-xl text-cream">Your Bag ({items.length})</h2>
              <button onClick={() => setIsOpen(false)} aria-label="Close cart" className="p-1 text-cream/70 hover:text-cream">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-cream/50">
                <p>Your bag is empty.</p>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-clay px-5 py-2 text-sm font-semibold text-cream"
                >
                  Browse the Shop
                </Link>
              </div>
            ) : (
              <>
                <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto py-4">
                  {items.map((item) => (
                    <div key={item.lineId} className="flex gap-3">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm leading-snug text-cream">{item.name}</p>
                          {item.size && <p className="text-xs text-cream/50">{item.size}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-white/15">
                            <button
                              onClick={() => updateQty(item.lineId, item.qty - 1)}
                              className="p-1.5 text-cream/60 hover:text-cream"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center text-xs">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.lineId, item.qty + 1)}
                              className="p-1.5 text-cream/60 hover:text-cream"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-medium text-cream">
                            {formatPKR(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        aria-label="Remove item"
                        className="self-start p-1 text-cream/30 hover:text-clay"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {amountToFreeShipping > 0 ? (
                  <div className="mb-3 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs text-cream/60">
                    <Truck size={14} className="shrink-0 text-gold" />
                    Add {formatPKR(amountToFreeShipping)} more for free delivery.
                  </div>
                ) : (
                  <div className="mb-3 flex items-center gap-2 rounded-xl bg-moss/20 p-3 text-xs text-cream/70">
                    <Truck size={14} className="shrink-0 text-gold" /> You've unlocked free delivery.
                  </div>
                )}

                <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between text-cream/70">
                    <span>Subtotal</span>
                    <span>{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-semibold text-cream">
                    <span>Total</span>
                    <span>{formatPKR(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block rounded-full bg-clay py-3.5 text-center text-sm font-semibold text-cream transition hover:bg-rust"
                >
                  Checkout — {formatPKR(total)}
                </Link>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
