import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { Button, Field, Panel, ReqTag, StatusDot } from "@/components/miis/primitives";
import { rollInfo } from "@/lib/domain/roll";
import { statusInfo, type AvtalStatusKod } from "@/lib/domain/status";

export const metadata: Metadata = {
  title: "MIIS – Sökbyggaren med bokslut och export",
  description:
    "US-11: sammansatt sökning över flera handlingstyper, bokslut per datum, sparade sökningar och export till Excel, CSV, JSON och rapportgenerator.",
  openGraph: {
    title: "MIIS – Sökbyggaren med bokslut och export",
    description:
      "Bygg sammansatta sökningar över avtal, medling, förhandlingar och parter – med bokslut och export.",
  },
};

const tabs = ["Avtalsinformation", "Medlingsinformation", "Förhandlingar", "Parter"];

const kolumner = [
  { label: "Avtal", on: true },
  { label: "Parter (AGO/ATO)", on: true },
  { label: "Avtalskonstruktion", on: true },
  { label: "Löneutrymme %", on: true },
  { label: "Anställda", on: false },
  { label: "Branschkod", on: false },
];

const rader: { status: AvtalStatusKod; avtal: string; parter: string }[] = [
  {
    status: "kvarstaende",
    avtal: "Apotek",
    parter: "Almega Tjänsteförbunden / Sveriges Ingenjörer",
  },
  { status: "nytecknat", avtal: "Fastigheter", parter: "Almega Tjänsteförbunden / Ledarna" },
  { status: "kvarstaende", avtal: "Kommunikation", parter: "Almega Tjänsteförbunden / Ledarna" },
  {
    status: "efter-medling",
    avtal: "Hemserviceföretag",
    parter: "Almega Tjänsteförbunden / Kommunal",
  },
  {
    status: "kvarstaende",
    avtal: "Utveckling och tjänster",
    parter: "Almega Tjänsteförbunden / Ledarna",
  },
];

export default function SokPage() {
  // US-11 is performed by the statistics user.
  const roll = rollInfo("statistikanvandare");

  return (
    <AppShell
      roll={roll}
      aiTitle="AI-sökassistent"
      aiIntro="Beskriv ditt urval i naturligt språk så föreslår AI villkor, presentationskolumner och export – som alternativ till sökbyggaren."
      aiReqTag="FR-002"
      aiSuggestions={[
        "Alla sifferlösa avtal i privat sektor giltiga 2026-12-31",
        "Jämför löneutrymme mellan Almega-avtal 2025 och 2026",
        "Vilka avtal nämner arbetstidsförkortning?",
        "Skapa underlag för Eurofound-rapporten",
      ]}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {tabs.map((t, i) => (
          <span
            key={t}
            className={`rounded-md px-5 py-2.5 text-sm font-semibold ${
              i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {t}
          </span>
        ))}
        <ReqTag id="FR-002" />
      </div>

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Panel title="Urvalskriterier">
          <div className="space-y-3">
            <div className="grid gap-3 @xl:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1.4fr)]">
              <Field label="" value="Avtalskonstruktion ▾" />
              <Field label="" value="är ▾" />
              <Field label="" value="1. Lokal lönebildning (sifferlösa avtal) ▾" />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                OCH
              </span>
              <span className="rounded-md bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
                ELLER
              </span>
              <span className="ml-2 text-xs text-muted-foreground">och / eller</span>
            </div>
            <div className="grid gap-3 @xl:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1.4fr)]">
              <Field label="" value="Sektor ▾" />
              <Field label="" value="är ▾" />
              <Field label="" value="Privat ▾" />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                OCH
              </span>
            </div>
            <div className="grid gap-3 @xl:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)_auto]">
              <Field label="" value="Giltig vid tidpunkt ▾" />
              <Field label="" value="per ▾" />
              <Field label="" value="2026-12-31" />
              <div className="self-end">
                <Button variant="outline">+ Lägg till villkor</Button>
              </div>
            </div>
            <div className="grid items-end gap-3 pt-2 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <span className="text-sm font-semibold">
                Fritext i uppladdade dokument och urval
              </span>
              <Field label="" value={'"arbetstidsförkortning"'} />
              <ReqTag id="FR-003" />
            </div>

            <div className="pt-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[0.95rem] font-bold">
                  Handlingstyper i sökningen (fler än två samtidigt)
                </span>
                <ReqTag id="FR-002" />
              </div>
              <div className="flex flex-wrap gap-2">
                {["Löneavtal", "Allmänna villkor", "Pensionsavtal", "Övriga avtal"].map((h, i) => (
                  <span
                    key={h}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                      i < 3 ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {h}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Fullt stöd utan de tekniska hjälpvariabler som dagens sökbyggare kräver (§2.5)
              </p>
            </div>

            <div className="grid items-end gap-3 pt-4 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <Field label="Bokslut – återskapa data per" value="2026-12-31" />
              <Field label="Bokslutsläge" value="Aktiverat ▾" />
              <ReqTag id="FH-003" />
            </div>
          </div>
        </Panel>

        <Panel title="Presentationskolumner">
          <ul className="space-y-2.5">
            {kolumner.map((k) => (
              <li key={k.label} className="flex items-center gap-3 text-[0.95rem]">
                <span
                  className={`inline-block size-4 rounded-sm border ${
                    k.on ? "border-primary bg-primary" : "border-input bg-card"
                  }`}
                />
                {k.label}
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3">
              <Button variant="outline">Spara sökning: &quot;Årsrapport 2026&quot;</Button>
              <ReqTag id="FR-002" />
            </div>
            <div className="w-full">
              <button
                type="button"
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Sök
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Resultat · 143 träffar · 1,8 s · Bokslut per 2026-12-31" tags={["FH-003"]}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-[0.95rem]">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Avtal
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Parter
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Konstruktion
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Löneutr. %
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    Öppna
                  </th>
                </tr>
              </thead>
              <tbody>
                {rader.map((r) => (
                  <tr key={r.avtal} className="border-b border-border/60">
                    <td className="py-3 pr-4">
                      <StatusDot status={statusInfo(r.status)} />
                    </td>
                    <td className="py-3 pr-4">{r.avtal}</td>
                    <td className="py-3 pr-4">{r.parter}</td>
                    <td className="py-3 pr-4">1. Lokal lönebildning</td>
                    <td className="py-3 pr-4">–</td>
                    <td className="py-3">
                      <span className="font-semibold text-primary underline">
                        Visa per 2026-12-31
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">… ytterligare 138 rader</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Enskilt avtal öppnas med de löneavtal och allmänna villkor som var giltiga vid
            tidpunkten
            <ReqTag id="FA-020" />
            <span>· Steg 2: även avtalsområde med tillhörande avtal vid vald tidpunkt</span>
            <ReqTag id="FA-025" />
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <span className="text-sm font-semibold">Exportera:</span>
            <Button variant="outline">Excel</Button>
            <Button variant="outline">CSV</Button>
            <Button variant="outline">JSON</Button>
            <Button variant="outline">Rapportgenerator (Word/PDF)</Button>
            <span className="text-sm text-muted-foreground">
              Sammansatta sökningar över flera handlingstyper – utan hjälpvariabler
            </span>
            <ReqTag id="FR-004 / 013" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Sparade sökningar: Årsrapport 2026 · Eurofound-urval · Sifferlösa avtal privat
            sektor
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
