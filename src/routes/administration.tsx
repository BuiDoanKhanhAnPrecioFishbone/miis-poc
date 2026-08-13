import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/miis/Placeholder";

export const Route = createFileRoute("/administration")({
  head: () => ({
    meta: [
      { title: "MIIS – Administration, behörigheter och loggar" },
      { name: "description", content: "Användare och roller, systemkonfiguration, bevakningsord samt händelse- och ändringslogg." },
      { property: "og:title", content: "MIIS – Administration, behörigheter och loggar" },
      { property: "og:description", content: "Användare och roller, systemkonfiguration, bevakningsord samt händelse- och ändringslogg." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Administration"
      epic="Epic F5 och NF2 – Loggar, behörighet och konfiguration"
      subtitle="Användare, roller, stödtabeller och spårbarhet (US-12, US-13)"
      user="Sven Svensson"
      role="Systemadministratör"
      features={[
        { id: "NFÅ-001", text: "Autentisering med EFOS-kort via Försäkringskassans IdP (SAML2)." },
        { id: "NFÅ-002", text: "Rollbaserad behörighetsstyrning enligt de åtta användarrollerna." },
        { id: "FH-001", text: "Ändringslogg med vem, vad och när för samtliga registervårdande åtgärder." },
        { id: "FH-002", text: "Händelselogg över systemhändelser och utskickade e-postmeddelanden." },
        { id: "FS-002", text: "Underhåll av stödtabeller, bevakningsord och rapporturval." },
      ]}
    />
  ),
});
