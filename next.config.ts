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

  /*
    The deployment is an unlisted mockup that serves MI's own material,
    including a scanned example protocol out of Bilaga D. `robots.txt` stops
    well-behaved crawlers from fetching it at all; this header is the backstop
    for anything that fetches first and asks later, and it is the only mechanism
    that reaches a PNG — a `<meta name="robots">` tag cannot be attached to an
    image. Next checks headers before the filesystem, so `/:path*` covers
    everything under `public/` as well as every route.

    `noimageindex` is the one that matters most here: it is what keeps the
    protocol page out of image search.
  */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noimageindex, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
