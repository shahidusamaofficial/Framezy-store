import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import ProductGallery from "@/components/ProductGallery";
import ProductDetailPurchase from "@/components/ProductDetailPurchase";
import TrustBadges from "@/components/TrustBadges";
import ProductAccordion from "@/components/ProductAccordion";
import ProductGrid from "@/components/ProductGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found", robots: { index: false } };
  }
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${SITE_URL}/product/${product.slug}`,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.slug,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews,
      },
    }),
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-8">
          <ProductDetailPurchase product={product} />
          <TrustBadges />
        </div>
      </div>

      <ProductAccordion product={product} />

      {related.length > 0 && (
        <div className="-mx-5 mt-8 md:-mx-8">
          <ProductGrid eyebrow="You might also like" title="More in this category" products={related} />
        </div>
      )}
    </main>
  );
}
