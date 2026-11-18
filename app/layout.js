import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import CartToast from "@/components/CartToast";
import { GoogleAnalytics } from "@next/third-parties/google";
import SiteStructuredData from "@/components/SiteStructuredData";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Wall Frames & Canvas Art, Pakistan`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, title: `${SITE_NAME} — Wall Frames & Canvas Art, Pakistan`, description: SITE_DESCRIPTION, url: SITE_URL },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-ink text-cream antialiased" suppressHydrationWarning>
        <SiteStructuredData />
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