"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Minus, Plus, Star, ChevronLeft, ChevronRight, ChevronDown, Truck, ShieldCheck, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart, formatPKR } from "@/lib/cart-context";
import { getPriceForSize, getPriceRange } from "@/lib/pricing";

export default function QuickView({ product, open, onClose }) {
  const { addItem, setIsOpen } = useCart();
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setSize(product?.sizes?.[0]);
    setQty(1);
    setActiveImage(0);
  }, [product?.id]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

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

  function nextImage() { setActiveImage((i) => (i + 1) % images.length); }
  function prevImage() { setActiveImage((i) => (i - 1 + images.length) % images.length); }

  function handleDragEnd(event, info) {
    if (info.offset.y > 100) onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — tapping this also closes */}
          <motion.div
            className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div
              className="glass-hero relative w-full overflow-hidden rounded-t-3xl sm:max-w-4xl sm:rounded-3xl"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              dragDirectionLock
              onDragEnd={handleDragEnd}
            >
              {/* ============================================
                  MOBILE: Full-width close header bar
                  Tap anywhere on it to close. Impossible to miss.
                  ============================================ */}
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="flex w-full items-center justify-between border-b border-cream/10 bg-charcoal/95 px-5 py-3 backdrop-blur-md sm:hidden"
              >
                <span className="flex items-center gap-2 text-xs font-medium text-cream/60">
                  <ChevronDown size={16} className="text-gold" />
                  Swipe down or tap to close
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream/10 text-cream">
                  <X size={14} strokeWidth={2.5} />
                </span>
              </button>

              {/* DESKTOP: small X button in corner */}
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute right-4 top-4 z-20 hidden h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-cream backdrop-blur-md transition hover:bg-ink/80 sm:flex"
              >
                <X size={16} />
              </button>

              <div className="flex max-h-[85vh] flex-col overflow-y-auto sm:max-h-[92vh] sm:grid sm:grid-cols-2 sm:overflow-hidden">
                {/* IMAGE GALLERY */}
                <div className="relative bg-charcoal">
                  <div className="relative aspect-square w-full sm:h-full sm:min-h-[500px]">
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

                    {discountPct > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-cream shadow-lift sm:left-4 sm:top-4">
                        -{discountPct}%
                      </span>
                    )}

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
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-[10px] text-cream/80 backdrop-blur-md">
                          {activeImage + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {hasMultipleImages && (
                    <div className="flex gap-2 overflow-x-auto p-3 scrollbar-none sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:justify-center sm:bg-gradient-to-t sm:from-ink/60 sm:to-transparent sm:p-4">
                      {images.map((img, i) => (
                        <button
                          key={img + i}
                          onClick={() => setActiveImage(i)}
                          className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-14 sm:w-14 ${
                            activeImage === i ? "border-gold" : "border-cream/10 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PRODUCT INFO */}
                <div className="flex flex-col p-5 sm:max-h-[90vh] sm:overflow-y-auto sm:p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-6 bg-gold" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                      {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-medium leading-tight text-cream sm:text-3xl">
                    {product.name}
                  </h2>

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

                  {product.short_description && (
                    <p className="mt-4 text-sm leading-relaxed text-cream/70">
                      {product.short_description}
                    </p>
                  )}

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
                              className={`flex flex-col items-center rounded-xl border px-4 py-2 text-xs font-medium transition-all ${
                                size === s
                                  ? "border-gold bg-gold text-ink"
                                  : "border-cream/15 text-cream/70 hover:border-gold/40 hover:text-cream"
                              }`}
                            >
                              <span>{s}</span>
                              {sizePrice && size !== s && (
                                <span className="mt-0.5 text-[9px] opacity-60">
                                  {formatPKR(sizePrice)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {product.isCustom && (
                    <div className="mt-5 rounded-xl border border-gold/20 bg-gold/5 p-3 text-xs text-cream/70">
                      <strong className="text-gold">Custom piece.</strong> After checkout, WhatsApp us your names/date and we'll confirm the layout before printing.
                    </div>
                  )}

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

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-cream/10 pt-5">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Truck size={14} className="text-gold" />
                      <span className="text-[10px] text-cream/50">COD</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <ShieldCheck size={14} className="text-gold" />
                      <span className="text-[10px] text-cream/50">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <RotateCcw size={14} className="text-gold" />
                      <span className="text-[10px] text-cream/50">7-day returns</span>
                    </div>
                  </div>

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

              {/* STICKY MOBILE BUY BAR */}
              <div className="border-t border-cream/10 bg-charcoal/95 p-3 backdrop-blur-md sm:hidden">
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-full border border-cream/15">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center text-cream/70 transition hover:text-cream"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-9 w-9 items-center justify-center text-cream/70 transition hover:text-cream"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cream py-3 text-sm font-semibold text-ink transition hover:bg-gold active:scale-95"
                  >
                    Add — {formatPKR(unitPrice * qty)}
                  </button>
                </div>
              </div>

              {/* DESKTOP buy row */}
              <div className="hidden border-t border-cream/10 p-6 sm:flex sm:items-center sm:gap-3">
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
