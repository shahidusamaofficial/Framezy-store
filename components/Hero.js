"use client";

import { motion, useScroll, useTransform, useReducedMotion, useVelocity, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import AmbientParticles from "./AmbientParticles";

/**
 * Cinematic hero — VIDEO BACKGROUND edition:
 *  - Full-viewport autoplay video (muted + looped, the only way
 *    browsers allow background video)
 *  - Heavy gradient scrims so headline stays readable
 *  - Poster image fallback while video loads
 *  - Mobile shows the static image instead (background video on
 *    phones eats data and stutters — bad UX)
 *  - Letter-by-letter headline reveal, magnetic CTA, scroll parallax
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Detect mobile on mount — used to decide whether to render the
  // <video> element at all (saves bandwidth + avoids mobile stutter)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Try to play the video as soon as it's ready. Some browsers need
  // an explicit play() call even with autoPlay attribute.
  useEffect(() => {
    if (isMobile || prefersReduced) return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.play().catch(() => {
        // Autoplay was blocked — fall back to poster image,
        // which is already showing. No action needed.
      });
    };
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, [isMobile, prefersReduced]);

  const { scrollYProgress, scrollY } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 0.85], ["0%", "-20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const line1 = "Walls that feel";
  const wordYou = "you";

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.025, delayChildren: 0.3 } },
  };
  const letterRise = {
    hidden: { opacity: 0, y: 60, filter: "blur(12px)", rotate: 8 },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      rotate: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const blockRise = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const renderLetters = (str, keyPrefix) =>
    str.split("").map((ch, i) => (
      <motion.span
        key={`${keyPrefix}-${i}`}
        variants={letterRise}
        className="inline-block"
        style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
      >
        {ch}
      </motion.span>
    ));

  return (
    <section
      ref={sectionRef}
      className="hero-photo-scope relative h-screen min-h-[640px] w-full overflow-hidden"
    >
      {/* Background layer — video on desktop, image on mobile */}
      <motion.div
        style={{
          y: prefersReduced ? 0 : bgY,
          scale: prefersReduced ? 1 : bgScale,
        }}
        className="absolute inset-0 -z-10"
      >
        {/* Always render the image as the base layer — it's the
            poster while the video loads, and the fallback on mobile
            or if the video fails to play. */}
        <Image
          src="/brand/hero-photo.webp"
          alt="A hand hanging a framed print on a warmly lit gallery wall at golden hour"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        {/* Video layer — desktop only, sits on top of the image.
            Muted + loop + autoPlay + playsInline = the only combo
            that browsers will actually autoplay. preload="metadata"
            so we don't download the whole thing until needed. */}
        {!isMobile && !prefersReduced && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoLoaded(true)}
            onError={() => setVideoLoaded(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            <source src="/Sunlight_illuminating_living_room_20260926080031.mp4" type="video/mp4" />
          </video>
        )}

        {/* Gradient scrims for text legibility — heavier than the
            static-image version because video has more visual noise. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-ink/50" />
      </motion.div>

      {/* Ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/4 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[140px] animate-orb-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[28rem] w-[28rem] rounded-full bg-clay/10 blur-[140px] animate-orb-drift"
        style={{ animationDelay: "-11s" }}
      />

      {/* Floating gold particles */}
      <AmbientParticles />

      {/* Content block — bottom-left cinema lower-third */}
      <motion.div
        style={{
          y: prefersReduced ? 0 : contentY,
          opacity: prefersReduced ? 1 : contentOpacity,
        }}
        variants={container}
        initial="hidden"
        animate="show"
        className="absolute bottom-[12%] left-0 right-0 z-10 mx-auto max-w-7xl px-5 md:px-8"
      >
        <motion.div variants={blockRise} className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-gold" />
          <span className="text-xs uppercase tracking-[0.35em] text-gold">
            Pakistan&apos;s frame drop of the season
          </span>
        </motion.div>

                                <h1 className="font-display text-massive font-medium text-cream">
          <span className="block overflow-hidden">
            <span className="block pb-6 pt-2 leading-[1.05]">
              {renderLetters(line1, "l1")}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="block pb-6 pt-2 leading-[1.05]">
              <span className="italic font-light">{renderLetters("like", "l2")}</span>{" "}
              <span className="text-gradient-gold gradient-animate">
                {renderLetters(wordYou, "you")}
              </span>
              <span className="text-gold">.</span>
            </span>
          </span>
        </h1>

        <motion.div
          variants={blockRise}
          className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-base leading-relaxed text-cream/70 md:text-lg">
            Retro tones, gallery-grade prints, and frames built to survive
            monsoon humidity. Amazing quality, honest prices, delivered
            anywhere in Pakistan.
          </p>
          <MagneticButton
            href="/shop"
            strength={0.4}
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-ink transition hover:bg-gold hover:text-ink"
          >
            Shop the Collection
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 transition group-hover:translate-x-1">
              <ArrowDown size={12} className="rotate-[-45deg]" />
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40">
            Scroll
          </span>
          <span className="relative flex h-10 w-5 justify-center rounded-full border border-cream/20">
            <motion.span
              animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="mt-1.5 h-1.5 w-1 rounded-full bg-gold"
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}