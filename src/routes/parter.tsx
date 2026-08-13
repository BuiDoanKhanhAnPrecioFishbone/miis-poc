import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/miis/Placeholder";

export const Route = createFileRoute("/parter")({
  head: () => ({
    meta: [
      { title: "MIIS – Parter, samverkansorgan och historik" },
      { name: "description", content: "Registrering av arbetsgivar- och arbetstagarorganisationer med historik vid namnbyten och organisationsförändringar." },
      { property: "og:title", content: "MIIS – Parter, samverkansorgan och historik" },
      { property: "og:description", content: "Registrering av arbetsgivar- och arbetstagarorganisationer med historik vid namnbyten och organisationsförändringar." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Parter"
      epic="Epic F3 – Partshantering"
      subtitle="AGO, ATO, samverkansorgan och partshistorik"
      user="Anna Andersson"
      role="Avtalsadministratör"
      features={[
        { id: "FP-001", text: "Registrering av part med typ AGO eller ATO." },
        { id: "FP-002", text: "Historik vid namnbyte och organisationsförändring hos part." },
        { id: "FP-003", text: "Samverkansorgan: Huvudorganisation respektive Samverkan, med förhandlande organ Ja/Nej." },
        { id: "FP-004", text: "Koppling mellan part, samverkansorgan och avtal." },
      ]}
    />
  ),
});
