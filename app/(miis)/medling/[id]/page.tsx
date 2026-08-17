import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/miis/AppShell";
import { Button, Field, Panel, ReqTag, StatusDot } from "@/components/miis/primitives";
import { getCurrentBenchmark } from "@/lib/data/benchmark";
import { getMediationCase } from "@/lib/data/mediation";
import {
  caseNumber,
  MEDIATION_TYPE_LABEL,
  MEDIATOR_POSITION_LABEL,
  miAppointsMediators,
} from "@/lib/domain/mediation";
import { roleInfo } from "@/lib/domain/role";
import { statusInfo } from "@/lib/domain/status";
import { amount, percent } from "@/lib/format";
import { activeDataset } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getMediationCase(id);
  if (!detail) return { title: "MIIS – Medlingsärende" };

  const number = caseNumber(detail.mediationCase.id);
  return {
    title: `MIIS – Medlingsärende ${number}, ${MEDIATION_TYPE_LABEL[detail.mediationCase.type].toLowerCase()}`,
    description:
      "US-07: medlingsärende skapat automatiskt från GD-beslut med kopplade avtal, medlare, beslutsstöd och medlingsresultat.",
    openGraph: {
      title: `MIIS – Medlingsärende ${number}`,
      description:
        "Medlingsärende från GD-beslut med kopplade avtal, tillsatta medlare, AI-beslutsstöd och registrerat medlingsresultat.",
    },
  };
}

export default async function MediationCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getMediationCase(id);
  if (!detail) notFound();

  const { mediationCase, linkedAgreements, events } = detail;
  const [benchmark, dataset] = await Promise.all([getCurrentBenchmark(), activeDataset()]);
  const role = roleInfo("mediation-admin");
  const miAppoints = miAppointsMediators(mediationCase);

  return (
    <AppShell role={role} dataset={dataset}>
      <h1 className="mb-6 font-display text-4xl font-medium tracking-tight text-[var(--mi-slate-900)]">
        Medlingsärende {caseNumber(mediationCase.id)} – {MEDIATION_TYPE_LABEL[mediationCase.type]}
      </h1>

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <Panel
            title={`${mediationCase.dgDecision.number} – uppladdat, ärende skapat automatiskt`}
            tags={["FF-007"]}
          >
            <div className="grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-4">
              <Field
                label="Diarienummer (diariesystemet)"
                value={mediationCase.registryNumber ?? "–"}
              />
              <Field label="Beslutsdatum" value={mediationCase.dgDecision.date} />
              <Field label="Typ" value={MEDIATION_TYPE_LABEL[mediationCase.type]} />
              <Field label="GD-beslut (dokument)" value={mediationCase.dgDecision.document} />
            </div>
          </Panel>

          <Panel
            title={`Kopplade avtal (${linkedAgreements.length})`}
            tags={["FF-008"]}
            action={<Button variant="outline">+ Koppla avtal</Button>}
          >
            <ul className="space-y-3">
              {linkedAgreements.map((a) => (
                <li key={a.id} className="flex items-center gap-3 text-[0.95rem]">
                  <StatusDot status={statusInfo("after-mediation")} />
                  {a.name} · {a.validity}
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
            {mediationCase.mediators.length === 0 ? (
              <p className="text-[0.95rem] text-muted-foreground">
                Inga medlare tillsatta – parterna medlar i egen regi enligt
                förhandlingsordningsavtal.
              </p>
            ) : (
              <ul className="space-y-2 text-[0.95rem]">
                {mediationCase.mediators.map((m) => (
                  <li key={m.id}>
                    {m.name} · {MEDIATION_TYPE_LABEL[mediationCase.type]} · Position:{" "}
                    {MEDIATOR_POSITION_LABEL[m.position].toLowerCase()} · {m.previousAssignments}{" "}
                    tidigare uppdrag
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              Statistik per medlare (år/avtalsområde) visas i medlarregistret
            </p>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Förhandlingsordningsavtal" tags={["FF-006", "FA-017"]} tone="mint">
            <p className="text-[0.95rem]">
              Avtalsområdet täcks {miAppoints ? "INTE " : ""}av förhandlingsordningsavtal.
            </p>
            <p className="mt-3 font-semibold text-primary">
              {miAppoints
                ? "→ Medlingsinstitutet tillsätter medlare."
                : "→ Parterna medlar i egen regi. MI tillsätter ingen medlare."}
            </p>
            <p className="mt-3 text-sm text-primary/80">
              Om avtalet omfattas av förhandlingsordningsavtal medlar parterna i egen regi och MI
              tillsätter ingen medlare (§4.2).
            </p>
          </Panel>

          {mediationCase.decisionSupport && (
            <Panel title="Beslutsstöd" tags={["§4.1 AI"]}>
              <div className="mb-3">
                <span className="rounded-full border border-ai-border bg-ai px-2.5 py-0.5 text-[0.65rem] font-bold text-ai-foreground">
                  AI-FÖRSLAG
                </span>
              </div>
              <p className="font-semibold">Övriga parter på avtalsområdet:</p>
              <p className="mb-3 text-[0.95rem]">{mediationCase.decisionSupport.otherParties}</p>
              <p className="font-semibold">Tidigare medlingar:</p>
              <p className="text-[0.95rem]">{mediationCase.decisionSupport.previousMediations}</p>
            </Panel>
          )}

          {benchmark && (
            <Panel title="Märket (referens i medlarvyn)" tags={["FM-003"]} tone="sand">
              <p className="text-[0.95rem] text-sand-foreground">
                Kostnadsram {percent(benchmark.costFramePercent)} · {benchmark.months} månader
              </p>
              <p className="text-[0.95rem] text-sand-foreground">
                Periodisering {benchmark.periodisation}
              </p>
              <p className="mt-2 text-sm text-sand-foreground/80">
                Perioden {benchmark.validFrom} – {benchmark.validTo}
              </p>
            </Panel>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <Panel title="Dokument och åtgärder" tags={["FSD-001"]}>
          <p className="text-[0.95rem]">
            {mediationCase.documents ?? mediationCase.dgDecision.document}
          </p>
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

        {mediationCase.outcome && (
          <Panel title="Medlingsresultat" tags={["FF-010"]}>
            <div className="grid gap-4 @xl:grid-cols-3 @3xl:grid-cols-5">
              <Field
                label="Typ av medling"
                value={mediationCase.outcome.mediationType === "special" ? "Särskild" : "Fast"}
              />
              <Field
                label="Stridsåtgärder"
                value={mediationCase.outcome.industrialAction ? "Ja" : "Nej"}
              />
              <Field
                label="Typ av stridsåtgärd"
                value={mediationCase.outcome.industrialActionType ?? "–"}
              />
              <Field
                label="Förlorade arbetsdagar"
                value={
                  mediationCase.outcome.lostWorkingDays
                    ? amount(mediationCase.outcome.lostWorkingDays)
                    : "–"
                }
              />
              <Field
                label="Antal berörda anställda"
                value={
                  mediationCase.outcome.affectedEmployees
                    ? amount(mediationCase.outcome.affectedEmployees)
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

        {events.length > 0 && (
          <Panel title="Händelselogg på berörda avtal" tags={["FH-002", "FR-012"]}>
            <ul className="divide-y divide-border text-[0.95rem]">
              {events.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-2.5">
                  <StatusDot status={statusInfo("after-mediation")} />
                  {e.timestamp} · {e.text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Avtalen färgkodas röda i vyerna som avtal med koppling till medling
            </p>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
