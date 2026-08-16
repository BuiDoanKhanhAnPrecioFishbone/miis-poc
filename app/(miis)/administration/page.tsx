import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { rollInfo } from "@/lib/domain/roll";

export const metadata: Metadata = {
  title: "MIIS – Administration, behörigheter och loggar",
  description:
    "Användare och roller, systemkonfiguration, bevakningsord samt händelse- och ändringslogg.",
  openGraph: {
    title: "MIIS – Administration, behörigheter och loggar",
    description:
      "Användare och roller, systemkonfiguration, bevakningsord samt händelse- och ändringslogg.",
  },
};

export default function AdministrationPage() {
  return (
    <PlaceholderPage
      title="Administration"
      epic="Epic F5 och NF2 – Loggar, behörighet och konfiguration"
      subtitle="Användare, roller, stödtabeller och spårbarhet (US-12, US-13)"
      roll={rollInfo("systemadministrator")}
      features={[
        { id: "NFÅ-001", text: "Autentisering med EFOS-kort via Försäkringskassans IdP (SAML2)." },
        { id: "NFÅ-003", text: "Rollbaserad behörighetsstyrning enligt de åtta användarrollerna." },
        {
          id: "FH-001",
          text: "Ändringslogg med vem, vad och när – inklusive gammalt och nytt värde.",
        },
        { id: "FH-002", text: "Händelselogg över systemhändelser och utskickade e-postmeddelanden." },
        { id: "NFL-003", text: "Loggar bevaras i minst 24 månader och kan inte ändras eller raderas." },
        { id: "FAI-004", text: "Underhåll av bevakningsordstabellen inför avtalsrörelsen." },
      ]}
    />
  );
}
