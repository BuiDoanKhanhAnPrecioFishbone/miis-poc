import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { rollInfo } from "@/lib/domain/roll";

export const metadata: Metadata = {
  title: "MIIS – Parter, samverkansorgan och historik",
  description:
    "Registrering av arbetsgivar- och arbetstagarorganisationer med historik vid namnbyten och organisationsförändringar.",
  openGraph: {
    title: "MIIS – Parter, samverkansorgan och historik",
    description:
      "Registrering av arbetsgivar- och arbetstagarorganisationer med historik vid namnbyten och organisationsförändringar.",
  },
};

export default function ParterPage() {
  return (
    <PlaceholderPage
      title="Parter"
      epic="Epic F3 – Partshantering"
      subtitle="AGO, ATO, samverkansorgan och partshistorik"
      roll={rollInfo("avtalsadministrator")}
      features={[
        { id: "FP-001", text: "Registrering av part med typ AGO eller ATO." },
        { id: "FP-002", text: "Historik vid namnbyte och organisationsförändring hos part." },
        {
          id: "FP-003",
          text: "Samverkansorgan: Huvudorganisation respektive Samverkan, med förhandlande organ Ja/Nej.",
        },
        { id: "FP-004", text: "Koppling mellan part, samverkansorgan och avtal." },
      ]}
    />
  );
}
