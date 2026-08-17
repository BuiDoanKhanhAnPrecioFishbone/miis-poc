import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // The mockup must stay runnable while screens are half-built.
    // Type errors still show in the editor and in `npm run build` logs.
    ignoreBuildErrors: false,
  },
  // The dev overlay sits in the bottom-left corner and lands in every
  // screenshot taken with `npm run screenshots`. Compile and runtime errors are
  // still surfaced in the terminal.
  devIndicators: false,
};

export default nextConfig;
