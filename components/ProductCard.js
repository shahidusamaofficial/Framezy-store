"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, Star } from "lucide-react";
import { formatPKR } from "@/lib/cart-context";
import QuickView from "./QuickView";

export default function ProductCard({ product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const discountPct = product.compareAt
    ? Math.round(100 - (product.price / product.compareAt) * 100)
    : 0;

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl retro-border bg-[#241811] transition duration-300 hover:-translate-y-1 hover:shadow-lift">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#2c1e14]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {discountPct > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-cream">
              -{discountPct}%
            </span>
          )}
          <button
            onClick={() => setQuickViewOpen(true)}
            className="glass absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-14 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-gold/80">
            {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
          </p>
          <h3 className="font-display text-base leading-snug text-cream">{product.name}</h3>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-cream/50">
              <Star size={12} className="fill-gold text-gold" />
              {product.rating} · {product.reviews} reviews
            </div>
          )}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-semibold text-cream">{formatPKR(product.price)}</span>
            {product.compareAt && (
              <span className="text-xs text-cream/40 line-through">
                {formatPKR(product.compareAt)}
              </span>
            )}
          </div>
          <button
            onClick={() => setQuickViewOpen(true)}
            className="mt-3 w-full rounded-full border border-gold/40 py-2 text-xs font-semibold text-gold transition hover:bg-gold hover:text-ink"
          >
            Select Options
          </button>
        </div>
      </div>

      <QuickView
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
