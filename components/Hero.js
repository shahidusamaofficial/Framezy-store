"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";
import { formatPKR } from "@/lib/cart-context";

const HEADLINE_LINE_1 = ["Walls", "that", "feel"];
const HEADLINE_LINE_2_PREFIX = "like";

// Where each featured frame lands in the cluster, and where it flies in
// from (off-screen direction) — hand-tuned for a natural, non-uniform
// "someone just hung these" feel rather than a rigid grid.
const THUMB_LAYOUT = [
  { top: "6%", right: "6%", size: 108, rotate: -6, from: { x: 140, y: -80 } },
  { top: "34%", right: "20%", size: 88, rotate: 4, from: { x: 180, y: 40 } },
  { top: "18%", right: "34%", size: 96, rotate: -3, from: { x: 60, y: -140 } },
  { top: "50%", right: "4%", size: 78, rotate: 7, from: { x: 160, y: 120 } },
];

function FrameWord({ word, index }) {
  return (
    <span className="relative mx-[0.15em] inline-block">
      <motion.span
        className="pointer-events-none absolute -inset-1 rounded-sm border-2 border-gold"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 1.25 }}
        transition={{ duration: 0.5, delay: 0.5 + index * 0.12, ease: "easeOut" }}
      />
      <motion.span
        className="relative inline-block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 + index * 0.12, ease: "easeOut" }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function FeaturedThumb({ product, layout, index, assembled }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute z-10"
      style={{ top: layout.top, right: layout.right, width: layout.size, height: layout.size * 1.15 }}
      initial={{ opacity: 0, x: layout.from.x, y: layout.from.y, rotate: layout.rotate * 3, scale: 0.7 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: layout.rotate, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 14,
        delay: 0.9 + index * 0.18,
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative block h-full w-full"
      >
        <div className="relative h-full w-full overflow-hidden rounded-md shadow-2xl ring-1 ring-white/20 transition group-hover:ring-gold/60">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="120px"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        </div>

        {/* invitation pulse, only once the cluster has finished assembling */}
        {assembled && !hovered && (
          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold" />
          </span>
        )}

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="glass-dark pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[160px] -translate-x-1/2 rounded-lg px-3 py-2 text-center shadow-lift"
            >
              <p className="text-[11px] leading-snug text-cream">{product.name}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-gold">{formatPKR(product.price)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

export default function Hero({ featuredProducts = [] }) {
  const sectionRef = useRef(null);
  const [assembled, setAssembled] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Multi-layer parallax: background photo drifts slowest, the light-sweep
  // overlay drifts a touch faster, content scales/fades on the way out for
  // a cinematic handoff into whatever section follows.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  function handlePointerMove(e) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      className="hero-photo-scope relative overflow-hidden"
    >
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 -z-20">
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

      {/* cursor-reactive light sweep */}
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute inset-0 -z-10 hidden transition-opacity duration-300 md:block"
      >
        <div
          className="absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{
            background: `radial-gradient(480px circle at ${pointer.x}% ${pointer.y}%, rgba(201,163,90,0.35), transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div style={{ scale: contentScale, opacity: contentOpacity }} className="relative">
        {/* featured product cluster — the "gallery assembly" + shoppable hotspots */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="pointer-events-auto absolute inset-0">
            {featuredProducts.slice(0, 4).map((product, i) => (
              <FeaturedThumb
                key={product.id}
                product={product}
                layout={THUMB_LAYOUT[i]}
                index={i}
                assembled={assembled}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setAssembled(true), 900)}
            className="flex max-w-xl flex-col"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-widest text-gold"
            >
              Pakistan's frame drop of the season
            </motion.span>

            <h1 className="font-display text-5xl leading-[1.05] text-cream md:text-6xl lg:text-7xl">
              {HEADLINE_LINE_1.map((word, i) => (
                <FrameWord key={word} word={word} index={i} />
              ))}
              <br />
              <FrameWord word={HEADLINE_LINE_2_PREFIX} index={3} />{" "}
              <span className="relative mx-[0.15em] inline-block">
                <motion.span
                  className="pointer-events-none absolute -inset-1 rounded-sm border-2 border-gold"
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.25 }}
                  transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
                />
                <motion.span
                  className="text-gradient relative inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0, ease: "easeOut" }}
                >
                  you
                </motion.span>
              </span>
              .
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-6 max-w-md text-base leading-relaxed text-cream/70 md:text-lg"
            >
              Retro tones, gallery-grade prints, and frames built to survive
              monsoon humidity — not just a pretty photo. Amazing quality, honest
              prices, delivered anywhere in Pakistan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
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
