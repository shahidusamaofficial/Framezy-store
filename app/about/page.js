import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "About Us",
  description:
    "Framezy makes gallery-grade wall frames and canvas art in Pakistan — fade-resistant prints, wood-backed frames, and honest pricing with Cash on Delivery.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About Us" }]} />
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Our story</p>
        <h1 className="font-display text-4xl leading-tight text-cream md:text-5xl">
          We think your walls deserve better than a blank space.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/70 md:text-lg">
          Framezy started with a simple frustration: good wall art in
          Pakistan was either overpriced imported decor, or flimsy prints
          that faded and warped within months. We wanted something in
          between — gallery-grade quality, without the gallery markup.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 pb-16 md:grid-cols-3 md:px-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl retro-border">
          <Image
            src="https://homezdecorz.com/cdn/shop/files/ChatGPT_Image_Aug_8_2026_09_04_57_PM.png?width=500"
            alt="Retro-styled canvas art on a living room wall"
            fill
            sizes="(max-width: 768px) 90vw, 320px"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl retro-border">
          <Image
            src="https://homezdecorz.com/cdn/shop/files/HD-549-Luxury-Golden-Leaves-Art-_-3-Panel-Set_57185400-fb43-4136-92bc-bef8ade75f31.png?width=500"
            alt="Gold leaf 3-panel canvas art set"
            fill
            sizes="(max-width: 768px) 90vw, 320px"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl retro-border">
          <Image
            src="https://homezdecorz.com/cdn/shop/files/il_794xN.7358099582_mvc4.jpg?width=500"
            alt="Modern geometric abstract canvas art"
            fill
            sizes="(max-width: 768px) 90vw, 320px"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="glass space-y-6 rounded-[1.75rem] p-6 text-sm leading-relaxed text-cream/75 md:p-10 md:text-base">
          <div>
            <h2 className="mb-2 font-display text-xl text-cream">What we believe in</h2>
            <p>
              A frame isn't just decor — it's the first thing a guest notices
              walking into your home, and the backdrop to your everyday life.
              We design every piece with that in mind: warm, retro-inspired
              tones that age well, not trend-chasing prints that look dated
              in a year.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl text-cream">How we make them</h2>
            <p>
              Every frame is printed on fade-resistant material and backed
              with sturdy wood — built to handle Pakistan's humidity and heat,
              not just look good in a studio photo. We check each piece
              before it ships, so what arrives at your door matches what you
              saw on screen.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl text-cream">Why Cash on Delivery, why honest pricing</h2>
            <p>
              We know online shopping in Pakistan runs on trust. That's why
              we offer Cash on Delivery on every order, keep our shipping
              charge transparent in your cart before checkout, and never
              inflate a "was" price just to fake a discount.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl text-cream">What's next</h2>
            <p>
              We're just getting started — new drops, more categories, and
              custom pieces built around what our customers actually ask for.
              If there's something you wish existed on your wall, tell us on
              our{" "}
              <a href="/contact" className="text-gold underline underline-offset-2">
                Contact Us
              </a>{" "}
              page. We read everything.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
