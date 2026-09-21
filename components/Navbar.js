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
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Lock background scroll while the drawer is open
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
          scrolled ? "glass-dark shadow-glass" : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto grid max-w-7xl grid-cols-3 items-center px-5 transition-all duration-500 md:px-8 ${
            scrolled ? "py-2" : "py-3"
          }`}
        >
          {/* Left: menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-cream active:scale-90"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Center: logo stacked above brand name */}
          <Link href="/" className="flex flex-col items-center justify-center gap-0.5">
            <Image
              src="/brand/icon@2x.png"
              alt="The Wall Edit"
              width={44}
              height={48}
              className={`w-auto transition-all duration-500 ${scrolled ? "h-7" : "h-9"}`}
              priority
            />
            <span className="whitespace-nowrap font-display text-xs tracking-[0.08em] text-cream sm:text-sm">
              THE WALL EDIT
            </span>
          </Link>

          {/* Right: search, theme, cart */}
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
              className="rounded-full p-2 text-cream/80 transition hover:bg-white/10 active:scale-90"
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
              className="glass relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-cream transition hover:scale-[1.03] active:scale-95"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[11px] font-semibold text-cream">
                  {itemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile search, shown below header when toggled (no room in the 3-col grid on small screens) */}
        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-white/10 px-5 py-3 sm:hidden">
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

      {/* Nav drawer — slides in from the left, opposite the cart drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-ink/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="glass-dark fixed left-0 top-0 z-[90] flex h-full w-full max-w-xs flex-col border-r border-white/10 p-5"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Image src="/brand/icon@2x.png" alt="The Wall Edit" width={32} height={35} className="h-7 w-auto" />
                  <span className="font-display text-sm tracking-[0.08em] text-cream">THE WALL EDIT</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="p-1 text-cream/70 hover:text-cream"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="scrollbar-none flex-1 space-y-1 overflow-y-auto py-5">
                <Link
                  href="/shop"
                  onClick={() => setDrawerOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-[15px] text-cream/90 hover:bg-white/5"
                >
                  Shop All
                </Link>

                <p className="px-2 pb-1 pt-4 text-[11px] uppercase tracking-wide text-cream/40">Categories</p>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?category=${c.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-[15px] text-cream/70 hover:bg-white/5"
                  >
                    {c.name}
                  </Link>
                ))}

                <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
                  <Link
                    href="/shop?bundles=1"
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-[15px] text-gold hover:bg-white/5"
                  >
                    Bundles
                  </Link>
                  <Link
                    href="/build-your-bundle"
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-[15px] text-gold hover:bg-white/5"
                  >
                    Build Your Own
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-[15px] text-cream/90 hover:bg-white/5"
                  >
                    Blog
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
