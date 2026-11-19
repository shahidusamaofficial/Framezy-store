import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import HomeCTA from "@/components/HomeCTA";
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
          { v: "4 sizes", l: "A4 - A2" },
          { v: "Rs. 1,850+", l: "Starting price" },
          { v: "5-7 days", l: "Delivery in PK" },
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
          {["Cash on Delivery","JazzCash - Easypaisa","WhatsApp ordering","Ships from Lahore","Secure packaging"].map((t) => (
            <span key={t} className="rounded-full border border-cream/10 px-4 py-2 text-xs text-cream/60">{t}</span>
          ))}
        </div>
      </section>

      <HomeCTA />
    </main>
  );
}
