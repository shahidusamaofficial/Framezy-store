"use client";

/**
 * CitiesMarquee — a slow-scrolling list of Pakistani cities,
 * separated by a gold star. Sits as a thin band between sections
 * to reinforce "we deliver across Pakistan" without being preachy.
 *
 * Pure CSS marquee (animate-marquee is defined in globals.css).
 * Pauses on hover.
 */
const cities = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Abbottabad",
];

export default function CitiesMarquee() {
  return (
    <section className="relative border-y border-cream/5 bg-ink py-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...cities, ...cities].map((city, i) => (
          <span key={i} className="flex items-center gap-6 px-6">
            <span className="font-display text-2xl text-cream/40 transition-colors hover:text-cream md:text-3xl">
              {city}
            </span>
            <span className="text-gold text-sm">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}