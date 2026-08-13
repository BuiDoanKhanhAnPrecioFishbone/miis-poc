import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/miis/Placeholder";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "MIIS – Märket, industrins kostnadsnorm" },
      { name: "description", content: "Registrering av Märket med kostnadsram, periodisering, tilläggsöverenskommelser och giltighetsperiod." },
      { property: "og:title", content: "MIIS – Märket, industrins kostnadsnorm" },
      { property: "og:description", content: "Registrering av Märket med kostnadsram, periodisering, tilläggsöverenskommelser och giltighetsperiod." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Märket"
      epic="Epic F10 – Registrering av Märket"
      subtitle="Industrins kostnadsnorm som referens i avtals- och medlarvyer (US-06)"
      user="Anna Andersson"
      role="Avtalsadministratör"
      features={[
        { id: "FM-001", text: "Registrering av Märket med kostnadsram och period." },
        { id: "FM-002", text: "Periodisering per delperiod samt tilläggsöverenskommelser." },
        { id: "FM-003", text: "Märket visas som referens på startsidan och i medlarvyn." },
        { id: "FH-002", text: "Registrering av Märket loggas i händelseloggen." },
      ]}
    />
  ),
});
