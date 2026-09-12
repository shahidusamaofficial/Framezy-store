import { notFound } from "next/navigation";
import { getBundleBySlug, getProducts } from "@/lib/catalog";
import ProductGallery from "@/components/ProductGallery";
import BundleDetailPurchase from "@/components/BundleDetailPurchase";
import TrustBadges from "@/components/TrustBadges";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const bundle = await getBundleBySlug(params.slug);
  if (!bundle) {
    return { title: "Bundle Not Found", robots: { index: false } };
  }
  return {
    title: bundle.name,
    description: bundle.description,
    alternates: { canonical: `/bundle/${bundle.slug}` },
    openGraph: {
      title: bundle.name,
      description: bundle.description,
      url: `${SITE_URL}/bundle/${bundle.slug}`,
      images: [{ url: bundle.image, width: 800, height: 800, alt: bundle.name }],
    },
  };
}

export default async function BundlePage({ params }) {
  const bundle = await getBundleBySlug(params.slug);
  if (!bundle) notFound();

  const allProducts = await getProducts();
  const pieces = (bundle.productIds || [])
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: bundle.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery images={[bundle.image]} name={bundle.name} />

        <div className="flex flex-col gap-8">
          <BundleDetailPurchase bundle={bundle} pieces={pieces} />
          <TrustBadges />
        </div>
      </div>
    </main>
  );
}
