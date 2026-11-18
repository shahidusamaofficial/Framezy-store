"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const ref = useRef(null);
  const vref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const play = () => { v.play().then(() => setLoaded(true)).catch(() => {}); };
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
    // Retry on first interaction (iOS sometimes blocks autoplay)
    const retry = () => { play(); document.removeEventListener("touchend", retry); };
    document.addEventListener("touchend", retry, { once: true });
    return () => document.removeEventListener("touchend", retry);
  }, []);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image src="/brand/hero-photo.webp" alt="Gallery wall at golden hour" fill sizes="100vw" className="object-cover" priority />
        <video ref={vref} autoPlay muted loop playsInline preload="auto" onPlaying={() => setLoaded(true)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
          <source src="/Sunlight_illuminating_living_room_20260926080031.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,11,0.5), rgba(10,10,11,0.3) 40%, rgba(10,10,11,0.85))" }} />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-medium" style={{ color: "rgba(250,250,250,0.6)" }}>Pakistan's frame drop of the season</p>
        <h1 className="text-massive" style={{ color: "#fafafa" }}>Walls that <span className="font-bold">feel like you.</span></h1>
        <p className="mx-auto mt-6 max-w-xl text-lg" style={{ color: "rgba(250,250,250,0.6)" }}>Gallery-grade prints, built to survive monsoon humidity. Honest prices, delivered anywhere in Pakistan.</p>
        <div className="mt-10 flex items-center gap-4">
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition hover:scale-105" style={{ background: "#fafafa", color: "#0a0a0b" }}>Shop the Collection →</Link>
          <Link href="/shop?bundles=1" className="text-sm font-medium transition hover:opacity-80" style={{ color: "rgba(250,250,250,0.6)" }}>Browse bundles ›</Link>
        </div>
      </motion.div>
    </section>
  );
}
