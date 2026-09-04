"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasMultiple = images.length > 1;

  function next() {
    setActive((i) => (i + 1) % images.length);
  }
  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div>
      <button
        onClick={() => setLightboxOpen(true)}
        className="glass group relative block aspect-square w-full overflow-hidden rounded-[1.75rem] p-2"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.4rem]">
          <Image
            src={images[active]}
            alt={name}
            fill
            sizes="(max-width: 768px) 90vw, 480px"
            className="object-cover"
            priority
          />
          <span className="glass absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-cream opacity-0 transition group-hover:opacity-100">
            <ZoomIn size={13} /> Zoom
          </span>
        </div>
      </button>

      {hasMultiple && (
        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-20 ${
                active === i ? "border-gold" : "border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-ink/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
            />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-10">
              <motion.div
                className="relative aspect-square w-full max-w-2xl"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", damping: 26, stiffness: 300 }}
              >
                <Image
                  src={images[active]}
                  alt={name}
                  fill
                  sizes="90vw"
                  className="rounded-2xl object-contain"
                />
                <button
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close"
                  className="absolute -top-3 -right-3 rounded-full bg-ink p-2 text-cream shadow-lift"
                >
                  <X size={18} />
                </button>
                {hasMultiple && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-2 text-cream backdrop-blur-sm hover:bg-ink/80"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-2 text-cream backdrop-blur-sm hover:bg-ink/80"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
