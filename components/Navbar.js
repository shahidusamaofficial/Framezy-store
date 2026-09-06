"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "@/lib/cart-context";
import { getCategories } from "@/lib/catalog";
import { categories as staticCategories } from "@/lib/products";

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  function submitSearch(e) {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setMobileOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-glass" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap sm:gap-3">
          <Image
            src="/brand/icon@2x.png"
            alt="The Wall Edit"
            width={44}
            height={48}
            className="h-9 w-auto sm:h-10 md:h-11"
            priority
          />
          <span className="font-display text-base tracking-[0.08em] text-cream sm:text-lg md:text-xl">
            THE WALL EDIT
          </span>
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
          <form
            onSubmit={submitSearch}
            className={`hidden items-center overflow-hidden rounded-full transition-all duration-300 md:flex ${
              searchOpen ? "glass w-48 px-3" : "w-0"
            }`}
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search frames…"
              aria-label="Search products"
              className={`w-full bg-transparent py-2 text-sm text-cream placeholder:text-cream/40 outline-none ${
                searchOpen ? "block" : "hidden"
              }`}
            />
          </form>
          <ThemeToggle />
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search"}
            onClick={() => setSearchOpen((o) => !o)}
            className="hidden rounded-full p-2 text-cream/80 transition hover:bg-white/10 md:inline-flex"
          >
            {searchOpen ? <X size={18} /> : <Search size={19} />}
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
          <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 rounded-full border border-white/15 px-3 py-2">
            <Search size={16} className="text-cream/50" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search frames…"
              aria-label="Search products"
              className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 outline-none"
            />
          </form>
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
