import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // The mockup must stay runnable while screens are half-built.
    // Type errors still show in the editor and in `npm run build` logs.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
