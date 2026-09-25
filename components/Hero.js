"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="hero-photo-scope relative overflow-hidden">
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/brand/hero-photo.webp"
          alt="A hand hanging a framed print on a warmly lit gallery wall at golden hour"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex max-w-xl flex-col"
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
      </div>

      <div className="glass-dark overflow-hidden border-y border-white/10 py-3">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm uppercase tracking-[0.3em] text-cream/50">
                    {Array(2)
            .fill([
              "Cash on delivery available",
              "Fade-resistant printing",
              "Ships in 5–7 working days",
              "Shipping fee waived for advance payment",
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
