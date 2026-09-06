"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch (e) {
      // localStorage unavailable — theme just won't persist across visits
    }
  }

  // Avoid a mismatched icon flash before we know the real theme client-side
  if (!mounted) {
    return <span className="inline-flex h-9 w-9 rounded-full" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cream/80 transition hover:bg-white/10"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
