import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { roleInfo } from "@/lib/domain/role";
import { activeDataset } from "@/lib/session";

export const metadata: Metadata = {
  title: "MIIS – Förhandlingar och avtalsrörelser",
  description:
    "Registrering av avtalsrörelser och övriga förhandlingar, med och utan avtalsutfall, samt koppling till avtal och medling.",
  openGraph: {
    title: "MIIS – Förhandlingar och avtalsrörelser",
    description:
      "Registrering av avtalsrörelser och övriga förhandlingar, med och utan avtalsutfall, samt koppling till avtal och medling.",
  },
};

export default async function ForhandlingarPage() {
  const dataset = await activeDataset();
  return (
    <PlaceholderPage
      title="Förhandlingar"
      epic="Epic F9 – Förhandlings- och medlingshantering"
      subtitle="Avtalsrörelse och övrig förhandling (US-16)"
      role={roleInfo("agreement-admin")}
      dataset={dataset}
      features={[
        {
          id: "FF-001",
          text: "Registrering av förhandling av typen Avtalsrörelse eller Övrig förhandling.",
        },
        { id: "FF-002", text: "Koppling av förhandling till avtal via protokollsuppladdning." },
        { id: "FF-003", text: "Fristående förhandling med direkta kopplingar till parter." },
        { id: "FF-004", text: "Uppföljning av förhandlingens status och utfall." },
      ]}
    />
  );
}
