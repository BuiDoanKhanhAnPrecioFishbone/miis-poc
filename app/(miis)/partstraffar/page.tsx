import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { rollInfo } from "@/lib/domain/roll";

export const metadata: Metadata = {
  title: "MIIS – Partsträffar och samordnade avtalskrav",
  description:
    "Registrering av partsträffar inför avtalsrörelse samt samordnade avtalskrav per part.",
  openGraph: {
    title: "MIIS – Partsträffar och samordnade avtalskrav",
    description:
      "Registrering av partsträffar inför avtalsrörelse samt samordnade avtalskrav per part.",
  },
};

export default function PartstraffarPage() {
  // US-08 is performed by the mediation administrator (Appendix 1 §8, US-08).
  return (
    <PlaceholderPage
      title="Partsträffar"
      epic="Epic F9 – Partsträffar (US-08)"
      subtitle="Möten mellan MI och enskild part inför avtalsrörelsen"
      roll={rollInfo("medlingsadministrator")}
      features={[
        { id: "FF-004", text: "Registrering av partsträff före, under och efter mötet." },
        {
          id: "FF-005",
          text: "Samordnade avtalskrav med flagga samordnat/eget förbund och kopplade fackförbund.",
        },
        { id: "FSD-002", text: "Partsträffsdokument skapas från mall förifylld med MIIS-information." },
        { id: "FAI-004", text: "Krav från mötet kan läggas till i bevakningsordstabellen." },
      ]}
    />
  );
}
