import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/catalog";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: `${SITE_NAME} — Wall Frames & Canvas Art, Pakistan`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default async function Home() {
  const products = await getProducts();
  const bestsellers = products.slice(0, 8);

  return (
    <main>
      <Hero />

      <div className="flex justify-center gap-12 border-y border-cream/5 py-8">
        {[
          { v: "4 sizes", l: "A4 → A1" },
          { v: "Rs. 1,850+", l: "Starting price" },
          { v: "5–7 days", l: "Delivery in PK" },
          { v: "COD", l: "Available" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-lg font-semibold">{s.v}</div>
            <div className="mt-1 text-xs text-cream/40">{s.l}</div>
          </div>
        ))}
      </div>

      <ProductGrid
        eyebrow="Featured pieces"
        title="The ones worth building a room around."
        products={bestsellers}
      />

      <section className="border-y border-cream/5 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {["Cash on Delivery","JazzCash · Easypaisa","WhatsApp ordering","Ships from Lahore","Secure packaging"].map((t) => (
            <span key={t} className="rounded-full border border-cream/10 px-4 py-2 text-xs text-cream/60">{t}</span>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-b border-cream/5 py-6">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
          {[...Array(2)].map((_, i) =>
            ["Lahore","Karachi","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"].map((c) => (
              <span key={c + i} className="text-lg font-medium text-cream/20">{c} <span className="text-cream/30">·</span></span>
            ))
          )}
        </div>
      </section>

      <section className="px-6 py-32 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="text-huge font-semibold">Get 10% off your first piece.</h2>
          <p className="mt-4 text-cream/50">Drop your email and we'll send a code you can use today.</p>
          <form className="mt-8 flex justify-center gap-2" action="/api/subscribe" method="POST">
            <input type="email" name="email" placeholder="you@example.com" required className="rounded-full border border-cream/15 bg-transparent px-5 py-3 text-sm outline-none focus:border-cream/40" />
            <button type="submit" className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition hover:opacity-90">Get my code →</button>
          </form>
        </div>
      </section>
    </main>
  );
}
