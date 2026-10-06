"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import BundleSection from "@/components/BundleSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { filterByCategory } from "@/lib/catalog";
import { rooms as ROOMS } from "@/lib/products";

function ShopContent({ initialCategories, initialProducts, initialBundles }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const roomFilter = searchParams.get("room") || null;
  const showBundles = searchParams.get("bundles") === "1";
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const [active, setActive] = useState(initialCategory);

  const categories = initialCategories;
  const products = initialProducts;
  const bundles = initialBundles;

  const activeRoom = ROOMS.find((r) => r.slug === roomFilter);

  const filtered = useMemo(() => {
    let list = filterByCategory(products, active);
    if (roomFilter) {
      list = list.filter((p) => (p.rooms?.length > 0 ? p.rooms : [p.room]).includes(roomFilter));
    }
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }
    return list;
  }, [products, active, roomFilter, query]);

  const heading = query
    ? `Search: "${searchParams.get("q")}"`
    : activeRoom
    ? `Frames for the ${activeRoom.name}`
    : "Shop All Frames";

  return (
    <main className="bg-ink">
      {/* Hero header */}
      <section className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-16">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Shop" }]} />

        <div className="mb-12 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              The full catalog
            </span>
          </motion.div>
          <h1 className="font-display text-huge font-medium text-cream">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="block pb-4 pt-1 leading-[1.1]"
              >
                {heading}
              </motion.span>
            </span>
          </h1>
          {activeRoom && (
            <p className="mt-4 text-sm text-cream/50">
              Showing pieces suited to a {activeRoom.name.toLowerCase()}.{" "}
              <a href="/shop" className="text-gold underline underline-offset-2">Clear filter</a>
            </p>
          )}
          {!query && !activeRoom && (
            <p className="mt-4 max-w-xl text-base text-cream/60">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} — gallery-grade prints, built to outlast trends, delivered anywhere in Pakistan.
            </p>
          )}
        </div>
      </section>

      {/* Category filter bar */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActive("all")}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              active === "all"
                ? "bg-gold text-ink"
                : "border border-cream/15 text-cream/70 hover:border-gold/40 hover:text-cream"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                active === c.slug
                  ? "bg-gold text-ink"
                  : "border border-cream/15 text-cream/70 hover:border-gold/40 hover:text-cream"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Bundles section (if requested) */}
      {showBundles && bundles.length > 0 && (
        <div className="mt-16">
          <BundleSection bundles={bundles} products={products} />
        </div>
      )}

      {/* Product grid */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        {filtered.length > 0 ? (
          <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <RevealItem key={p.id}>
                <ProductCard product={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <div className="py-24 text-center">
            <div className="mb-4 text-5xl opacity-20">🖼️</div>
            <p className="text-cream/50">
              {query ? "No frames match that search — try another term." : "No frames in this category yet — check back soon."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ShopPageClient({ initialCategories, initialProducts, initialBundles }) {
  return (
    <Suspense fallback={<div className="py-32 text-center text-cream/50">Loading catalog…</div>}>
      <ShopContent
        initialCategories={initialCategories}
        initialProducts={initialProducts}
        initialBundles={initialBundles}
      />
    </Suspense>
  );
}
