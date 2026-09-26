import { Playfair_Display, Manrope, Noto_Nastaliq_Urdu } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import CartToast from "@/components/CartToast";
import { GoogleAnalytics } from '@next/third-parties/google'
import SiteStructuredData from "@/components/SiteStructuredData";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import CustomCursor from "@/components/CustomCursor";
import IslamicPattern from "@/components/IslamicPattern";
import FestiveBanner from "@/components/FestiveBanner";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Noto Nastaliq Urdu — for the .urdu class. Loaded globally so any
// Urdu text anywhere on the site uses it automatically.
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-urdu",
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
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable} ${nastaliq.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'){document.documentElement.classList.add('light');}}catch(e){document.documentElement.classList.add('light');}})();`,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9335963334538565"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-ink text-cream antialiased">
        <SiteStructuredData />
        {/* Cultural + atmosphere overlays */}
        <IslamicPattern opacity={0.035} />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="vignette-overlay" aria-hidden="true" />
        <CustomCursor />
        <ScrollProgressBar />
        {/* Festive banner — set active={false} outside Eid/Ramadan season */}
        <FestiveBanner active={false} />
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <WhatsAppFloatingButton />
          <CartToast />
          <Analytics />
        </CartProvider>
      </body>
      <GoogleAnalytics gaId="G-W3BF3RZ4HB" />
    </html>
  );
}