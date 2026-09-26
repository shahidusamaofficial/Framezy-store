import Hero from "@/components/Hero";
import PakistaniTrustBar from "@/components/PakistaniTrustBar";
import Manifesto from "@/components/Manifesto";
import CitiesMarquee from "@/components/CitiesMarquee";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import CategoryGallery from "@/components/CategoryGallery";
import EditorialBundles from "@/components/EditorialBundles";
import QuoteTestimonials from "@/components/QuoteTestimonials";
import FinalCTA from "@/components/FinalCTA";
import { getCategories, getProducts, getBundles } from "@/lib/catalog";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const revalidate = 60;

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
  const featured = products.slice(0, 4);

  return (
    <main id="top">
      <Hero />
      <PakistaniTrustBar />
      <Manifesto />
      <CitiesMarquee />
      <FeaturedShowcase products={featured} />
      <CategoryGallery categories={categories} />
      <EditorialBundles bundles={bundles} products={products} />
      <QuoteTestimonials />
      <FinalCTA />
    </main>
  );
}