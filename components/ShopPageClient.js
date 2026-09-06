"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import BundleSection from "@/components/BundleSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getCategories, getProducts, getBundles, filterByCategory } from "@/lib/catalog";
import { rooms as ROOMS } from "@/lib/products";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const roomFilter = searchParams.get("room") || null;
  const showBundles = searchParams.get("bundles") === "1";
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const [active, setActive] = useState(initialCategory);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCategories(), getProducts(), getBundles()]).then(
      ([c, p, b]) => {
        if (cancelled) return;
        setCategories(c);
        setProducts(p);
        setBundles(b);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const activeRoom = ROOMS.find((r) => r.slug === roomFilter);

  const filtered = useMemo(() => {
    let list = filterByCategory(products, active);
    if (roomFilter) {
      list = list.filter((p) => p.room === roomFilter);
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

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Shop" }]} />

      <div className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">The full catalog</p>
        <h1 className="font-display text-4xl text-cream md:text-5xl">
          {query
            ? `Search results for "${searchParams.get("q")}"`
            : activeRoom
            ? `Frames for the ${activeRoom.name}`
            : "Shop All Frames"}
        </h1>
        {activeRoom && (
          <p className="mt-2 text-sm text-cream/50">
            Showing pieces suited to a {activeRoom.name.toLowerCase()}.{" "}
            <a href="/shop" className="text-gold underline underline-offset-2">Clear filter</a>
          </p>
        )}
      </div>

      <div className="scrollbar-none mb-10 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
            active === "all" ? "bg-clay text-cream" : "glass text-cream/70"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              active === c.slug ? "bg-clay text-cream" : "glass text-cream/70"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading && <p className="py-20 text-center text-cream/50">Loading catalog…</p>}

      {!loading && showBundles && bundles.length > 0 && (
        <div className="-mx-5 mb-6 md:-mx-8">
          <BundleSection bundles={bundles} products={products} />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="py-20 text-center text-cream/50">
          {query ? "No frames match that search — try another term." : "No frames in this category yet — check back soon."}
        </p>
      )}
    </main>
  );
}

export default function ShopPageClient() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-cream/50">Loading catalog…</div>}>
      <ShopContent />
    </Suspense>
  );
}
