"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";

export default function BundleSection({ bundles, products = [] }) {
  const { addItem } = useCart();

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
    <section className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24" id="bundles">
      <div className="mb-10 flex items-center gap-3">
        <Package className="text-gold" size={20} />
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gold">Bundle & Save</p>
          <h2 className="font-display text-3xl text-cream md:text-4xl">Curated Wall Bundles</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {bundles.map((bundle) => {
          const pieces = (bundle.productIds || [])
            .map((slug) => products.find((p) => p.slug === slug)?.name)
            .filter(Boolean);
          const savings = bundle.compareAt ? bundle.compareAt - bundle.price : 0;

          return (
            <div
              key={bundle.id}
              className="glass flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image src={bundle.image} alt={bundle.name} fill sizes="360px" className="object-cover" />
                {savings > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-moss px-2.5 py-1 text-[11px] font-semibold text-cream">
                    Save {formatPKR(savings)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-display text-xl text-cream">{bundle.name}</h3>
                <p className="text-sm text-cream/60">{bundle.description}</p>
                {pieces.length > 0 && (
                  <ul className="space-y-1 text-xs text-cream/50">
                    {pieces.map((name) => (
                      <li key={name} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-gold" /> {name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div>
                    <span className="font-display text-xl text-cream">{formatPKR(bundle.price)}</span>{" "}
                    {bundle.compareAt && (
                      <span className="text-xs text-cream/40 line-through">{formatPKR(bundle.compareAt)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addBundle(bundle)}
                    className="rounded-full bg-clay px-4 py-2 text-xs font-semibold text-cream transition hover:bg-rust"
                  >
                    Add Bundle
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
