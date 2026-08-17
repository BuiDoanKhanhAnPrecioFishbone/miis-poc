import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { roleInfo } from "@/lib/domain/role";
import { activeDataset } from "@/lib/session";

export const metadata: Metadata = {
  title: "MIIS – Avtal och avtalsområden",
  description:
    "Registrering och förvaltning av kollektivavtal, löneavtal, allmänna villkor, sekretessmarkering och bevakning.",
  openGraph: {
    title: "MIIS – Avtal och avtalsområden",
    description:
      "Epic F2: avtalsregistrering och -hantering i Medlingsinstitutets informationssystem.",
  },
};

export default async function AvtalPage() {
  const dataset = await activeDataset();
  return (
    <PlaceholderPage
      title="Avtal"
      epic="Epic F2 – Avtalsregistrering och -hantering"
      subtitle="Avtal, avtalsområden, löneavtal och allmänna villkor"
      role={roleInfo("agreement-admin")}
      dataset={dataset}
      features={[
        {
          id: "FA-001",
          text: "Avtalsområde och avtal som övergripande enhet med parter och avtalstyp.",
        },
        { id: "FA-002", text: "Registrering av löneavtal – en ny rad per avtalsrörelse/period." },
        { id: "FA-003", text: "Registrering av allmänna villkor." },
        { id: "FA-004", text: "Separata löptider för löneavtal respektive allmänna villkor." },
        { id: "FA-007", text: "Jämställdhetsflagga på löneavtal." },
        { id: "FA-017", text: "Registrering av förhandlingsordningsavtal." },
        { id: "FA-021", text: "Registreringsstatus Ofullständig / Klar." },
        { id: "FA-022", text: "Påminnelser för komplettering av avtalsuppgifter." },
      ]}
    />
  );
}
