import Image from "next/image";

/**
 * Loading state — shown automatically by Next.js App Router while
 * a route's content is being fetched/rendered. Premium version:
 * logo + animated gold dots + a few skeleton lines that shimmer.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      {/* Logo with subtle pulse */}
      <Image
        src="/brand/icon@2x.png"
        alt=""
        width={44}
        height={48}
        className="h-10 w-auto opacity-60"
        aria-hidden
      />

      {/* Animated gold dots */}
      <div className="flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gold" />
      </div>

      {/* Skeleton shimmer lines — feels like content is loading */}
      <div className="flex flex-col items-center gap-2" aria-hidden>
        <div className="h-2 w-32 animate-pulse rounded-full bg-cream/10" />
        <div className="h-2 w-20 animate-pulse rounded-full bg-cream/5" />
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
