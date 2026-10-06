"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Minus, Plus, Star, ChevronLeft, ChevronRight, Truck, ShieldCheck, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart, formatPKR } from "@/lib/cart-context";
import { getPriceForSize, getPriceRange } from "@/lib/pricing";

export default function QuickView({ product, open, onClose }) {
  const { addItem, setIsOpen } = useCart();
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Reset state when switching products
  useEffect(() => {
    setSize(product?.sizes?.[0]);
    setQty(1);
    setActiveImage(0);
  }, [product?.id]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!product) return null;

  const unitPrice = getPriceForSize(product, size);
  const { min, max } = getPriceRange(product);
  const hasRange = max > min;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasMultipleImages = images.length > 1;
  const features = product.features || [];
  const discountPct = product.compareAt && !hasRange
    ? Math.round(100 - (product.price / product.compareAt) * 100)
    : 0;

  function handleAdd() {
    addItem(product, { size, qty, price: unitPrice });
    onClose();
    setQty(1);
    setIsOpen(true);
  }

  function nextImage() {
    setActiveImage((i) => (i + 1) % images.length);
  }
  function prevImage() {
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              className="glass-hero relative w-full max-w-4xl overflow-hidden rounded-3xl"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-cream/80 backdrop-blur-md transition hover:bg-ink/80 hover:text-cream"
              >
                <X size={16} />
              </button>

              <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
                {/* LEFT: Image gallery */}
                <div className="relative flex flex-col bg-charcoal">
                  <div className="relative aspect-square w-full overflow-hidden md:h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={images[activeImage]}
                          alt={`${product.name} — image ${activeImage + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Discount badge */}
                    {discountPct > 0 && (
                      <span className="absolute left-4 top-4 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-cream shadow-lift">
                        -{discountPct}%
                      </span>
                    )}

                    {/* Image nav arrows (only if multiple images) */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-cream backdrop-blur-md transition hover:bg-ink/80"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={nextImage}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-cream backdrop-blur-md transition hover:bg-ink/80"
                        >
                          <ChevronRight size={16} />
                        </button>
                        {/* Image counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-[10px] text-cream/80 backdrop-blur-md">
                          {activeImage + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails (only if multiple images) */}
                  {hasMultipleImages && (
                    <div className="flex gap-2 p-3 scrollbar-none overflow-x-auto">
                      {images.map((img, i) => (
                        <button
                          key={img + i}
                          onClick={() => setActiveImage(i)}
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            activeImage === i ? "border-gold" : "border-cream/10 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT: Product info + buy box */}
                <div className="flex max-h-[90vh] flex-col overflow-y-auto p-6 md:p-8">
                  {/* Eyebrow */}
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-6 bg-gold" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                      {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="font-display text-2xl font-medium leading-tight text-cream md:text-3xl">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  {product.rating > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-cream/60">
                      <span className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={12} className="fill-gold text-gold" />
                        ))}
                      </span>
                      <span>{product.rating}</span>
                      <span className="text-cream/30">·</span>
                      <span>{product.reviews} reviews</span>
                    </div>
                  )}

                  {/* Short description */}
                  {product.short_description && (
                    <p className="mt-4 text-sm leading-relaxed text-cream/70">
                      {product.short_description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mt-5 flex items-baseline gap-3 border-b border-cream/10 pb-5">
                    <span className="font-display text-3xl text-gold">
                      {formatPKR(unitPrice)}
                    </span>
                    {product.compareAt && !hasRange && (
                      <span className="text-sm text-cream/40 line-through">
                        {formatPKR(product.compareAt)}
                      </span>
                    )}
                    {discountPct > 0 && (
                      <span className="ml-auto rounded-full bg-clay/20 px-2.5 py-1 text-[10px] font-semibold text-clay">
                        Save {formatPKR(product.compareAt - unitPrice)}
                      </span>
                    )}
                  </div>

                  {/* Sizes with prices */}
                  {product.sizes?.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-cream/50">
                          Select size
                        </p>
                        {hasRange && (
                          <p className="text-[10px] text-cream/40">Price updates with size</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s) => {
                          const sizePrice = product.sizePrices?.[s];
                          return (
                            <button
                              key={s}
                              onClick={() => setSize(s)}
                              className={`relative rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                                size === s
                                  ? "border-gold bg-gold text-ink"
                                  : "border-cream/15 text-cream/70 hover:border-gold/40 hover:text-cream"
                              }`}
                            >
                              {s}
                              {sizePrice && size !== s && (
                                <span className="mt-0.5 block text-[9px] opacity-60">
                                  {formatPKR(sizePrice)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom note */}
                  {product.isCustom && (
                    <div className="mt-5 rounded-xl border border-gold/20 bg-gold/5 p-3 text-xs text-cream/70">
                      <strong className="text-gold">Custom piece.</strong> After checkout, WhatsApp us your names/date and we'll confirm the layout before printing.
                    </div>
                  )}

                  {/* Features (compact list) */}
                  {features.length > 0 && (
                    <div className="mt-5 rounded-xl border border-cream/10 bg-charcoal/40 p-3">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-cream/40">
                        Frame features
                      </p>
                      <ul className="grid grid-cols-1 gap-1.5 text-xs text-cream/70 sm:grid-cols-2">
                        {features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 text-gold">✦</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quantity + Add to cart */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-cream/15">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="flex h-10 w-10 items-center justify-center text-cream/70 transition hover:text-cream"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{qty}</span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="flex h-10 w-10 items-center justify-center text-cream/70 transition hover:text-cream"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={handleAdd}
                      className="magnetic flex flex-1 items-center justify-center gap-2 rounded-full bg-cream py-3 text-sm font-semibold text-ink transition hover:bg-gold active:scale-95"
                    >
                      Add to Cart — {formatPKR(unitPrice * qty)}
                    </button>
                  </div>

                  {/* Trust mini-bar */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-cream/10 pt-5">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Truck size={14} className="text-gold" />
                      <span className="text-[10px] text-cream/50">COD across PK</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <ShieldCheck size={14} className="text-gold" />
                      <span className="text-[10px] text-cream/50">Secure packaging</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <RotateCcw size={14} className="text-gold" />
                      <span className="text-[10px] text-cream/50">7-day returns</span>
                    </div>
                  </div>

                  {/* View full details link */}
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-cream/60 transition hover:text-gold"
                  >
                    View full details
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
