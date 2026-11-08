import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any domain (static <img> tags used throughout)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
