"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/**
 * CategoryGallery — clean version, no TiltCard wrapper.
 */
const displayImages = {
  islamic: "https://homezdecorz.com/cdn/shop/collections/HD-610-BASMALA-CALLIGRAPHY-WALL-HANGING-_-ISLAMIC-WALL-ART.png?width=600",
  abstract: "https://homezdecorz.com/cdn/shop/files/ChatGPT_Image_Aug_12_2026_04_54_31_PM.png?width=600",
  typography: "https://homezdecorz.com/cdn/shop/collections/il_1588xN.7289646611_olmk.jpg?width=600",
  floral: "https://homezdecorz.com/cdn/shop/collections/HD-549-Luxury-Golden-Leaves-Art-_-3-Panel-Set_512868cf-5fde-47c9-a2d8-6f42a113c6b7.png?width=600",
  animal: "https://homezdecorz.com/cdn/shop/files/g1.webp?width=600",
  girlish: "https://homezdecorz.com/cdn/shop/collections/ABSTRACT-MOON-GIRL-ART-HD-723_c7a45e39-335c-4fd8-ac1e-c166d4191a7d.jpg?width=600",
  kids: "https://homezdecorz.com/cdn/shop/files/FOUR_QUKS_1800x1800_616aea7f-d338-4a0f-8ae7-fabd145a7bca.jpg?width=600",
  "panel-sets": "https://homezdecorz.com/cdn/shop/files/4003A7A0-0F74-491D-9D6B-E202BAF4A906.jpg?width=600",
  custom: "https://homezdecorz.com/cdn/shop/files/Gemini_Generated_Image_cy15r6cy15r6cy15_1.png?width=600",
};

const displayAlt = {
  islamic: "Gold Basmala Islamic calligraphy wall art in a framed print",
  abstract: "Warm-toned modern abstract geometric canvas print on a living room wall",
  typography: "Bold typography quote print framed for a minimal accent wall",
  floral: "Golden leaf botanical line art in a framed multi-panel set",
  animal: "Mid-century retro animal and equestrian wall art print",
  girlish: "Soft illustrative art print for a bedroom or vanity wall",
  kids: "Colorful Four Quls Islamic print for a children's room",
  "panel-sets": "Multi-panel gallery wall set arranged above a sofa",
  custom: "Custom Nikkah frame with personalized names and date",
};

export default function CategoryGallery({ categories = [] }) {
  if (categories.length === 0) return null;
  const featured = categories[0];
  const rest = categories.slice(1, 7);

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold">
                Browse by mood
              </span>
            </div>
            <h2 className="font-display text-huge font-medium text-cream">
              Find your
              <br />
              <span className="italic font-light text-cream/70">category.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-cream/60 transition hover:text-cream"
          >
            View all categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:[grid-auto-flow:dense]">
          <CategoryTile
            slug={featured.slug}
            name={featured.name}
            blurb={featured.blurb}
            src={displayImages[featured.slug]}
            alt={displayAlt[featured.slug]}
            className="col-span-2 md:row-span-2 aspect-square md:aspect-auto"
            featured
            delay={0}
          />
          {rest.map((c, i) => (
            <CategoryTile
              key={c.slug}
              slug={c.slug}
              name={c.name}
              blurb={c.blurb}
              src={displayImages[c.slug]}
              alt={displayAlt[c.slug]}
              className="aspect-[3/4]"
              delay={(i + 1) * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ slug, name, blurb, src, alt, className = "", featured = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-xl ${className}`}
    >
      {/* Link is the positioned ancestor for the Image fill */}
      <Link href={`/shop?category=${slug}`} className="block h-full w-full">
        <Image
          src={src}
          alt={alt || `${name} wall art`}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-gold/0 transition-colors duration-500 group-hover:border-gold/40" />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <p className={`font-display text-cream ${featured ? "text-3xl md:text-4xl" : "text-lg md:text-xl"}`}>
            {name}
          </p>
          <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 group-hover:grid-rows-[1fr]">
            <div className="min-h-0">
              <p className="mt-1 text-xs text-cream/70">{blurb}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-gold">
                Explore →
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
