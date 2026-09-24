import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FindYourStylePromo() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div className="glass relative overflow-hidden rounded-3xl border border-gold/20 px-6 py-12 text-center md:px-16 md:py-16">
        <span className="mx-auto mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
          <Sparkles size={13} />
          60-second quiz
        </span>
        <h2 className="font-display text-3xl text-cream md:text-5xl">
          What's Your Wall Art Style?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-cream/70">
          Answer a few quick questions and we'll match you with pieces that actually fit your
          space — not just what's trending.
        </p>
        <Link
          href="/find-your-style"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-cream shadow-lift transition hover:bg-rust"
        >
          Take the Quiz
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
