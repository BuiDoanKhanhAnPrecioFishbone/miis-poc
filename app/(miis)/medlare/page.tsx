import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { roleInfo } from "@/lib/domain/role";
import { activeDataset } from "@/lib/session";

export const metadata: Metadata = {
  title: "MIIS – Medlarregister och uppdragsstatistik",
  description:
    "Administration av medlarregistret med kompetens, positioner och statistik per medlare, år och avtalsområde.",
  openGraph: {
    title: "MIIS – Medlarregister och uppdragsstatistik",
    description:
      "Administration av medlarregistret med kompetens, positioner och statistik per medlare, år och avtalsområde.",
  },
};

export default async function MedlarePage() {
  const dataset = await activeDataset();
  return (
    <PlaceholderPage
      title="Medlare"
      epic="Epic F9 – Medlarregistret (US-10)"
      subtitle="Medlare, uppdrag och statistik"
      role={roleInfo("mediator-admin")}
      dataset={dataset}
      features={[
        { id: "FF-009", text: "Registrering och administration av medlare i medlarregistret." },
        {
          id: "FF-009",
          text: "Statistik per medlare (år och avtalsområde) samt position ettan/tvåan.",
        },
        { id: "FE-001", text: "Notifierings-epost när ett medlingsbeslut klarmarkerats." },
        { id: "FH-001", text: "Alla ändringar i registret loggas i ändringsloggen." },
        { id: "D-004", text: "Medlarens personuppgifter omfattas av MI:s gallringsrutiner." },
      ]}
    />
  );
}
