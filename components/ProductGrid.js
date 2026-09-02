import ProductCard from "./ProductCard";

export default function ProductGrid({ title, subtitle, products, eyebrow }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      {(title || eyebrow) && (
        <div className="mb-10">
          {eyebrow && <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
          {title && <h2 className="font-display text-3xl text-cream md:text-4xl">{title}</h2>}
          {subtitle && <p className="mt-2 max-w-xl text-sm text-cream/60">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
