import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getProductReviews } from "@/lib/catalog";
import ProductGallery from "@/components/ProductGallery";
import ProductDetailPurchase from "@/components/ProductDetailPurchase";
import TrustBadges from "@/components/TrustBadges";
import ProductAccordion from "@/components/ProductAccordion";
import ProductGrid from "@/components/ProductGrid";
import ProductReviews from "@/components/ProductReviews";
import RoomPreviewButton from "@/components/RoomPreviewButton";
import SizeComparisonVisual from "@/components/SizeComparisonVisual";
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
  const reviews = await getProductReviews(product.slug);
  const productCategories = product.categories?.length > 0 ? product.categories : [product.category];
  const related = allProducts
    .filter(
      (p) =>
        p.slug !== product.slug &&
        (p.categories?.length > 0 ? p.categories : [p.category]).some((c) => productCategories.includes(c))
    )
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
    <main className="bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-5 pt-6 md:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            { name: product.name },
          ]}
        />
      </div>

      {/* Hero section — gallery + buy box */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 lg:gap-20">
          {/* Gallery */}
          <div className="md:sticky md:top-24 md:self-start">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Buy box */}
          <div className="flex flex-col gap-8">
            <ProductDetailPurchase product={product} />
            <RoomPreviewButton product={product} overlayImage={product.images?.[product.images.length - 1] || product.image} />
            <TrustBadges />
          </div>
        </div>
      </section>

      {/* Accordion — details, features, shipping, FAQ */}
      <section className="border-t border-cream/5">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <ProductAccordion product={product} />
        </div>
      </section>

      {/* Size comparison */}
      {product.sizePrices && (
        <section className="border-t border-cream/5">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <SizeComparisonVisual />
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="border-t border-cream/5">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <ProductReviews
            slug={product.slug}
            reviews={reviews}
            averageRating={product.rating}
            reviewCount={product.reviews}
          />
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-cream/5">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <ProductGrid
              eyebrow="You might also like"
              title="More in this category"
              products={related}
            />
          </div>
        </section>
      )}
    </main>
  );
}
