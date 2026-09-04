import Link from "next/link";

export const metadata = {
  title: "Frame Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
      <h1 className="font-display text-3xl text-cream">Frame not found</h1>
      <p className="mt-3 text-cream/60">
        This product may have been removed or the link is out of date.
      </p>
      <Link href="/shop" className="mt-8 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-cream">
        Browse the Shop
      </Link>
    </main>
  );
}
