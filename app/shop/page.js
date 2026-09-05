import ShopPageClient from "@/components/ShopPageClient";

export const metadata = {
  title: "Shop All Frames",
  description:
    "Browse The Wall Edit's full catalog of wall frames and canvas art — Islamic, abstract, typography, floral, animal, kids, multi-panel sets, and custom frames.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
