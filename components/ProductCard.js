"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Eye, Star, Heart } from "lucide-react";
import { formatPKR } from "@/lib/cart-context";
import { getPriceRange } from "@/lib/pricing";
import CountUp from "@/components/CountUp";

const QuickView = dynamic(() => import("./QuickView"), { ssr: false });

export default function ProductCard({ product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [wished, setWished] = useState(false);
  const discountPct = product.compareAt
    ? Math.round(100 - (product.price / product.compareAt) * 100)
    : 0;
  const { min, max } = getPriceRange(product);
  const hasRange = max > min;

  return (
    <>
      <motion.div
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-charcoal/40 transition-all duration-300 hover:border-gold/30 hover:shadow-lift"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          href={`/product/${product.slug}`}
          className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream/5 via-cream/10 to-cream/5" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            onLoad={() => setImageLoaded(true)}
            className={`object-cover transition duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Permanent gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

          {/* Discount badge */}
          {discountPct > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-cream shadow-lift">
              -{discountPct}%
            </span>
          )}

          {/* Wishlist heart */}
          <button
            type="button"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            onClick={(e) => {
              e.preventDefault();
              setWished((w) => !w);
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 text-cream/80 backdrop-blur-md transition hover:bg-ink/80 hover:text-clay active:scale-90"
          >
            <Heart
              size={14}
              className={wished ? "fill-clay text-clay" : ""}
            />
          </button>

          {/* Quick View button — slides up on hover */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-cream/95 px-4 py-2 text-xs font-semibold text-ink shadow-lift backdrop-blur-md transition active:scale-95 hover:bg-gold"
            >
              <Eye size={14} /> Quick View
            </button>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-gold/80">
            {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display text-base leading-snug text-cream transition-colors hover:text-gold">
              {product.name}
            </h3>
          </Link>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-cream/50">
              <Star size={12} className="fill-gold text-gold" />
              {product.rating} · {product.reviews} reviews
            </div>
          )}
          <div className="mt-1.5 flex items-baseline gap-2">
            {hasRange ? (
              <span className="font-semibold text-cream">
                {formatPKR(min)} – {formatPKR(max)}
              </span>
            ) : (
              <>
                <span className="font-display text-lg text-gold">
                  <CountUp value={product.price} format={formatPKR} />
                </span>
                {product.compareAt && (
                  <span className="text-xs text-cream/40 line-through">
                    {formatPKR(product.compareAt)}
                  </span>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => setQuickViewOpen(true)}
            className="mt-3 w-full rounded-full border border-gold/40 py-2 text-xs font-semibold text-gold transition hover:bg-gold hover:text-ink active:scale-95"
          >
            Select Options
          </button>
        </div>
      </motion.div>

      <QuickView
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
