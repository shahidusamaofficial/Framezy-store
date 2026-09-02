const reviews = [
  { name: "Rana Hammad Ali", text: "The quality genuinely surprised me — feels premium in person, not just in photos." },
  { name: "Aizal Fatima", text: "Fast shipping and the frame arrived without a single scratch. Ordering again." },
  { name: "Hira Subhan", text: "Best purchase I've made this year for my room. It looks amazing on the wall." },
  { name: "Usman Afridi", text: "Outstanding build quality — the border finish alone feels worth the price." },
  { name: "Taniya Shah", text: "Great value, and the colours matched exactly what I saw on the site." },
  { name: "Ahmed Zaheer", text: "Really impressed with the wood backing — feels sturdy, not flimsy like other frames." },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Moments shared</p>
        <h2 className="font-display text-3xl text-cream md:text-4xl">From our loyal customers</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.name} className="glass rounded-2xl p-5">
            <p className="text-sm leading-relaxed text-cream/80">"{r.text}"</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-gold/80">{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
