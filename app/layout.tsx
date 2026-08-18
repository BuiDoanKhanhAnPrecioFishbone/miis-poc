import type { Metadata } from "next";
import type { ReactNode } from "react";

import { langInfo } from "@/lib/domain/lang";
import { activeLang, reqTagsEnabled } from "@/lib/session";
import "./globals.css";

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
    <html lang={langInfo(lang).htmlLang} data-lang={lang} data-reqtags={reqTags ? "on" : "off"}>
      <body>{children}</body>
    </html>
  );
}
