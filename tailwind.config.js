/** @type {import('tailwindcss').Config} */
function withOpacity(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${varName}) / ${opacityValue})`;
    }
    return `rgb(var(${varName}))`;
  };
}

module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--c-ink"),
        cream: withOpacity("--c-cream"),
        clay: withOpacity("--c-clay"),
        rust: withOpacity("--c-rust"),
        moss: withOpacity("--c-moss"),
        gold: withOpacity("--c-gold"),
        butter: withOpacity("--c-butter"),
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
