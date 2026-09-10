"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";

const heroImages = [
  "/hero/b6c18eecc5d3ae58eecc1d6caa8c0840.jpg",
  "/hero/fc64297ea2e1b39c30879aa5333dcdb4.jpg",
];

export default function Hero() {
  return (
    <section className="hero-photo-scope relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/brand/hero-bg.jpg"
          alt="A warmly lit living room with a curated gallery wall of framed art"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <motion.div
          className="absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-clay/20 blur-[110px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-20 pt-14 md:grid-cols-2 md:px-8 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
            Pakistan's frame drop of the season
          </span>
          <h1 className="font-display text-5xl leading-[1.05] text-cream md:text-6xl lg:text-7xl">
            Walls that feel
            <br />
            like <span className="text-gradient">you</span>.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-cream/70 md:text-lg">
            Retro tones, gallery-grade prints, and frames built to survive
            monsoon humidity — not just a pretty photo. Amazing quality, honest
            prices, delivered anywhere in Pakistan.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-cream shadow-lift transition hover:bg-rust"
            >
              Shop the Collection
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop?bundles=1"
              className="glass-hero inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-cream transition hover:scale-[1.02]"
            >
              Explore Bundles
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-xs text-cream/60">
              <Truck size={16} className="text-gold" /> COD across PK
            </div>
            <div className="flex items-center gap-2 text-xs text-cream/60">
              <ShieldCheck size={16} className="text-gold" /> Secure packaging
            </div>
            <div className="flex items-center gap-2 text-xs text-cream/60">
              <Star size={16} className="text-gold" /> 4.9 rated
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative flex items-center justify-center"
        >
          <div className="glass-hero relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] p-3 animate-floatSlow">
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
              <Image
                src={heroImages[0]}
                alt="Islamic calligraphy wall art in navy and gold, framed"
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="glass-hero absolute -bottom-8 -left-6 hidden w-44 rounded-2xl p-2 shadow-lift sm:block">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={heroImages[1]}
                alt="Abstract terracotta and botanical textured wall art"
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="glass-dark overflow-hidden border-y border-white/10 py-3">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm uppercase tracking-[0.3em] text-cream/50">
          {Array(2)
            .fill([
              "Free delivery on prepaid orders",
              "Cash on delivery available",
              "Handmade wood-backed frames",
              "Fade-resistant printing",
              "Ships in 3–5 working days",
            ])
            .flat()
            .map((t, i) => (
              <span key={i} className="flex items-center gap-10">
                {t} <span className="text-gold">✦</span>
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
