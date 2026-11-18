import ProductCard from "./ProductCard";
import { RevealGroup, RevealItem } from "@/components/Reveal";

export default function ProductGrid({ title, subtitle, products, eyebrow }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {(title || eyebrow) && (
        <div className="mb-12 text-center">
          {eyebrow && (
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cream/40">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-huge font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-cream/40">{subtitle}</p>
          )}
        </div>
      )}
      <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <RevealItem key={p.id}>
            <ProductCard product={p} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
