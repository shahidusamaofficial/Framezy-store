import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-24 text-center">
      <Image
        src="/brand/icon@2x.png"
        alt="The Wall Edit"
        width={56}
        height={62}
        className="h-14 w-auto opacity-70"
      />
      <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gold">404</p>
      <h1 className="mt-3 font-display text-3xl text-cream md:text-4xl">
        Looks like this frame fell off the wall.
      </h1>
      <p className="mt-3 max-w-sm text-cream/60">
        The page you're looking for doesn't exist, or may have moved. Let's get you back to browsing.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-cream shadow-lift transition hover:bg-rust"
        >
          Shop the Collection
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
        <Link
          href="/"
          className="glass-hero inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-cream transition hover:scale-[1.02]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
