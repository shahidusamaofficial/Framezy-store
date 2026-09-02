/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B120C",
        cream: "#F4EBDD",
        clay: "#C1552C",
        rust: "#9A3B23",
        moss: "#4B5A3E",
        gold: "#C9A34E",
        butter: "#F0D9A8",
        glass: "rgba(244, 235, 221, 0.12)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(27, 18, 12, 0.35)",
        lift: "0 20px 60px rgba(27, 18, 12, 0.45)",
      },
      backgroundImage: {
        grain: "url('/grain.svg')",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-14px) rotate(1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        marquee: "marquee 26s linear infinite",
        floatSlow: "floatSlow 7s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
