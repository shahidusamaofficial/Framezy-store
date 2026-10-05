import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-5 py-24 text-center">
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/4 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-[140px] animate-orb-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[24rem] w-[24rem] rounded-full bg-clay/10 blur-[140px] animate-orb-drift"
        style={{ animationDelay: "-11s" }}
      />

      <div className="relative z-10 mx-auto max-w-xl">
        {/* Logo */}
        <Link href="/" className="inline-block">
          <Image
            src="/brand/icon@2x.png"
            alt="The Wall Edit"
            width={56}
            height={62}
            className="mx-auto h-14 w-auto opacity-80 transition hover:opacity-100"
          />
        </Link>

        {/* Massive 404 */}
        <p className="mt-8 font-display text-[clamp(6rem,18vw,12rem)] font-medium leading-none text-gradient-gold">
          404
        </p>

        {/* Eyebrow */}
        <div className="mt-2 mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60">
            Lost in the gallery
          </span>
          <span className="h-px w-8 bg-gold/40" />
        </div>

        {/* Message */}
        <h1 className="font-display text-3xl font-medium leading-tight text-cream md:text-4xl">
          Looks like this frame
          <br />
          <span className="italic font-light text-cream/70">fell off the wall.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-base text-cream/60">
          The page you're looking for doesn't exist, or may have moved. Let's get you back to browsing.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="magnetic group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-gold"
          >
            <Search size={15} />
            Shop the Collection
            <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-7 py-3.5 text-sm font-semibold text-cream transition hover:border-gold hover:text-gold"
          >
            <Home size={15} />
            Back to Home
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 border-t border-cream/10 pt-8">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-cream/40">
            Or try one of these
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/shop?category=islamic" className="text-cream/60 transition hover:text-gold">Islamic</Link>
            <Link href="/shop?category=abstract" className="text-cream/60 transition hover:text-gold">Abstract</Link>
            <Link href="/shop?category=typography" className="text-cream/60 transition hover:text-gold">Typography</Link>
            <Link href="/shop?bundles=1" className="text-cream/60 transition hover:text-gold">Bundles</Link>
            <Link href="/contact" className="text-cream/60 transition hover:text-gold">Contact</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
