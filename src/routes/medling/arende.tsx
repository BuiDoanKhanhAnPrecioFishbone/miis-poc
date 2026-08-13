import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Button, Field, Panel, ReqTag, StatusDot } from "@/components/miis/AppShell";

export const Route = createFileRoute("/medling/arende")({
  head: () => ({
    meta: [
      { title: "MIIS – Medlingsärende M-2027/12, särskild medling" },
      {
        name: "description",
        content:
          "US-07: medlingsärende skapat automatiskt från GD-beslut med kopplade avtal, medlare, beslutsstöd och medlingsresultat.",
      },
      { property: "og:title", content: "MIIS – Medlingsärende M-2027/12" },
      {
        property: "og:description",
        content:
          "Medlingsärende från GD-beslut med kopplade avtal, tillsatta medlare, AI-beslutsstöd och registrerat medlingsresultat.",
      },
    ],
  }),
  component: Arende,
});

function Arende() {
  return (
    <AppShell user="Per Persson" role="Medlingsadministratör">
      <h1 className="mb-6 font-display text-4xl font-medium tracking-tight text-[var(--mi-slate-900)]">
        Medlingsärende M-2027/12 – Särskild medling
      </h1>

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <Panel title="GD-beslut nr 12/2027 – uppladdat, ärende skapat automatiskt" tags={["FF-007"]}>
            <div className="grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-4">
              <Field label="Diarienummer (diariesystemet)" value="2027/59" />
              <Field label="Beslutsdatum" value="2027-05-03" />
              <Field label="Typ" value="Särskild medling" />
              <Field label="GD-beslut (dokument)" value="GD-beslut_12-2027.pdf" />
            </div>
          </Panel>

          <Panel
            title="Kopplade avtal (2)"
            tags={["FF-008"]}
            action={<Button variant="outline">+ Koppla avtal</Button>}
          >
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[0.95rem]">
                <StatusDot color="red" />
                Spårtrafik – Tågföretagen / Seko · Kvarstående, utlöpt 2027-04-30
              </li>
              <li className="flex items-center gap-3 text-[0.95rem]">
                <StatusDot color="red" />
                Spårtrafik – Tågföretagen / ST · Kvarstående, utlöpt 2027-04-30
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Röd markering = koppling till medling. Ett medlingsärende kan kopplas till
              flera avtal.
            </p>
          </Panel>

          <Panel
            title="Medlare (ur medlarregistret)"
            tags={["FF-009"]}
            action={<Button variant="outline">+ Lägg till medlare</Button>}
          >
            <ul className="space-y-2 text-[0.95rem]">
              <li>Gunilla Runnquist · Särskild medling · Position: ettan · 14 tidigare uppdrag</li>
              <li>Bengt Huldt · Särskild medling · Position: tvåan · 9 tidigare uppdrag</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Statistik per medlare (år/avtalsområde) visas i medlarregistret
            </p>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Förhandlingsordningsavtal" tags={["FF-006", "FA-017"]} tone="mint">
            <p className="text-[0.95rem]">
              Avtalsområdet täcks INTE av förhandlingsordningsavtal.
            </p>
            <p className="mt-3 font-semibold text-primary">
              → Medlingsinstitutet tillsätter medlare.
            </p>
            <p className="mt-3 text-sm text-primary/80">
              Om avtalet omfattas av förhandlingsordningsavtal medlar parterna i egen regi och MI
              tillsätter ingen medlare (§4.2).
            </p>
          </Panel>


          <Panel title="Beslutsstöd" tags={["§4.1 AI"]}>
            <div className="mb-3">
              <span className="rounded-full border border-ai-border bg-ai px-2.5 py-0.5 text-[0.65rem] font-bold text-ai-foreground">
                AI-FÖRSLAG
              </span>
            </div>
            <p className="font-semibold">Övriga parter på avtalsområdet:</p>
            <p className="mb-3 text-[0.95rem]">SRAT, Sveriges Ingenjörer</p>
            <p className="font-semibold">Tidigare medlingar:</p>
            <p className="text-[0.95rem]">
              2023 (Spårtrafik) · Spridningsrisk: närliggande avtal inom Transportföretagen
              utlöper i maj
            </p>
          </Panel>

          <Panel title="Märket (referens i medlarvyn)" tags={["FM-003"]} tone="sand">
            <p className="text-[0.95rem] text-sand-foreground">Kostnadsram 6,4 % · 24 månader</p>
            <p className="text-[0.95rem] text-sand-foreground">Periodisering 3,2 % / 3,2 %</p>
            <p className="mt-2 text-sm text-sand-foreground/80">
              Perioden 2027-04-01 – 2029-03-31
            </p>
          </Panel>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <Panel title="Dokument och åtgärder" tags={["FSD-001"]}>
          <p className="text-[0.95rem]">GD-beslut_12-2027.pdf · Medlarrapport (väntas)</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button variant="outline">Skapa GD-beslut – med varsel</Button>
            <Button variant="outline">Skapa GD-beslut – utan varsel</Button>
            <Button>Klarmarkera beslut</Button>
            <ReqTag id="FE-001" />
            <span className="text-sm text-muted-foreground">
              → Notifierings-epost med länk skickas till medlaradministratör och loggas
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Dokumentmallarna förifylls med information från MIIS och kan redigeras före
            färdigställande
          </p>
        </Panel>

        <Panel title="Medlingsresultat" tags={["FF-010"]}>
          <div className="grid gap-4 @xl:grid-cols-3 @3xl:grid-cols-5">
            <Field label="Typ av medling" value="Särskild" />
            <Field label="Stridsåtgärder" value="Ja" />
            <Field label="Typ av stridsåtgärd" value="Strejk" />
            <Field label="Förlorade arbetsdagar" value="2 400" />
            <Field label="Antal berörda anställda" value="1 150" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Avslutas medlingen utan att avtal tecknas markeras förhandlingen som avslutad med
            status (FF-003). Tecknas avtal efter medlingen färgkodas det rött (FR-012) och kopplas
            via protokollsregistreringen (US-01).
          </p>
          <div className="mt-4">
            <Button variant="outline">Registrera fast medling (förenklat formulär)</Button>
          </div>
        </Panel>

        <Panel title="Händelselogg på berörda avtal" tags={["FH-002", "FR-012"]}>
          <ul className="divide-y divide-border text-[0.95rem]">
            <li className="flex items-center gap-3 py-2.5">
              <StatusDot color="red" />
              2027-05-03 09:15 · Medling startar – Spårtrafik, Tågföretagen / Seko
            </li>
            <li className="flex items-center gap-3 py-2.5">
              <StatusDot color="red" />
              2027-05-03 09:15 · Medling startar – Spårtrafik, Tågföretagen / ST
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Avtalen färgkodas röda i vyerna som avtal med koppling till medling
          </p>
        </Panel>
      </div>

    </AppShell>
  );
}
