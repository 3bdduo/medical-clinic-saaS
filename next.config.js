/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
};

module.exports = nextConfig;
