import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { rollInfo } from "@/lib/domain/roll";

export const metadata: Metadata = {
  title: "MIIS – Märket, industrins kostnadsnorm",
  description:
    "Registrering av Märket med kostnadsram, periodisering, tilläggsöverenskommelser och giltighetsperiod.",
  openGraph: {
    title: "MIIS – Märket, industrins kostnadsnorm",
    description:
      "Registrering av Märket med kostnadsram, periodisering, tilläggsöverenskommelser och giltighetsperiod.",
  },
};

export default function MarketPage() {
  return (
    <PlaceholderPage
      title="Märket"
      epic="Epic F10 – Registrering av Märket"
      subtitle="Industrins kostnadsnorm som referens i avtals- och medlarvyer (US-06)"
      roll={rollInfo("avtalsadministrator")}
      features={[
        {
          id: "FM-001",
          text: "Registrering av Märket som periodiserad inställning med kostnadsram, periodisering och tilläggsöverenskommelser.",
        },
        {
          id: "FM-002",
          text: "Larm när nytt avtalsprotokoll för Industriavtalet registreras för period utan märkesdefinition.",
        },
        { id: "FM-003", text: "Märket visas som referens på startsidan och i medlarvyn." },
        { id: "FA-012", text: "Industrimärke-flagga på märkessättande avtal." },
      ]}
    />
  );
}
