"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Eye, Star } from "lucide-react";
import { formatPKR } from "@/lib/cart-context";
import { getPriceRange } from "@/lib/pricing";
import CountUp from "@/components/CountUp";

const QuickView = dynamic(() => import("./QuickView"), { ssr: false });

export default function ProductCard({ product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const discountPct = product.compareAt
    ? Math.round(100 - (product.price / product.compareAt) * 100)
    : 0;
  const { min, max } = getPriceRange(product);
  const hasRange = max > min;

  return (
    <>
      <motion.div
        className="group flex flex-col"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          href={`/product/${product.slug}`}
          className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream/5"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-cream/5" />
          )}
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 280px"
              onLoad={() => setImageLoaded(true)}
              className={`object-cover transition duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          {discountPct > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[10px] font-semibold text-ink">
              -{discountPct}%
            </span>
          )}
          {/* Quick view button */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-ink/90 px-4 py-2 text-xs font-medium text-cream backdrop-blur-sm transition hover:bg-ink"
            >
              <Eye size={13} /> Quick View
            </button>
          </div>
        </Link>

        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-wide text-cream/40">
            {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="mt-0.5 text-sm font-medium leading-snug text-cream transition-colors hover:text-cream/70">
              {product.name}
            </h3>
          </Link>
          {product.rating > 0 && (
            <div className="mt-1 flex items-center gap-1 text-xs text-cream/40">
              <Star size={11} className="fill-current" />
              {product.rating} · {product.reviews}
            </div>
          )}
          <div className="mt-1.5 flex items-baseline gap-1.5">
            {hasRange ? (
              <span className="text-sm font-semibold">
                {formatPKR(min)} – {formatPKR(max)}
              </span>
            ) : (
              <>
                <span className="text-sm font-semibold">
                  {formatPKR(product.price)}
                </span>
                {product.compareAt && (
                  <span className="text-xs text-cream/30 line-through">
                    {formatPKR(product.compareAt)}
                  </span>
                )}
              </>
            )}
          </div>
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
