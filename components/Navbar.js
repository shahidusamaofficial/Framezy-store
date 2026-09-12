import Link from "next/link";

export default function Navbar({ categories = [] }) {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      <Link href="/shop" className="group relative text-sm text-cream/80 transition hover:text-gold">
        Shop All
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
      </Link>

      {categories.slice(0, 5).map((c) => (
        <Link
          key={c.slug}
          href={`/shop?category=${c.slug}`}
          className="group relative text-sm text-cream/80 transition hover:text-gold"
        >
          {c.name}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      ))}

      <Link href="/shop?bundles=1" className="group relative text-sm text-gold transition hover:text-butter">
        Bundles
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
      </Link>

      <Link href="/build-your-bundle" className="group relative text-sm text-gold transition hover:text-butter">
        Build Your Own
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
      </Link>
    </nav>
  );
}
