"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";

/**
 * EditorialBundles — magazine-style bundle spread. Instead of a
 * 3-column grid of identical cards, each bundle gets a full-width
 * row with a large image on one side, copy + price on the other.
 * Rows alternate sides for rhythm.
 *
 * Takes up to 3 bundles.
 */
export default function EditorialBundles({ bundles = [], products = [] }) {
  const { addItem } = useCart();
  const shown = bundles.slice(0, 3);
  if (shown.length === 0) return null;

  function addBundle(bundle) {
    addItem(
      {
        id: bundle.id,
        name: bundle.name,
        image: bundle.image,
        price: bundle.price,
        sizes: [],
      },
      { kind: "bundle", size: `${bundle.productIds.length} pieces` }
    );
  }

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Bundle & save
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="font-display text-huge font-medium text-cream">
            Curated wall
            <br />
            <span className="italic font-light text-cream/70">bundles.</span>
          </h2>
        </div>

        {/* Rows */}
        <div className="space-y-20 md:space-y-32">
          {shown.map((bundle, i) => {
            const isLeft = i % 2 === 0;
            const pieces = (bundle.productIds || [])
              .map((slug) => products.find((p) => p.slug === slug)?.name)
              .filter(Boolean);
            const savings = bundle.compareAt ? bundle.compareAt - bundle.price : 0;

            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16"
              >
                {/* Image */}
                <Link
                  href={`/bundle/${bundle.slug}`}
                  className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl ${
                    isLeft ? "" : "md:order-2"
                  }`}
                >
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  {savings > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
                      Save {formatPKR(savings)}
                    </span>
                  )}
                </Link>

                {/* Copy */}
                <div className={isLeft ? "" : "md:order-1"}>
                  <span className="text-xs uppercase tracking-[0.3em] text-gold">
                    Bundle 0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-display font-medium text-cream md:text-huge">
                    {bundle.name}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-cream/60">
                    {bundle.description}
                  </p>
                  {pieces.length > 0 && (
                    <ul className="mt-5 space-y-1.5 text-sm text-cream/50">
                      {pieces.map((name) => (
                        <li key={name} className="flex items-center gap-2.5">
                          <span className="h-1 w-1 rounded-full bg-gold" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-7 flex items-center gap-5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl text-cream">
                        {formatPKR(bundle.price)}
                      </span>
                      {bundle.compareAt && (
                        <span className="text-sm text-cream/40 line-through">
                          {formatPKR(bundle.compareAt)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addBundle(bundle)}
                      className="magnetic inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold"
                    >
                      Add bundle
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}