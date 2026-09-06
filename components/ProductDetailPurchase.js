"use client";

import { useState } from "react";
import { Minus, Plus, Star } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";
import { getPriceForSize } from "@/lib/pricing";

export default function ProductDetailPurchase({ product }) {
  const { addItem, setIsOpen } = useCart();
  const [size, setSize] = useState(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const unitPrice = getPriceForSize(product, size);

  function handleAdd() {
    addItem(product, { size, qty, price: unitPrice });
    setIsOpen(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-gold/80">
          {product.panels > 1 ? `${product.panels}-Panel Set` : "Single Panel"}
        </p>
        <h1 className="font-display text-3xl leading-tight text-cream md:text-4xl">{product.name}</h1>
        {product.rating > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm text-cream/50">
            <Star size={14} className="fill-gold text-gold" />
            {product.rating} · {product.reviews} reviews
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-cream">{formatPKR(unitPrice)}</span>
        {product.compareAt && !product.sizePrices && (
          <span className="text-base text-cream/40 line-through">{formatPKR(product.compareAt)}</span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-cream/70">{product.description}</p>

      {product.sizes?.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-cream/50">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  size === s
                    ? "border-gold bg-gold text-ink font-semibold"
                    : "border-white/20 text-cream/70 hover:border-gold/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.isCustom && (
        <p className="rounded-xl bg-white/5 p-3 text-sm text-cream/60">
          After checkout, WhatsApp us your names/date and we'll confirm the layout before printing.
        </p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center rounded-full border border-white/20">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-3 text-cream/70 hover:text-cream"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <span className="w-7 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="p-3 text-cream/70 hover:text-cream"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 rounded-full bg-clay py-3.5 text-sm font-semibold text-cream transition hover:bg-rust"
        >
          Add to Cart — {formatPKR(unitPrice * qty)}
        </button>
      </div>
    </div>
  );
}
