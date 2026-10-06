"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Minus, Plus, Star, Heart, Share2, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";
import { getPriceForSize } from "@/lib/pricing";

export default function ProductDetailPurchase({ product }) {
  const { addItem, setIsOpen } = useCart();
  const [size, setSize] = useState(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const unitPrice = getPriceForSize(product, size);

  const buttonRef = useRef(null);
  const buttonInView = useInView(buttonRef, { margin: "-100px 0px 0px 0px" });

  function handleAdd() {
    addItem(product, { size, qty, price: unitPrice });
    setIsOpen(true);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Eyebrow + name */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-6 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
            </span>
          </div>
          <h1 className="font-display text-4xl font-medium leading-[1.1] text-cream md:text-5xl">
            {product.name}
          </h1>
          {product.rating > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-cream/60">
              <span className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </span>
              <span>{product.rating}</span>
              <span className="text-cream/30">·</span>
              <span>{product.reviews} reviews</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 border-b border-cream/10 pb-6">
          <span className="font-display text-4xl text-gold">{formatPKR(unitPrice)}</span>
          {product.compareAt && !product.sizePrices && (
            <span className="text-lg text-cream/40 line-through">{formatPKR(product.compareAt)}</span>
          )}
          {product.compareAt && !product.sizePrices && (
            <span className="ml-auto rounded-full bg-clay/20 px-3 py-1 text-xs font-semibold text-clay">
              Save {formatPKR(product.compareAt - unitPrice)}
            </span>
          )}
        </div>

        {/* Short description */}
        {product.short_description && (
          <p className="text-base leading-relaxed text-cream/70">{product.short_description}</p>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Select size</p>
              {product.sizePrices && (
                <p className="text-xs text-cream/40">Price updates with size</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`relative rounded-xl border px-5 py-3 text-sm font-medium transition-all ${
                    size === s
                      ? "border-gold bg-gold text-ink"
                      : "border-cream/15 text-cream/70 hover:border-gold/50 hover:text-cream"
                  }`}
                >
                  {s}
                  {product.sizePrices && product.sizePrices[s] && size !== s && (
                    <span className="mt-0.5 block text-[10px] opacity-60">
                      {formatPKR(product.sizePrices[s])}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom note */}
        {product.isCustom && (
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-cream/70">
            <strong className="text-gold">Custom piece.</strong> After checkout, WhatsApp us your names/date and we'll confirm the layout before printing.
          </div>
        )}

        {/* Quantity + Add to cart */}
        <div ref={buttonRef} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center rounded-full border border-cream/15">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-12 w-12 items-center justify-center text-cream/70 transition hover:text-cream"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center text-base font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-12 w-12 items-center justify-center text-cream/70 transition hover:text-cream"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="magnetic group flex flex-1 items-center justify-center gap-2 rounded-full bg-cream py-4 text-sm font-semibold text-ink transition hover:bg-gold"
          >
            Add to Cart — {formatPKR(unitPrice * qty)}
          </button>
        </div>

        {/* Secondary actions — wishlist + share */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWished((w) => !w)}
            className="flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2.5 text-xs font-medium text-cream/70 transition hover:border-clay/40 hover:text-clay"
          >
            <Heart size={14} className={wished ? "fill-clay text-clay" : ""} />
            {wished ? "Saved" : "Save"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2.5 text-xs font-medium text-cream/70 transition hover:border-gold/40 hover:text-gold"
          >
            <Share2 size={14} />
            Share
          </button>
        </div>

        {/* Trust mini-bar */}
        <div className="grid grid-cols-3 gap-3 border-t border-cream/10 pt-6">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Truck size={18} className="text-gold" />
            <span className="text-[11px] text-cream/60">COD across PK</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <ShieldCheck size={18} className="text-gold" />
            <span className="text-[11px] text-cream/60">Secure packaging</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <RotateCcw size={18} className="text-gold" />
            <span className="text-[11px] text-cream/60">7-day returns</span>
          </div>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      <AnimatePresence>
        {!buttonInView && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-dark fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-cream/10 p-4 md:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] text-cream/50">{product.name}</p>
              <p className="font-semibold text-gold">{formatPKR(unitPrice * qty)}</p>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold active:scale-95"
            >
              Add to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
