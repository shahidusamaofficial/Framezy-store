"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { categories } from "@/lib/products";

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-glass" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight text-cream">
          Frame<span className="text-gradient italic">zy</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/shop" className="text-sm text-cream/80 transition hover:text-gold">
            Shop All
          </Link>
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="text-sm text-cream/80 transition hover:text-gold"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/shop?bundles=1" className="text-sm text-gold transition hover:text-butter">
            Bundles
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="hidden rounded-full p-2 text-cream/80 transition hover:bg-white/10 md:inline-flex"
          >
            <Search size={19} />
          </button>
          <button
            aria-label="Open cart"
            onClick={() => setIsOpen(true)}
            className="glass relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-cream transition hover:scale-[1.03]"
          >
            <ShoppingBag size={17} />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[11px] font-semibold text-cream">
                {itemCount}
              </span>
            )}
          </button>
          <button
            className="rounded-full p-2 text-cream md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass-dark mx-4 mb-4 rounded-2xl p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/shop" onClick={() => setMobileOpen(false)} className="text-cream/90">
              Shop All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="text-cream/70"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/shop?bundles=1" onClick={() => setMobileOpen(false)} className="text-gold">
              Bundles
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
