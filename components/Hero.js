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
      <motion.div style={{ y: prefersReduced ? 0 : bgY }} className="absolute inset-0 -z-10">
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
            autoPlay muted loop playsInline preload="metadata"
            onCanPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
            aria-hidden
          >
            <source src="/Sunlight_illuminating_living_room_20260926080031.mp4" type="video/mp4" />
          </video>
        )}
        {/* Dark overlay — always dark regardless of theme, for text legibility on video */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,11,0.5), rgba(10,10,11,0.3) 40%, rgba(10,10,11,0.85))" }} />
      </motion.div>

      {/* Content — always light text on the video */}
      <motion.div
        style={{ y: prefersReduced ? 0 : contentY, opacity: prefersReduced ? 1 : contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 text-sm font-medium"
          style={{ color: "rgba(250,250,250,0.6)" }}
        >
          Pakistan's frame drop of the season
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-massive"
          style={{ color: "#fafafa" }}
        >
          Walls that <span className="font-bold">feel like you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-lg"
          style={{ color: "rgba(250,250,250,0.6)" }}
        >
          Gallery-grade prints, built to survive monsoon humidity. Honest prices, delivered anywhere in Pakistan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-10 flex items-center gap-4"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition hover:scale-[1.02]"
            style={{ background: "#fafafa", color: "#0a0a0b" }}
          >
            Shop the Collection
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/shop?bundles=1"
            className="text-sm font-medium transition hover:opacity-80"
            style={{ color: "rgba(250,250,250,0.6)" }}
          >
            Browse bundles ›
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
