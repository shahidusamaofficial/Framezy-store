// Central place for site-wide identity used across metadata, sitemap,
// robots.txt, and structured data. Update NEXT_PUBLIC_SITE_URL once you
// have a real domain — everything else (canonical URLs, sitemap entries,
// Open Graph URLs) derives from this one value.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://the-wall-edit.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "The Wall Edit";
export const SITE_DESCRIPTION =
  "Premium wall frames and canvas art delivered across Pakistan. Amazing quality, honest prices, Cash on Delivery.";

// Optional real business details for LocalBusiness structured data. Left
// unset by default — we don't fabricate an address or phone number for you.
// Fill these in via .env.local / your Vercel env vars once you have real
// details, and the LocalBusiness schema will start rendering automatically.
export const BUSINESS = {
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || null,
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "hello@thewalledit.pk",
  streetAddress: process.env.NEXT_PUBLIC_BUSINESS_STREET || null,
  city: process.env.NEXT_PUBLIC_BUSINESS_CITY || null,
  region: process.env.NEXT_PUBLIC_BUSINESS_REGION || null,
  postalCode: process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE || null,
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || null,
};

export function hasAddress() {
  return Boolean(BUSINESS.streetAddress && BUSINESS.city);
}
