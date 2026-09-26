/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    // Disable Next.js image optimization — Vercel's optimizer is failing
    // on hot-linked Shopify CDN URLs. With unoptimized: true, images
    // load directly from the source URL like a regular <img>.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "homezdecorz.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "iili.io", port: "", pathname: "/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

module.exports = nextConfig;
