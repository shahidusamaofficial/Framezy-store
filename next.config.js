/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    // Disable Next.js image optimization for external URLs — Vercel's
    // optimizer sometimes fails on hot-linked Shopify CDN URLs, causing
    // images to not show on the live site. With `unoptimized: true`,
    // images load directly from the source URL like a regular <img>.
    // Trade-off: slightly larger bandwidth, but images actually display.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "homezdecorz.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "iili.io", port: "", pathname: "/**" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

module.exports = nextConfig;
