import Link from "next/link";
import { SITE_URL } from "@/lib/site-config";

// items: [{ name, href }] — the last item is treated as the current page
// (rendered as plain text, not a link).
export default function Breadcrumbs({ items }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href || ""}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-cream/50">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={item.name}>
              {isLast || !item.href ? (
                <span className="text-cream/70">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-gold">
                  {item.name}
                </Link>
              )}
              {!isLast && <span className="mx-2">/</span>}
            </span>
          );
        })}
      </nav>
    </>
  );
}
