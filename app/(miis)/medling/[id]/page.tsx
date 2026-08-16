import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/miis/AppShell";
import { Button, Field, Panel, ReqTag, StatusDot } from "@/components/miis/primitives";
import { getMedlingsarende } from "@/lib/data/medling";
import { getGallandeMarke } from "@/lib/data/marke";
import {
  arendenummer,
  MEDLINGSTYP_ETIKETT,
  MEDLARPOSITION_ETIKETT,
  tillsatterMiMedlare,
} from "@/lib/domain/medling";
import { rollInfo } from "@/lib/domain/roll";
import { statusInfo } from "@/lib/domain/status";
import { belopp, procent } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detalj = await getMedlingsarende(id);
  if (!detalj) return { title: "MIIS – Medlingsärende" };

  const nummer = arendenummer(detalj.arende.id);
  return {
    title: `MIIS – Medlingsärende ${nummer}, ${MEDLINGSTYP_ETIKETT[detalj.arende.typ].toLowerCase()}`,
    description:
      "US-07: medlingsärende skapat automatiskt från GD-beslut med kopplade avtal, medlare, beslutsstöd och medlingsresultat.",
    openGraph: {
      title: `MIIS – Medlingsärende ${nummer}`,
      description:
        "Medlingsärende från GD-beslut med kopplade avtal, tillsatta medlare, AI-beslutsstöd och registrerat medlingsresultat.",
    },
  };
}

export default async function MedlingsarendePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detalj = await getMedlingsarende(id);
  if (!detalj) notFound();

  const { arende, kopplade, beslutsstod, dokument, handelser } = detalj;
  const marke = await getGallandeMarke();
  const roll = rollInfo("medlingsadministrator");
  const miTillsatter = tillsatterMiMedlare(arende);

  return (
    <AppShell roll={roll}>
      <h1 className="mb-6 font-display text-4xl font-medium tracking-tight text-[var(--mi-slate-900)]">
        Medlingsärende {arendenummer(arende.id)} – {MEDLINGSTYP_ETIKETT[arende.typ]}
      </h1>

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <Panel
            title={`${arende.gdBeslut.nummer} – uppladdat, ärende skapat automatiskt`}
            tags={["FF-007"]}
          >
            <div className="grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-4">
              <Field label="Diarienummer (diariesystemet)" value={arende.diarienummer ?? "–"} />
              <Field label="Beslutsdatum" value={arende.gdBeslut.datum} />
              <Field label="Typ" value={MEDLINGSTYP_ETIKETT[arende.typ]} />
              <Field label="GD-beslut (dokument)" value={arende.gdBeslut.dokument} />
            </div>
          </Panel>

          <Panel
            title={`Kopplade avtal (${kopplade.length})`}
            tags={["FF-008"]}
            action={<Button variant="outline">+ Koppla avtal</Button>}
          >
            <ul className="space-y-3">
              {kopplade.map((k) => (
                <li key={k.namn} className="flex items-center gap-3 text-[0.95rem]">
                  <StatusDot status={statusInfo("efter-medling")} />
                  {k.namn} · {k.text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Röd markering = koppling till medling. Ett medlingsärende kan kopplas till flera
              avtal.
            </p>
          </Panel>

          <Panel
            title="Medlare (ur medlarregistret)"
            tags={["FF-009"]}
            action={<Button variant="outline">+ Lägg till medlare</Button>}
          >
            <ul className="space-y-2 text-[0.95rem]">
              {arende.medlare.map((m) => (
                <li key={m.id}>
                  {m.namn} · {MEDLINGSTYP_ETIKETT[arende.typ]} · Position:{" "}
                  {MEDLARPOSITION_ETIKETT[m.position].toLowerCase()} · {m.tidigareUppdrag} tidigare
                  uppdrag
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Statistik per medlare (år/avtalsområde) visas i medlarregistret
            </p>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Förhandlingsordningsavtal" tags={["FF-006", "FA-017"]} tone="mint">
            <p className="text-[0.95rem]">
              Avtalsområdet täcks {miTillsatter ? "INTE " : ""}av förhandlingsordningsavtal.
            </p>
            <p className="mt-3 font-semibold text-primary">
              {miTillsatter
                ? "→ Medlingsinstitutet tillsätter medlare."
                : "→ Parterna medlar i egen regi. MI tillsätter ingen medlare."}
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
            <p className="mb-3 text-[0.95rem]">{beslutsstod.ovrigaParter}</p>
            <p className="font-semibold">Tidigare medlingar:</p>
            <p className="text-[0.95rem]">{beslutsstod.tidigareMedlingar}</p>
          </Panel>

          {marke && (
            <Panel title="Märket (referens i medlarvyn)" tags={["FM-003"]} tone="sand">
              <p className="text-[0.95rem] text-sand-foreground">
                Kostnadsram {procent(marke.kostnadsramProcent)} · {marke.antalManader} månader
              </p>
              <p className="text-[0.95rem] text-sand-foreground">
                Periodisering {marke.periodisering}
              </p>
              <p className="mt-2 text-sm text-sand-foreground/80">
                Perioden {marke.giltigFrom} – {marke.giltigTom}
              </p>
            </Panel>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <Panel title="Dokument och åtgärder" tags={["FSD-001"]}>
          <p className="text-[0.95rem]">{dokument}</p>
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

        {arende.resultat && (
          <Panel title="Medlingsresultat" tags={["FF-010"]}>
            <div className="grid gap-4 @xl:grid-cols-3 @3xl:grid-cols-5">
              <Field
                label="Typ av medling"
                value={arende.resultat.typAvMedling === "sarskild" ? "Särskild" : "Fast"}
              />
              <Field label="Stridsåtgärder" value={arende.resultat.stridsatgarder ? "Ja" : "Nej"} />
              <Field label="Typ av stridsåtgärd" value={arende.resultat.typAvStridsatgard ?? "–"} />
              <Field
                label="Förlorade arbetsdagar"
                value={
                  arende.resultat.forloradeArbetsdagar
                    ? belopp(arende.resultat.forloradeArbetsdagar)
                    : "–"
                }
              />
              <Field
                label="Antal berörda anställda"
                value={
                  arende.resultat.antalBerordaAnstallda
                    ? belopp(arende.resultat.antalBerordaAnstallda)
                    : "–"
                }
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Avslutas medlingen utan att avtal tecknas markeras förhandlingen som avslutad med
              status (FF-003). Tecknas avtal efter medlingen färgkodas det rött (FR-012) och
              kopplas via protokollsregistreringen (US-01).
            </p>
            <div className="mt-4">
              <Button variant="outline">Registrera fast medling (förenklat formulär)</Button>
            </div>
          </Panel>
        )}

        <Panel title="Händelselogg på berörda avtal" tags={["FH-002", "FR-012"]}>
          <ul className="divide-y divide-border text-[0.95rem]">
            {handelser.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-2.5">
                <StatusDot status={statusInfo("efter-medling")} />
                {h.tidpunkt} · {h.text}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Avtalen färgkodas röda i vyerna som avtal med koppling till medling
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
