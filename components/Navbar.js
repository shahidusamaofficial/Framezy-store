"use client";
import Link from "next/link";
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
  const [cats, setCats] = useState(staticCategories);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { getCategories().then(setCats); }, []);

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
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-ink/80 backdrop-blur-xl border-b border-cream/5" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <button onClick={() => setDrawerOpen(true)} aria-label="Menu" className="text-cream/70 transition hover:text-cream">
            <Menu size={18} />
          </button>

          <Link href="/" className="text-sm font-semibold tracking-tight">The Wall Edit</Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button aria-label="Search" onClick={() => setSearchOpen(o => !o)} className="text-cream/70 transition hover:text-cream">
              {searchOpen ? <X size={17} /> : <Search size={17} />}
            </button>
            <motion.button aria-label="Cart" onClick={() => setIsOpen(true)} key={bump} initial={{ scale: 1 }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3 }} className="relative text-cream/70 transition hover:text-cream">
              <ShoppingBag size={17} />
              {itemCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] font-semibold text-ink">{itemCount}</span>}
            </motion.button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-cream/5 px-6 py-2">
            <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search frames…" className="w-full rounded-full border border-cream/15 px-4 py-2 text-sm text-cream outline-none" autoFocus />
          </form>
        )}
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} />
            <motion.aside className="fixed left-0 top-0 z-[90] flex h-full w-full max-w-xs flex-col bg-ink p-6" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="flex items-center justify-between border-b border-cream/5 pb-4">
                <span className="text-sm font-semibold">The Wall Edit</span>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close" className="text-cream/50 transition hover:text-cream"><X size={18} /></button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto py-4">
                <Link href="/shop" onClick={() => setDrawerOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-cream/80 transition hover:bg-cream/5">Shop All</Link>
                <p className="px-3 pb-1 pt-4 text-[10px] uppercase tracking-wide text-cream/30">Categories</p>
                {cats.map((c) => (<Link key={c.slug} href={`/shop?category=${c.slug}`} onClick={() => setDrawerOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-cream/60 transition hover:bg-cream/5 hover:text-cream">{c.name}</Link>))}
                <div className="mt-4 border-t border-cream/5 pt-4">
                  <Link href="/shop?bundles=1" onClick={() => setDrawerOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-cream/5">Bundles</Link>
                  <Link href="/contact" onClick={() => setDrawerOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-cream/60 transition hover:bg-cream/5">Contact</Link>
                </div>
              </nav>
              <div className="border-t border-cream/5 pt-4 text-xs text-cream/30">Free shipping over Rs. 5,000 · COD across Pakistan</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
