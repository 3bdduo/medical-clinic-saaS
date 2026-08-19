/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://multi-tenant-saas-ten.vercel.app/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
