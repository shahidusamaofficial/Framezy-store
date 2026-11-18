"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const sectionRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.8], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background — video on desktop, image on mobile */}
      <motion.div
        style={{ y: prefersReduced ? 0 : bgY }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/brand/hero-photo.webp"
          alt="A hand hanging a framed print on a warmly lit gallery wall at golden hour"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {!isMobile && !prefersReduced && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            <source src="/Sunlight_illuminating_living_room_20260926080031.mp4" type="video/mp4" />
          </video>
        )}
        {/* Dark gradient scrims for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-ink/30" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: prefersReduced ? 0 : contentY, opacity: prefersReduced ? 1 : contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 text-sm font-medium text-cream/50"
        >
          Pakistan's frame drop of the season
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-massive"
        >
          Walls that <span className="font-bold">feel like you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-lg text-cream/60"
        >
          Gallery-grade prints, built to survive monsoon humidity. Honest prices, delivered anywhere in Pakistan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-10 flex items-center gap-4"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3 text-sm font-medium text-ink transition hover:opacity-90"
          >
            Shop the Collection
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/shop?bundles=1"
            className="text-sm font-medium text-cream/60 transition hover:text-cream"
          >
            Browse bundles ›
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
