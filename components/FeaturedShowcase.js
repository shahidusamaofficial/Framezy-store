"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatPKR } from "@/lib/cart-context";
import { getPriceRange } from "@/lib/pricing";
import TiltCard from "./TiltCard";
import ScrollVelocityBlur from "./ScrollVelocityBlur";
import MagneticButton from "./MagneticButton";

/**
 * FeaturedShowcase — full-bleed product spotlight with:
 *  - Masked line reveal on headings (descender-safe: inner span has
 *    pb-4 pt-1 leading-[1.1] so y/g/p/j tails never clip)
 *  - TiltCard on every product image (3D cursor tilt + glare)
 *  - ScrollVelocityBlur on images (blurs slightly when scrolling fast)
 *  - MagneticButton on the "View piece" CTA
 *  - Alternating left/right layout for rhythm
 */
export default function FeaturedShowcase({ products = [] }) {
  const showcase = products.slice(0, 4);
  if (showcase.length === 0) return null;

  return (
    <section className="relative bg-ink">
      {/* Section intro */}
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold">
                Featured pieces
              </span>
            </motion.div>
            {/* Masked line-by-line heading reveal — descender-safe */}
            <h2 className="font-display text-huge font-medium text-cream">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="block pb-4 pt-1 leading-[1.1]"
                >
                  The ones worth
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="block pb-4 pt-1 leading-[1.1] italic font-light text-cream/70"
                >
                  building a room around.
                </motion.span>
              </span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-2 text-sm text-cream/60 transition hover:text-cream md:inline-flex"
          >
            View all
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Full-bleed product spotlights */}
      {showcase.map((p, i) => (
        <Spotlight key={p.id} product={p} index={i} total={showcase.length} />
      ))}
    </section>
  );
}

function Spotlight({ product, index, total }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Image moves up slightly slower than the scroll → parallax
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  // Text rises into view as the section enters
  const textY = useTransform(scrollYProgress, [0, 0.5], ["40px", "0px"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const isLeft = index % 2 === 0;
  const { min, max } = getPriceRange(product);
  const hasRange = max > min;

  return (
    <div
      ref={ref}
      className="relative grid min-h-[80vh] grid-cols-1 items-center gap-8 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24"
    >
      {/* Image — TiltCard + ScrollVelocityBlur + parallax */}
      <motion.div
        style={{ y: imgY }}
        className={`${isLeft ? "md:order-1" : "md:order-2"}`}
      >
        <TiltCard max={6} className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            <ScrollVelocityBlur maxBlur={5}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </ScrollVelocityBlur>
            {/* Subtle gradient for text legibility on the image edge */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </Link>
        </TiltCard>
      </motion.div>

      {/* Text block — masked product-name reveal (descender-safe) */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className={`flex flex-col gap-5 ${isLeft ? "md:order-2" : "md:order-1"}`}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-gold">
          0{index + 1} / 0{total}
        </span>
        <h3 className="font-display text-display font-medium text-cream md:text-huge">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="block pb-4 pt-1 leading-[1.15]"
            >
              {product.name}
            </motion.span>
          </span>
        </h3>
        <p className="max-w-md text-base leading-relaxed text-cream/60">
          {product.description || "Gallery-grade print, built to outlast trends."}
        </p>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl text-gold">
            {hasRange ? `${formatPKR(min)}` : formatPKR(product.price)}
          </span>
          {hasRange && (
            <span className="text-sm text-cream/50">— from a range</span>
          )}
          {product.compareAt && (
            <span className="text-sm text-cream/40 line-through">
              {formatPKR(product.compareAt)}
            </span>
          )}
        </div>
        <MagneticButton
          href={`/product/${product.slug}`}
          strength={0.3}
          className="group mt-2 inline-flex w-fit items-center gap-3 rounded-full border border-cream/20 px-6 py-3 text-sm font-medium text-cream transition hover:border-gold hover:bg-gold hover:text-ink"
        >
          View piece
          <ArrowUpRight
            size={14}
            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </MagneticButton>
      </motion.div>
    </div>
  );
}