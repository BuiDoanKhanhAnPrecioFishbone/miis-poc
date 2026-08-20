import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { langInfo } from "@/lib/domain/lang";
import { activeLang, reqTagsEnabled } from "@/lib/session";
import "./globals.css";

/**
 * Public Sans, self-hosted — NFA-001.
 *
 * *"The system must not have direct or indirect dependencies on external cloud
 * services (e.g. Microsoft Azure/Entra ID, AWS or Google Cloud)."* A
 * `<link>` to fonts.googleapis.com would be exactly that, and even
 * `next/font/google` reaches Google at build time. The two `.woff2` files are
 * in the repository, so nothing leaves MI's environment at build or at run.
 *
 * Why this typeface: it is drawn for government forms and dense text, its
 * figures are tabular by default — measured, `2027-04-01` and `1111-11-11`
 * both 121.69px, which matters in a system that is columns of dates,
 * percentages and diarienummer — and it separates 1, l and I where Arial does
 * not. Arial stays as the fallback: our own design system calls it a
 * placeholder because MI's brand font could not be verified, and if MI supply
 * one this is a one-line change.
 *
 * One variable file per subset covers 100–900, so every weight the system uses
 * costs 45 kB in total.
 */
const publicSans = localFont({
  src: [
    { path: "./fonts/public-sans-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/public-sans-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-public-sans",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "MIIS – Medlingsinstitutets Informationssystem",
  description:
    "UX/UI-mockup av MIIS – Medlingsinstitutets informationssystem för kollektivavtal och medling.",
  authors: [{ name: "Medlingsinstitutet" }],
  /*
    MI's own mark. The .ico is the file MI supplied; the SVG is the same
    artwork with the canvas cropped to it, and carries a light/dark fill rule
    because a browser tab is white in one theme and near-black in the other.
  */
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    title: "MIIS – Medlingsinstitutets Informationssystem",
    description:
      "UX/UI-mockup av MIIS för registrering, sökning, analys och rapportering av kollektivavtalsdata.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [lang, reqTags] = await Promise.all([activeLang(), reqTagsEnabled()]);

  // `lang` is WCAG 2.1 AA 3.1.1 (Language of Page) and follows the switch, so an
  // English review is announced in English rather than read out as Swedish.
  //
  // `data-lang` and `data-reqtags` drive the two purely presentational choices
  // that would otherwise need a prop at every call site — which requirement
  // sentence a tooltip shows, and whether the tags are visible at all.
  return (
    <html
      lang={langInfo(lang).htmlLang}
      data-lang={lang}
      data-reqtags={reqTags ? "on" : "off"}
      className={publicSans.variable}
    >
      <body>{children}</body>
    </html>
  );
}
