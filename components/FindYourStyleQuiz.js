"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const QUESTIONS = [
  {
    key: "vibe1",
    question: "What's the vibe you're going for?",
    options: [
      { label: "Calm & Spiritual", emoji: "🕌", category: "islamic" },
      { label: "Bold & Abstract", emoji: "🎨", category: "abstract" },
      { label: "Words & Quotes", emoji: "✍️", category: "typography" },
      { label: "Soft & Botanical", emoji: "🌿", category: "floral" },
    ],
  },
  {
    key: "room",
    question: "Which room are we styling?",
    options: [
      { label: "Living Room", emoji: "🛋️", room: "living-room" },
      { label: "Bedroom", emoji: "🛏️", room: "bedroom" },
      { label: "Kids' Room", emoji: "🧸", room: "kids-room" },
      { label: "Office", emoji: "🖥️", room: "office" },
    ],
  },
  {
    key: "vibe2",
    question: "Pick a mood",
    options: [
      { label: "Warm & Golden", emoji: "🌅", category: "abstract" },
      { label: "Untamed & Wild", emoji: "🐎", category: "animal" },
      { label: "Soft & Feminine", emoji: "🌸", category: "girlish" },
      { label: "Playful & Fun", emoji: "🎈", category: "kids" },
    ],
  },
  {
    key: "scale",
    question: "How much wall are we filling?",
    options: [
      { label: "Just one accent piece", emoji: "🖼️", panels: "single" },
      { label: "A full gallery moment", emoji: "🖼️🖼️🖼️", panels: "multi" },
    ],
  },
];

const PERSONAS = {
  islamic: {
    name: "The Grounded Soul",
    description: "You gravitate toward pieces that bring calm and meaning into a room — art that feels less like decoration and more like a quiet anchor.",
  },
  abstract: {
    name: "The Bold Visionary",
    description: "You're drawn to shape, color, and confidence. Your walls are never an afterthought — they're where the room's personality actually lives.",
  },
  typography: {
    name: "The Modern Wordsmith",
    description: "You love a room that says something — literally. Clean type, a strong line, a phrase that means something to you.",
  },
  floral: {
    name: "The Botanical Romantic",
    description: "Soft, warm, a little nostalgic. You want a space that feels alive and gently lived-in, never stark.",
  },
  animal: {
    name: "The Untamed Spirit",
    description: "Editorial, a little unexpected, unmistakably a statement. You don't decorate quietly.",
  },
  girlish: {
    name: "The Soft Dreamer",
    description: "Gentle palettes, feminine lines, a room that feels like a soft exhale at the end of the day.",
  },
  kids: {
    name: "The Playful Heart",
    description: "Bright, joyful, a little silly in the best way — art that makes a room feel like it belongs to someone growing up happy.",
  },
};

export default function FindYourStyleQuiz({ allProducts }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const current = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  function selectAnswer(option) {
    const newAnswers = { ...answers, [current.key]: option };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  }

  function retake() {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  }

  // ---- scoring ----
  const categoryVotes = {};
  [answers.vibe1, answers.vibe2].forEach((a) => {
    if (a?.category) categoryVotes[a.category] = (categoryVotes[a.category] || 0) + 1;
  });
  const topCategory =
    Object.keys(categoryVotes).sort((a, b) => categoryVotes[b] - categoryVotes[a])[0] || "abstract";
  const persona = PERSONAS[topCategory];
  const roomFilter = answers.room?.room;
  const wantsMulti = answers.scale?.panels === "multi";

  let recommendations = allProducts.filter((p) =>
    (p.categories?.length > 0 ? p.categories : [p.category]).includes(topCategory)
  );
  if (roomFilter) {
    const roomMatch = recommendations.filter((p) => (p.rooms?.length > 0 ? p.rooms : [p.room]).includes(roomFilter));
    if (roomMatch.length >= 2) recommendations = roomMatch;
  }
  const panelMatch = recommendations.filter((p) => (wantsMulti ? p.panels > 1 : p.panels === 1));
  if (panelMatch.length >= 2) recommendations = panelMatch;
  recommendations = recommendations.slice(0, 4);

  if (recommendations.length === 0) {
    recommendations = allProducts.slice(0, 4);
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div key="quiz" exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-xl text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Find Your Style</p>
            <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <h1 className="font-display text-2xl text-cream md:text-3xl">{current.question}</h1>

                <div
                  className={`mt-8 grid gap-3 ${
                    current.options.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"
                  }`}
                >
                  {current.options.map((opt) => (
                    <motion.button
                      key={opt.label}
                      onClick={() => selectAnswer(opt)}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      className="glass flex flex-col items-center gap-2 rounded-2xl border border-white/10 px-4 py-7 text-center transition hover:border-gold/50"
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className="text-sm font-medium text-cream">{opt.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 text-xs text-cream/40">
              Question {step + 1} of {QUESTIONS.length}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mx-auto mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
              <Sparkles size={13} />
              Your result
            </span>
            <h1 className="font-display text-3xl text-cream md:text-5xl">{persona.name}</h1>
            <p className="mx-auto mt-4 max-w-lg text-cream/70">{persona.description}</p>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/shop?category=${topCategory}`}
                className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-cream shadow-lift transition hover:bg-rust"
              >
                Shop This Style
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <button
                onClick={retake}
                className="glass-hero inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-cream transition hover:scale-[1.02]"
              >
                <RefreshCw size={15} />
                Retake Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
