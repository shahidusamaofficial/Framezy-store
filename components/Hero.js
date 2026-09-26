"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";
import MagneticButton from "./MagneticButton";

const EASE = [0.22, 1, 0.36, 1];

const HEADLINE_LINES = ["Walls that feel", "like"];

function AnimatedLine({ text, delay }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

// Depth-scaled mouse-parallax transform for a single floating card.
function useCardTilt(springX, springY, depth) {
  const rotateY = useTransform(springX, [-0.5, 0.5], [8 * depth, -8 * depth]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [-8 * depth, 8 * depth]);
  const x = useTransform(springX, [-0.5, 0.5], [-22 * depth, 22 * depth]);
  const y = useTransform(springY, [-0.5, 0.5], [-22 * depth, 22 * depth]);
  return { rotateX, rotateY, x, y };
}

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Mouse position, normalized -0.5 to 0.5 across the hero section.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const card1 = useCardTilt(springX, springY, 1.4);
  const card2 = useCardTilt(springX, springY, 0.9);
  const card3 = useCardTilt(springX, springY, 1.15);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="hero-photo-scope relative overflow-hidden"
      style={{ perspective: 1200 }}
    >
      {/* Cinematic video background, scales up slowly on scroll */}
      <motion.div style={{ scale: videoScale }} className="pointer-events-none absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/brand/hero-photo.webp"
          className="h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#F9F7F2]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
      </motion.div>

      {/* Floating glass cards — continuous float + mouse-driven 3D tilt, layered depth */}
      <motion.div
        className="glass pointer-events-none absolute right-[8%] top-[14%] hidden h-40 w-32 overflow-hidden rounded-2xl lg:block"
        style={{ rotateX: card1.rotateX, rotateY: card1.rotateY, x: card1.x, y: card1.y }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/brand/hero-photo.webp" alt="" fill sizes="140px" className="object-cover" />
      </motion.div>

      <motion.div
        className="glass pointer-events-none absolute right-[20%] top-[42%] hidden h-32 w-40 overflow-hidden rounded-2xl xl:block"
        style={{ rotateX: card2.rotateX, rotateY: card2.rotateY, x: card2.x, y: card2.y }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <Image src="/brand/hero-photo.webp" alt="" fill sizes="160px" className="object-cover" />
      </motion.div>

      <motion.div
        className="glass pointer-events-none absolute right-[4%] top-[62%] hidden h-36 w-28 overflow-hidden rounded-2xl lg:block"
        style={{ rotateX: card3.rotateX, rotateY: card3.rotateY, x: card3.x, y: card3.y }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 }}
      >
        <Image src="/brand/hero-photo.webp" alt="" fill sizes="120px" className="object-cover" />
      </motion.div>

      <motion.div style={{ y: contentY }} className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex max-w-xl flex-col">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-widest text-gold"
          >
            Pakistan's frame drop of the season
          </motion.span>

          <h1 className="font-display text-5xl leading-[1.05] text-cream md:text-6xl lg:text-7xl">
            <AnimatedLine text={HEADLINE_LINES[0]} delay={0.15} />
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
              >
                {HEADLINE_LINES[1]} <span className="text-gradient">you.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            className="mt-6 max-w-md text-base leading-relaxed text-cream/70 md:text-lg"
          >
            Retro tones, gallery-grade prints, and frames built to survive
            monsoon humidity — not just a pretty photo. Amazing quality, honest
            prices, delivered anywhere in Pakistan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-cream shadow-lift transition hover:bg-rust"
              >
                Shop the Collection
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/shop?bundles=1"
                className="glass-hero inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-cream transition hover:scale-[1.02]"
              >
                Explore Bundles
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
            className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            <div className="flex items-center gap-2 text-xs text-cream/60">
              <Truck size={16} className="text-gold" /> COD across PK
            </div>
            <div className="flex items-center gap-2 text-xs text-cream/60">
              <ShieldCheck size={16} className="text-gold" /> Secure packaging
            </div>
            <div className="flex items-center gap-2 text-xs text-cream/60">
              <Star size={16} className="text-gold" /> 4.9 rated
            </div>
          </motion.div>
        </div>
      </motion.div>

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
