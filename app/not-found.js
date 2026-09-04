import Link from "next/link";
import { Frame } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 py-24 text-center">
      <div className="glass mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <Frame size={26} className="text-gold" />
      </div>
      <h1 className="font-display text-4xl text-cream">404 — Page not found</h1>
      <p className="mt-3 text-cream/60">
        The page you're looking for doesn't exist, may have moved, or the link is out of date.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-clay px-6 py-3 text-sm font-semibold text-cream transition hover:bg-rust">
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="glass rounded-full px-6 py-3 text-sm font-semibold text-cream transition hover:scale-[1.02]"
        >
          Browse the Shop
        </Link>
      </div>
    </main>
  );
}
