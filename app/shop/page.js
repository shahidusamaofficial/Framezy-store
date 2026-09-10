import ShopPageClient from "@/components/ShopPageClient";
import { getCategories, getProducts, getBundles } from "@/lib/catalog";

export const revalidate = 60;

export const metadata = {
  title: "Shop All Frames",
  description:
    "Browse The Wall Edit's full catalog of wall frames and canvas art — Islamic, abstract, typography, floral, animal, kids, multi-panel sets, and custom frames.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [categories, products, bundles] = await Promise.all([
    getCategories(),
    getProducts(),
    getBundles(),
  ]);

  return (
    <ShopPageClient
      initialCategories={categories}
      initialProducts={products}
      initialBundles={bundles}
    />
  );
}
