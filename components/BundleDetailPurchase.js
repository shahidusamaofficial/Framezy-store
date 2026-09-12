"use client";

import Link from "next/link";
import { useCart, formatPKR } from "@/lib/cart-context";

export default function BundleDetailPurchase({ bundle, pieces }) {
  const { addItem } = useCart();

  function handleAdd() {
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

  const savings = bundle.compareAt ? bundle.compareAt - bundle.price : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Bundle & Save</p>
        <h1 className="font-display text-3xl text-cream md:text-4xl">{bundle.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-cream/60">{bundle.description}</p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl text-cream">{formatPKR(bundle.price)}</span>
        {bundle.compareAt && (
          <span className="text-sm text-cream/40 line-through">{formatPKR(bundle.compareAt)}</span>
        )}
        {savings > 0 && (
          <span className="rounded-full bg-moss px-2.5 py-1 text-[11px] font-semibold text-cream">
            Save {formatPKR(savings)}
          </span>
        )}
      </div>

      {pieces.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-gold">What&apos;s included</p>
          <ul className="space-y-2 text-sm text-cream/70">
            {pieces.map((p) => (
              <li key={p.slug} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <Link href={`/product/${p.slug}`} className="hover:text-gold hover:underline underline-offset-2">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleAdd}
        className="w-full rounded-full bg-clay py-3.5 text-sm font-semibold text-cream transition hover:bg-rust active:scale-95"
      >
        Add Bundle — {formatPKR(bundle.price)}
      </button>
    </div>
  );
}
