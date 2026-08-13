import { createFileRoute } from "@tanstack/react-router";
import {
  AppShell,
  Button,
  Field,
  Panel,
  ReqTag,
} from "@/components/miis/AppShell";

export const Route = createFileRoute("/registrera")({
  head: () => ({
    meta: [
      { title: "MIIS – Registrera avtalsprotokoll med AI-stöd" },
      {
        name: "description",
        content:
          "US-01: ladda upp avtalsprotokoll, låt AI föreslå matchat avtal och löneavtalsvärden, granska och godkänn manuellt.",
      },
      { property: "og:title", content: "MIIS – Registrera avtalsprotokoll med AI-stöd" },
      {
        property: "og:description",
        content:
          "Guidat flöde i fem steg för registrering av inkommet avtalsprotokoll med AI-förslag och manuellt godkännande.",
      },
    ],
  }),
  component: Registrera,
});

const steps = [
  "1. Ladda upp",
  "2. AI-analys",
  "3. Avtal (matchat)",
  "4. Löneavtal / Allmänna villkor",
  "5. Koppla protokoll",
];

function Registrera() {
  return (
    <AppShell user="Anna Andersson" role="Avtalsadministratör">
      <div className="mb-6 flex flex-wrap gap-3">
        {steps.map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
              i < 4
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Panel>
          <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-border pb-3">
            <h2 className="font-display text-lg font-semibold text-primary">
              Avtalsprotokoll_Kommunikation_2027.pdf
            </h2>
            <span className="rounded-md border border-mint-border bg-mint px-3 py-1 text-[0.7rem] font-bold text-primary">
              OCR
            </span>
            <ReqTag id="FAI-003" />
          </div>

          <div className="space-y-3 text-[0.95rem] leading-relaxed">
            <p className="font-semibold tracking-wide">ÖVERENSKOMMELSE</p>
            <p>
              mellan Almega Tjänsteförbunden och Seko – Service- och kommunikationsfacket
            </p>
            <p>
              <mark className="bg-sand px-1">avtalsperioden 2027-06-01 – 2029-05-31</mark>
            </p>
            <p>
              Parterna är överens om att avtalet om allmänna anställningsvillkor
              prolongeras med ändringar…
            </p>
            <p>
              <mark className="bg-sand px-1">arbetstidsförkortning om 0,2 %</mark>
            </p>
            <p>Löneavtal, Bilaga B. Lönerevision per den</p>
            <p>
              <mark className="bg-sand px-1">1 juni 2027, 3,2 %</mark>
            </p>
            <p>Part äger rätt att senast den 30 november 2028</p>
            <p className="flex flex-wrap items-center gap-3">
              <mark className="bg-sand px-1">säga upp avtalet till upphörande…</mark>
              <ReqTag id="FAI-004" />
            </p>
          </div>

          <div className="mt-8 rounded-md border border-sand-border bg-sand px-4 py-3 text-sm text-sand-foreground">
            Markerad text = träff i bevakningsordstabellen (3 träffar)
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="AI-analys 1 – identifiering av avtal" tags={["FA-001", "FAI-001"]}>
            <div className="space-y-4">
              <div className="grid gap-4 @xl:grid-cols-2">
                <Field label="Avtalsområde" value="Kommunikation" ai />
                <Field
                  label="Avtal (befintligt i MIIS)"
                  value="Kommunikation – Almega Tjänsteförbunden / Seko"
                  ai
                />
                <Field label="Alternativt avtalsnamn" value="Kommunikationsavtalet" ai />
                <Field label="Avtalstyp" value="Löneavtal + Allmänna villkor" ai />
                <Field label="Avtalspart AGO" value="Almega Tjänsteförbunden" ai />
                <Field label="Avtalspart ATO" value="Seko – Service- och kommunikationsfacket" ai />
              </div>
              <p className="rounded-md border border-mint-border bg-mint px-4 py-3 text-sm text-primary">
                Validering och logiska kontroller: inga avvikelser. Framgår inte avtalsnamnet av
                protokollet används filnamnet eller parternas gemensamma avtal som underlag
                (FA-018).
              </p>
            </div>
          </Panel>

          <Panel title="AI-analys 2 – löptid och uppsägning" tags={["FAI-001"]}>
            <div className="space-y-4">
              <div className="grid gap-4 @xl:grid-cols-3">
                <Field label="Teckningsdatum" value="2027-05-28" ai />
                <Field label="Löptid" value="2027-06-01 – 2029-05-31" ai />
                <Field label="Uppsägningsmöjlighet" value="Ja, senast 2028-11-30" ai />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button>Godkänn</Button>
                <Button variant="outline">Justera</Button>
                <span className="text-sm text-muted-foreground">
                  Inget sparas automatiskt – felaktiga AI-förslag korrigeras fritt före godkännande
                </span>
                <ReqTag id="FAI-002" />
              </div>
            </div>
          </Panel>

          <Panel title="Löneavtal 2027 – ny rad för avtalsrörelsen" tags={["FA-002"]}>
            <div className="space-y-4">
              <Field
                label="Avtalskonstruktion (1–7)"
                value="2. Lokal lönebildning med stupstock om utrymmets storlek"
                hint="Sju MI-definierade konstruktioner (FA-007)"
              />

              <div className="grid gap-4 @xl:grid-cols-4">
                <Field label="Löneutrymme (%)" value="3,2" />
                <Field label="Kostnadsram (%)" value="6,4" />
                <Field label="Individgaranti" value="Nej" />
                <Field label="Arb.tidsförk. / kostnad" value="Ja · 0,2 %" />
              </div>
              <div className="flex items-center justify-end">
                <ReqTag id="FA-008–10" />
              </div>

              <div className="grid gap-4 @xl:grid-cols-2">
                <Field
                  label="Undergrupp: Lönerevision"
                  value="2027-06-01 · 3,2 %"
                  hint="Kopplad till löneavtalet (§4.2)"
                />
                <Field
                  label="Undergrupp: Lägstalön"
                  value="25 480 kr/mån fr.o.m. 2027-06-01"
                  hint="Kopplad till löneavtalet (§4.2)"
                />
              </div>

              <div className="grid gap-4 @xl:grid-cols-2">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[0.95rem] font-bold">
                      Jämställdhetsflagga – skrivning identifierad
                    </span>
                    <ReqTag id="FA-011" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-14 items-center rounded-full bg-status-green px-1">
                      <span className="ml-auto size-6 rounded-full bg-card" />
                    </span>
                    <span className="rounded-full border border-ai-border bg-ai px-2 py-0.5 text-[0.65rem] font-bold text-ai-foreground">
                      AI-FÖRSLAG
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[0.95rem] font-bold">
                      Industrimärke (märkessättande avtal)
                    </span>
                    <ReqTag id="FA-012" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-14 items-center rounded-full bg-secondary px-1">
                      <span className="mr-auto size-6 rounded-full bg-card" />
                    </span>
                    <span className="text-sm text-muted-foreground">Nej</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Allmänna villkor – egen giltighetsperiod" tags={["FA-003", "FA-004"]}>
            <div className="grid gap-4 @xl:grid-cols-2">
              <Field label="Eget teckningsdatum" value="2027-05-28" />
              <Field label="Egen giltighetsperiod" value="2027-06-01 – 2030-05-31" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Löptiderna för löneavtal och allmänna villkor behöver inte följas åt
            </p>
          </Panel>

          <Panel title="Koppla förhandling och protokoll" tags={["FF-002", "FD-001"]}>
            <div className="grid gap-4 @xl:grid-cols-2">
              <Field
                label="Registrerad förhandling"
                value="FÖ-2027/218 – Kommunikation, avslutad 2027-05-28"
                ai
              />
              <Field label="Dokument kopplas till" value="Avtal + löneavtal + förhandling" />
            </div>
          </Panel>

          <Panel title="Spara registrering" tags={["FA-021"]}>
            <div className="grid gap-4 @xl:grid-cols-2">
              <Field label="Registreringsstatus" value="Klar ▾" />
              <Field label="Färgkodning i vyerna" value="Grön – nytecknat utan medling" hint="FR-012" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button>Godkänn och koppla protokoll</Button>
              <Button variant="outline">Spara som ofullständig</Button>
              <span className="text-sm text-muted-foreground">
                Ofullständig registrering följs upp med påminnelse (US-04)
              </span>
            </div>
            <p className="mt-4 rounded-md border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground">
              Vid sparande: ändringsloggen registrerar vad som ändrats, av vem och när (FH-001)
              och händelsen ”avtal tecknat” läggs i händelseloggen (FH-002). Tecknas avtalet efter
              medling färgkodas det rött i stället för grönt (FR-012, US-09).
            </p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

