import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/miis/Placeholder";

export const Route = createFileRoute("/partstraffar")({
  head: () => ({
    meta: [
      { title: "MIIS – Partsträffar och samordnade avtalskrav" },
      { name: "description", content: "Registrering av partsträffar inför avtalsrörelse samt samordnade avtalskrav per part." },
      { property: "og:title", content: "MIIS – Partsträffar och samordnade avtalskrav" },
      { property: "og:description", content: "Registrering av partsträffar inför avtalsrörelse samt samordnade avtalskrav per part." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Partsträffar"
      epic="Epic F9 – Partsträffar (US-08)"
      subtitle="Möten mellan MI och enskild part inför avtalsrörelsen"
      user="Anna Andersson"
      role="Avtalsadministratör"
      features={[
        { id: "FF-011", text: "Registrering av partsträff med datum, deltagare och part." },
        { id: "FF-012", text: "Samordnade avtalskrav kopplade till partsträff." },
        { id: "FF-013", text: "Partsträff är inte en förhandling och särskiljs i statistiken." },
        { id: "FSD-001", text: "Dokumentmallar förifylls med information från MIIS." },
      ]}
    />
  ),
});
