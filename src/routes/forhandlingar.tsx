import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/miis/Placeholder";

export const Route = createFileRoute("/forhandlingar")({
  head: () => ({
    meta: [
      { title: "MIIS – Förhandlingar och avtalsrörelser" },
      { name: "description", content: "Registrering av avtalsrörelser och övriga förhandlingar, med och utan avtalsutfall, samt koppling till avtal och medling." },
      { property: "og:title", content: "MIIS – Förhandlingar och avtalsrörelser" },
      { property: "og:description", content: "Registrering av avtalsrörelser och övriga förhandlingar, med och utan avtalsutfall, samt koppling till avtal och medling." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Förhandlingar"
      epic="Epic F9 – Förhandlings- och medlingshantering"
      subtitle="Avtalsrörelse och övrig förhandling (US-16)"
      user="Anna Andersson"
      role="Avtalsadministratör"
      features={[
        { id: "FF-001", text: "Registrering av förhandling av typen Avtalsrörelse eller Övrig förhandling." },
        { id: "FF-002", text: "Koppling av förhandling till avtal via protokollsuppladdning." },
        { id: "FF-003", text: "Fristående förhandling med direkta kopplingar till parter." },
        { id: "FF-004", text: "Uppföljning av förhandlingens status och utfall." },
      ]}
    />
  ),
});
