import { SITE_URL, SITE_NAME, BUSINESS, hasAddress } from "@/lib/site-config";

export default function SiteStructuredData() {
  const sameAs = [BUSINESS.facebook, BUSINESS.instagram, BUSINESS.tiktok].filter(Boolean);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    ...(sameAs.length > 0 && { sameAs }),
    ...(BUSINESS.email && {
      contactPoint: {
        "@type": "ContactPoint",
        email: BUSINESS.email,
        ...(BUSINESS.phone && { telephone: BUSINESS.phone }),
        contactType: "customer service",
        areaServed: "PK",
      },
    }),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Only rendered once you've actually provided a real street address via
  // env vars — publishing a placeholder address as structured data would be
  // misleading to search engines and customers, so we skip it by default.
  const localBusiness = hasAddress()
    ? {
        "@context": "https://schema.org",
        "@type": "Store",
        name: SITE_NAME,
        url: SITE_URL,
        image: `${SITE_URL}/icon.png`,
        ...(BUSINESS.phone && { telephone: BUSINESS.phone }),
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.streetAddress,
          addressLocality: BUSINESS.city,
          addressRegion: BUSINESS.region || undefined,
          postalCode: BUSINESS.postalCode || undefined,
          addressCountry: "PK",
        },
      }
    : null;

  const payloads = [organization, website, localBusiness].filter(Boolean);

  return (
    <>
      {payloads.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
