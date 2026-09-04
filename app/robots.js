import { SITE_URL } from "@/lib/site-config";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional pages have no unique content for search engines and
      // may contain user-specific state — kept out of the index.
      disallow: ["/checkout", "/checkout/success"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
