import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/miis/Placeholder";

export const Route = createFileRoute("/avtal")({
  head: () => ({
    meta: [
      { title: "MIIS – Avtal och avtalsområden" },
      {
        name: "description",
        content:
          "Registrering och förvaltning av kollektivavtal, löneavtal, allmänna villkor, sekretessmarkering och bevakning.",
      },
      { property: "og:title", content: "MIIS – Avtal och avtalsområden" },
      {
        property: "og:description",
        content: "Epic F2: avtalsregistrering och -hantering i Medlingsinstitutets informationssystem.",
      },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Avtal"
      epic="Epic F2 – Avtalsregistrering och -hantering"
      subtitle="Avtal, avtalsområden, löneavtal och allmänna villkor"
      features={[
        { id: "FA-001", text: "Avtalsområde och avtal som övergripande enhet med parter och avtalstyp." },
        { id: "FA-002", text: "Registrering av löneavtal – en ny rad per avtalsrörelse/period." },
        { id: "FA-003", text: "Registrering av allmänna villkor." },
        { id: "FA-004", text: "Separata löptider för löneavtal respektive allmänna villkor." },
        { id: "FA-007", text: "Jämställdhetsflagga på löneavtal." },
        { id: "FA-017", text: "Registrering av förhandlingsordningsavtal." },
        { id: "FA-021", text: "Registreringsstatus Ofullständig / Klar." },
        { id: "FA-022", text: "Påminnelser för komplettering av avtalsuppgifter." },
      ]}
    />
  ),
});
