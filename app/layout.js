import { Playfair_Display, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import SiteStructuredData from "@/components/SiteStructuredData";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

// Deferred: the cart drawer (and its framer-motion dependency) is hidden by
// default, so there's no reason to ship its JS in the initial page load.
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });

// Playfair Display: the definitive editorial/luxury serif — pairs with
// Manrope, a warm geometric sans, for a considered, boutique feel rather
// than a generic default pairing.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Wall Frames & Canvas Art, Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Wall Frames & Canvas Art, Pakistan`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Wall Frames & Canvas Art, Pakistan`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="bg-ink text-cream antialiased">
        <SiteStructuredData />
        <div className="grain-overlay" aria-hidden="true" />
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
          <WhatsAppFloatingButton />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
