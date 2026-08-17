import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { roleInfo } from "@/lib/domain/role";
import { activeDataset } from "@/lib/session";

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

export default async function MarketPage() {
  const dataset = await activeDataset();
  return (
    <PlaceholderPage
      title="Märket"
      epic="Epic F10 – Registrering av Märket"
      subtitle="Industrins kostnadsnorm som referens i avtals- och medlarvyer (US-06)"
      role={roleInfo("agreement-admin")}
      dataset={dataset}
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
