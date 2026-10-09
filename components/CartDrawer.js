"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, Truck, ShieldCheck, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
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

  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = amountToFreeShipping <= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer — slides in from the right */}
          <motion.aside
            className="glass-dark fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col border-l border-cream/10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header — large close button for mobile */}
            <div className="flex items-center justify-between border-b border-cream/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-gold" />
                <h2 className="font-display text-xl font-medium text-cream">
                  Your Bag
                </h2>
                {items.length > 0 && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/5 text-cream/70 transition hover:bg-cream/10 hover:text-cream active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/5"
                >
                  <ShoppingBag size={32} className="text-cream/30" />
                </motion.div>
                <div>
                  <p className="font-display text-2xl font-medium text-cream">Your bag is empty</p>
                  <p className="mt-2 text-sm text-cream/50">
                    Add a few frames and they'll show up here.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="magnetic group inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold"
                >
                  Browse the collection
                  <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping progress bar */}
                <div className="border-b border-cream/10 px-5 py-4">
                  {hasFreeShipping ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-moss/30 bg-moss/10 px-3 py-2.5 text-xs text-cream/80"
                    >
                      <Truck size={14} className="text-moss" />
                      <span className="font-medium">Free delivery unlocked! 🎉</span>
                    </motion.div>
                  ) : (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-cream/70">
                          <Truck size={13} className="text-gold" />
                          Add <span className="font-semibold text-gold">{formatPKR(amountToFreeShipping)}</span> for free delivery
                        </span>
                        <span className="text-cream/40">{Math.round(shippingProgress)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-cream/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gold to-butter"
                          initial={{ width: 0 }}
                          animate={{ width: `${shippingProgress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Items list */}
                <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.lineId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex gap-3 overflow-hidden border-b border-cream/5 py-4 last:border-0"
                      >
                        {/* Image */}
                        <Link
                          href={`/product/${item.slug || ""}`}
                          onClick={() => setIsOpen(false)}
                          className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream/5"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </Link>

                        {/* Info + controls */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <Link
                              href={`/product/${item.slug || ""}`}
                              onClick={() => setIsOpen(false)}
                              className="text-sm leading-snug text-cream transition hover:text-gold line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            {item.size && (
                              <p className="mt-0.5 text-xs text-cream/50">Size: {item.size}</p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            {/* Quantity controls */}
                            <div className="flex items-center rounded-full border border-cream/15">
                              <button
                                onClick={() => updateQty(item.lineId, item.qty - 1)}
                                className="flex h-7 w-7 items-center justify-center text-cream/60 transition hover:text-cream"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-xs font-medium">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.lineId, item.qty + 1)}
                                className="flex h-7 w-7 items-center justify-center text-cream/60 transition hover:text-cream"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            {/* Price */}
                            <span className="font-display text-base text-gold">
                              {formatPKR(item.price * item.qty)}
                            </span>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.lineId)}
                          aria-label="Remove item"
                          className="self-start flex h-7 w-7 items-center justify-center rounded-full text-cream/30 transition hover:bg-clay/10 hover:text-clay"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer — totals + checkout */}
                <div className="border-t border-cream/10 bg-charcoal/40 px-5 py-4">
                  {/* Totals */}
                  <div className="mb-4 space-y-1.5 text-sm">
                    <div className="flex justify-between text-cream/60">
                      <span>Subtotal</span>
                      <span>{formatPKR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-cream/60">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-gold">Free</span>
                        ) : (
                          formatPKR(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-cream/10 pt-2 text-base font-semibold">
                      <span className="text-cream">Total</span>
                      <span className="font-display text-xl text-gold">{formatPKR(total)}</span>
                    </div>
                  </div>

                  {/* Checkout button */}
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="magnetic group flex items-center justify-center gap-2 rounded-full bg-cream py-3.5 text-sm font-semibold text-ink transition hover:bg-gold active:scale-95"
                  >
                    Checkout — {formatPKR(total)}
                    <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </Link>

                  {/* Trust mini-bar */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Truck size={13} className="text-gold" />
                      <span className="text-[10px] text-cream/40">COD available</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <ShieldCheck size={13} className="text-gold" />
                      <span className="text-[10px] text-cream/40">Secure checkout</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <MessageCircle size={13} className="text-gold" />
                      <span className="text-[10px] text-cream/40">WhatsApp support</span>
                    </div>
                  </div>

                  {/* Continue shopping link */}
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="mt-3 block text-center text-xs text-cream/40 transition hover:text-cream/70"
                  >
                    or continue shopping
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
