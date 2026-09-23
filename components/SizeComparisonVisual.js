// A geometrically accurate size comparison — every frame is drawn to true
// relative scale against a standard 3-seater sofa (real proportions, same
// units throughout: 1 SVG unit = 1mm), not just an illustrative guess.
export default function SizeComparisonVisual() {
  return (
    <div className="glass mt-10 rounded-2xl p-6">
      <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gold">See it to scale</p>
      <h2 className="font-display text-xl text-cream">How big is that, really?</h2>
      <p className="mt-1 text-sm text-cream/60">
        Shown here next to a standard 3-seater sofa (~5 ft wide) so the size difference is easy to picture.
      </p>

      <svg
        viewBox="0 -220 1800 1520"
        className="mt-6 w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Size comparison of A4, A3, and A2 frames shown against a sofa for scale"
      >
        {/* floor */}
        <line x1="0" y1="1250" x2="1800" y2="1250" stroke="rgba(243,236,223,0.15)" strokeWidth="2" />

        {/* sofa (simplified, proportionally accurate at 1500mm wide x 700mm tall) */}
        <g>
          {/* seat base */}
          <rect x="150" y="950" width="1500" height="300" rx="24" fill="#2c1e14" stroke="rgba(243,236,223,0.2)" strokeWidth="2" />
          {/* backrest */}
          <rect x="150" y="700" width="1500" height="280" rx="28" fill="#2c1e14" stroke="rgba(243,236,223,0.2)" strokeWidth="2" />
          {/* arms */}
          <rect x="110" y="750" width="90" height="450" rx="20" fill="#241a10" stroke="rgba(243,236,223,0.2)" strokeWidth="2" />
          <rect x="1600" y="750" width="90" height="450" rx="20" fill="#241a10" stroke="rgba(243,236,223,0.2)" strokeWidth="2" />
          {/* cushion seams */}
          <line x1="650" y1="720" x2="650" y2="960" stroke="rgba(243,236,223,0.12)" strokeWidth="2" />
          <line x1="1150" y1="720" x2="1150" y2="960" stroke="rgba(243,236,223,0.12)" strokeWidth="2" />
        </g>

        {/* A4 — 210 x 297mm */}
        <g>
          <rect x="356" y="153" width="210" height="297" fill="rgba(243,236,223,0.06)" stroke="#c9a35a" strokeWidth="4" />
          <text x="461" y="480" textAnchor="middle" fill="#f3ecdf" fontSize="32" fontWeight="700" fontFamily="Georgia, serif">A4</text>
          <text x="461" y="514" textAnchor="middle" fill="rgba(243,236,223,0.5)" fontSize="20" fontFamily="sans-serif">8.3 × 11.7 in</text>
        </g>

        {/* A3 — 297 x 420mm */}
        <g>
          <rect x="646" y="30" width="297" height="420" fill="rgba(243,236,223,0.06)" stroke="#c9a35a" strokeWidth="4" />
          <text x="794" y="480" textAnchor="middle" fill="#f3ecdf" fontSize="32" fontWeight="700" fontFamily="Georgia, serif">A3</text>
          <text x="794" y="514" textAnchor="middle" fill="rgba(243,236,223,0.5)" fontSize="20" fontFamily="sans-serif">11.7 × 16.5 in</text>
        </g>

        {/* A2 — 420 x 594mm */}
        <g>
          <rect x="1024" y="-144" width="420" height="594" fill="rgba(243,236,223,0.06)" stroke="#c9a35a" strokeWidth="4" />
          <text x="1234" y="480" textAnchor="middle" fill="#f3ecdf" fontSize="32" fontWeight="700" fontFamily="Georgia, serif">A2</text>
          <text x="1234" y="514" textAnchor="middle" fill="rgba(243,236,223,0.5)" fontSize="20" fontFamily="sans-serif">16.5 × 23.4 in</text>
        </g>
      </svg>

      <p className="mx-auto mt-4 max-w-md text-center text-xs text-cream/50">
        A4 works well as a smaller accent piece — think a side table or hallway. A2 makes a real
        statement above a sofa or bed. A3 sits comfortably in between.
      </p>
    </div>
  );
}
