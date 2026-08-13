import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/miis/Placeholder";

export const Route = createFileRoute("/medlare")({
  head: () => ({
    meta: [
      { title: "MIIS – Medlarregister och uppdragsstatistik" },
      { name: "description", content: "Administration av medlarregistret med kompetens, positioner och statistik per medlare, år och avtalsområde." },
      { property: "og:title", content: "MIIS – Medlarregister och uppdragsstatistik" },
      { property: "og:description", content: "Administration av medlarregistret med kompetens, positioner och statistik per medlare, år och avtalsområde." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Medlare"
      epic="Epic F9 – Medlarregistret (US-10)"
      subtitle="Medlare, uppdrag och statistik"
      user="Per Persson"
      role="Medlaradministratör"
      features={[
        { id: "FF-009", text: "Registrering och administration av medlare i medlarregistret." },
        { id: "FF-014", text: "Statistik per medlare (år och avtalsområde)." },
        { id: "FE-001", text: "Notifierings-epost när ett medlingsbeslut klarmarkerats." },
        { id: "FH-001", text: "Alla ändringar i registret loggas i ändringsloggen." },
      ]}
    />
  ),
});
