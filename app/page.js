import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import BundleSection from "@/components/BundleSection";
import Testimonials from "@/components/Testimonials";
import { categories, products, bundles } from "@/lib/products";

export default function Home() {
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
      <BundleSection bundles={bundles} />
      <Testimonials />
    </main>
  );
}
