import { getProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site-config";

export default async function sitemap() {
  const products = await getProducts();

  const staticRoutes = [
    { url: "/", priority: 1.0, changeFrequency: "daily" },
    { url: "/shop", priority: 0.9, changeFrequency: "daily" },
    { url: "/about", priority: 0.6, changeFrequency: "monthly" },
    { url: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { url: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { url: "/shipping-policy", priority: 0.4, changeFrequency: "yearly" },
    { url: "/return-exchange-policy", priority: 0.4, changeFrequency: "yearly" },
    { url: "/cancellation-policy", priority: 0.4, changeFrequency: "yearly" },
  ].map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
