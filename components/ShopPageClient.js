"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { filterByCategory } from "@/lib/catalog";

function ShopContent({ initialCategories, initialProducts }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const [active, setActive] = useState(initialCategory);

  const categories = initialCategories;
  const products = initialProducts;

  const filtered = useMemo(() => {
    let list = filterByCategory(products, active);
    if (query) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }
    return list;
  }, [products, active, query]);

  const heading = query ? `Search: "${searchParams.get("q")}"` : "Shop All Frames";

  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Shop" }]} />
        <h1 className="mt-6 text-huge font-semibold">{heading}</h1>
        <p className="mt-2 text-sm text-cream/40">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button onClick={() => setActive("all")} className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${active === "all" ? "bg-clay text-cream" : "border border-cream/15 text-cream/60 hover:text-cream"}`}>All</button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setActive(c.slug)} className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${active === c.slug ? "bg-clay text-cream" : "border border-cream/15 text-cream/60 hover:text-cream"}`}>{c.name}</button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-cream/40">{query ? "No frames match that search." : "No frames in this category yet."}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShopPageClient({ initialCategories, initialProducts }) {
  return (
    <Suspense fallback={<div className="py-32 text-center text-cream/40">Loading…</div>}>
      <ShopContent initialCategories={initialCategories} initialProducts={initialProducts} />
    </Suspense>
  );
}
