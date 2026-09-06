import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import RoomGrid from "@/components/RoomGrid";
import ProductGrid from "@/components/ProductGrid";
import BundleSection from "@/components/BundleSection";
import Testimonials from "@/components/Testimonials";
import { getCategories, getProducts, getBundles } from "@/lib/catalog";
import { rooms } from "@/lib/products";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const revalidate = 60; // re-check Supabase for new products every 60s

export const metadata = {
  title: `${SITE_NAME} — Wall Frames & Canvas Art, Pakistan`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [categories, products, bundles] = await Promise.all([
    getCategories(),
    getProducts(),
    getBundles(),
  ]);
  const bestsellers = products.slice(0, 8);

  return (
    <main>
      <Hero />
      <ProductGrid
        eyebrow="2026 Most Sellings"
        title="Bestselling Frames"
        subtitle="The pieces our customers keep re-ordering for friends and family."
        products={bestsellers}
      />
      <CategoryGrid categories={categories} />
      <RoomGrid rooms={rooms} />
      <BundleSection bundles={bundles} products={products} />
      <Testimonials />
    </main>
  );
}
