import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  images: {
    formats: ["image/avif", "image/webp"]
  },
  poweredByHeader: false,
  compress: true
};

export default nextConfig;
