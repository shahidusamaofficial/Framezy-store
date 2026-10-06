"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "@/lib/cart-context";
import { getCategories } from "@/lib/catalog";
import { categories as staticCategories } from "@/lib/products";

export default function Navbar() {
  const { itemCount, setIsOpen, bump } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function submitSearch(e) {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setDrawerOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-dark border-b border-cream/5"
            : "bg-transparent"
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`mx-auto grid max-w-7xl grid-cols-3 items-center px-5 transition-all duration-500 md:px-8 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="group flex items-center gap-2 rounded-full p-2 text-cream transition hover:text-gold"
            >
              <Menu size={20} className="transition group-hover:scale-110" />
              <span className="hidden text-xs uppercase tracking-[0.25em] sm:inline">
                Menu
              </span>
            </button>
          </div>

          <Link
            href="/"
            className="flex flex-col items-center justify-center"
            aria-label="The Wall Edit home"
          >
            <span className="whitespace-nowrap font-display text-base tracking-[0.15em] text-cream transition-all duration-500 md:text-lg">
              THE WALL EDIT
            </span>
            <span
              className={`mt-0.5 h-px bg-gold transition-all duration-500 ${
                scrolled ? "w-8" : "w-12"
              }`}
            />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <form
              onSubmit={submitSearch}
              className={`hidden items-center overflow-hidden rounded-full transition-all duration-300 sm:flex ${
                searchOpen ? "glass w-40 px-3 md:w-48" : "w-0"
              }`}
            >
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search…"
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
              className="rounded-full p-2 text-cream/80 transition hover:text-gold"
            >
              {searchOpen ? <X size={18} /> : <Search size={19} />}
            </button>
            <motion.button
              aria-label="Open cart"
              onClick={() => setIsOpen(true)}
              key={bump}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-cream transition hover:text-gold"
            >
              <ShoppingBag size={17} />
              <span className="hidden text-xs uppercase tracking-[0.2em] sm:inline">
                Cart
              </span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-semibold text-ink">
                  {itemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-cream/5 px-5 py-3 sm:hidden">
            <div className="glass flex items-center gap-2 rounded-full px-3 py-2">
              <Search size={16} className="text-cream/50" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search frames…"
                aria-label="Search products"
                autoFocus
                className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 outline-none"
              />
            </div>
          </form>
        )}
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="glass-dark fixed left-0 top-0 z-[90] flex h-full w-full max-w-sm flex-col border-r border-cream/10 p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-cream/10 pb-5">
                <div className="flex items-center gap-3">
                  <Image src="/brand/icon@2x.png" alt="The Wall Edit" width={32} height={35} className="h-8 w-auto" />
                  <span className="font-display text-sm tracking-[0.12em] text-cream">THE WALL EDIT</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="p-1 text-cream/70 transition hover:text-gold"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="scrollbar-none flex-1 space-y-1 overflow-y-auto py-5">
                <Link
                  href="/find-your-style"
                  onClick={() => setDrawerOpen(false)}
                  className="mb-3 flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-3 text-sm font-medium text-gold transition hover:bg-gold/15"
                >
                  ✨ Find Your Style
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setDrawerOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base text-cream/90 transition hover:bg-cream/5"
                >
                  Shop All
                </Link>

                <p className="px-3 pb-1 pt-5 text-[11px] uppercase tracking-[0.2em] text-cream/40">
                  Categories
                </p>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?category=${c.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-base text-cream/70 transition hover:bg-cream/5 hover:text-cream"
                  >
                    {c.name}
                  </Link>
                ))}

                <div className="mt-5 space-y-1 border-t border-cream/10 pt-5">
                  <Link
                    href="/shop?bundles=1"
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-base text-gold transition hover:bg-cream/5"
                  >
                    Bundles
                  </Link>
                  <Link
                    href="/build-your-bundle"
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-base text-gold transition hover:bg-cream/5"
                  >
                    Build Your Own
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-base text-cream/90 transition hover:bg-cream/5"
                  >
                    Blog
                  </Link>
                </div>
              </nav>

              <div className="border-t border-cream/10 pt-5 text-xs text-cream/40">
                Free shipping over Rs. 6,000 · COD across Pakistan
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}