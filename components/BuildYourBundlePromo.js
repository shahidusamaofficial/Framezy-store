import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BuildYourBundlePromo() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div className="glass relative overflow-hidden rounded-3xl border border-gold/20 px-6 py-12 text-center md:px-16 md:py-16">
        <span className="mx-auto mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
          <Sparkles size={13} />
          New
        </span>
        <h2 className="font-display text-3xl text-cream md:text-5xl">
          Build Your Own Bundle
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-cream/70">
          Pick any 3 single-panel prints and get <span className="text-gold">40% off</span> the
          combined price — no fixed sets, just what you actually want on your wall.
        </p>
        <Link
          href="/build-your-bundle"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-cream shadow-lift transition hover:bg-rust"
        >
          Start Building
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
