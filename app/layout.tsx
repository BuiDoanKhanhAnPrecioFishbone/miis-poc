import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "MIIS – Medlingsinstitutets Informationssystem",
  description:
    "UX/UI-mockup av MIIS – Medlingsinstitutets informationssystem för kollektivavtal och medling.",
  authors: [{ name: "Medlingsinstitutet" }],
  icons: { icon: "/favicon.ico" },
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

export default function RootLayout({ children }: { children: ReactNode }) {
  // lang="sv": the interface language is Swedish (WCAG 2.1 AA, 3.1.1 Language of Page).
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
