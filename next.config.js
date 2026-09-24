/** @type {import('next').NextConfig} */
const nextConfig = {
  // No source maps shipped to the browser in production — keeps bundle
  // size down and doesn't expose original source to site visitors.
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "homezdecorz.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iili.io',
        port: '',
        pathname: '/**', // Allows all paths under this domain
      },
    ],
  },
}

module.exports = nextConfig
    ],
  },
  experimental: {
    // Only ships the specific icons/components actually used from these
    // packages instead of the whole library — meaningfully smaller JS.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

module.exports = nextConfig;
