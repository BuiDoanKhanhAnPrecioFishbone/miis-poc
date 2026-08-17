import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { roleInfo } from "@/lib/domain/role";
import { activeDataset } from "@/lib/session";

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

export default async function PartstraffarPage() {
  // US-08 is performed by the mediation administrator (Appendix 1 §8, US-08).
  const dataset = await activeDataset();
  return (
    <PlaceholderPage
      title="Partsträffar"
      epic="Epic F9 – Partsträffar (US-08)"
      subtitle="Möten mellan MI och enskild part inför avtalsrörelsen"
      role={roleInfo("mediation-admin")}
      dataset={dataset}
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
