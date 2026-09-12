"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useCart, formatPKR } from "@/lib/cart-context";

const BUNDLE_DISCOUNT = 0.4; // 40% off the combined price of 3 picks
const PICK_COUNT = 3;

export default function BuildYourBundle({ products }) {
  const [selected, setSelected] = useState([]);
  const { addItem, setIsOpen } = useCart();

  function toggle(product) {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= PICK_COUNT) return prev; // already full, ignore
      return [...prev, product];
    });
  }

  const isFull = selected.length === PICK_COUNT;
  const subtotal = selected.reduce((sum, p) => sum + p.price, 0);
  const discountedTotal = Math.round(subtotal * (1 - BUNDLE_DISCOUNT));

  function handleAddToCart() {
    if (!isFull) return;
    const bundleProduct = {
      id: `custom-bundle-${selected.map((p) => p.id).join("-")}-${Date.now()}`,
      name: "Build-Your-Own Bundle",
      image: selected[0].image,
    };
    addItem(bundleProduct, {
      kind: "custom-bundle",
      price: discountedTotal,
      size: selected.map((p) => p.name).join(" + "),
      qty: 1,
    });
    setSelected([]);
    setIsOpen(true);
  }

  return (
    <div className="mt-10 pb-32">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => {
          const isSelected = selected.some((p) => p.id === product.id);
          const disabled = !isSelected && isFull;
          return (
            <button
              key={product.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(product)}
              className={`group relative overflow-hidden rounded-2xl retro-border text-left transition ${
                disabled ? "opacity-40" : "hover:-translate-y-1"
              }`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#2c1e14]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink">
                      <Check size={18} />
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm leading-snug text-cream">{product.name}</p>
                <p className="mt-1 text-xs text-cream/50">{formatPKR(product.price)}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="glass fixed inset-x-0 bottom-0 z-40 border-t border-white/10 px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-cream/70">
              {selected.length} of {PICK_COUNT} picked
            </p>
            {isFull ? (
              <p className="text-lg font-semibold text-cream">
                <span className="text-cream/40 line-through">{formatPKR(subtotal)}</span>{" "}
                {formatPKR(discountedTotal)}{" "}
                <span className="text-sm font-normal text-gold">(40% off)</span>
              </p>
            ) : (
              <p className="text-sm text-cream/50">Pick {PICK_COUNT - selected.length} more to unlock 40% off.</p>
            )}
          </div>
          <button
            type="button"
            disabled={!isFull}
            onClick={handleAddToCart}
            className="rounded-full bg-clay px-7 py-3 text-sm font-semibold text-cream transition hover:bg-rust disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add Bundle to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
