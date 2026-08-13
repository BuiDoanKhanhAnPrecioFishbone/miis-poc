import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Button, Panel, PageHeading, ReqTag, StatusDot } from "@/components/miis/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MIIS – Startsida för avtalsadministratör" },
      {
        name: "description",
        content:
          "Rollanpassad startsida i MIIS med påminnelser, ofullständiga registreringar, senast registrerade avtal och händelselogg.",
      },
      { property: "og:title", content: "MIIS – Startsida för avtalsadministratör" },
      {
        property: "og:description",
        content:
          "Rollanpassad dashboard för Medlingsinstitutets informationssystem: påminnelser, avtal och händelser.",
      },
    ],
  }),
  component: Start,
});

const paminnelser = [
  "2026-08-20 · Uppdatera Fastigheter – Almega/Unionen",
  "2026-08-28 · Komplettera lönerevision Apotek",
  "2026-09-05 · Kontrollera prolongering Svenska spel",
];

const ofullstandiga = [
  "Kommunikation – Almega/Seko",
  "Utveckling och tjänster – Almega/Unionen",
  "Spel – Almega/Hotell- och Restaurangfacket",
];

const avtal = [
  {
    color: "green" as const,
    namn: "Stål- och metallindustrin – Industriarbetsgivarna/IF Metall",
    tecknades: "2027-03-31",
    loptid: "2027-04-01–2029-03-31",
    status: "Klar",
  },
  {
    color: "red" as const,
    namn: "Spårtrafik – Tågföretagen/Seko",
    tecknades: "2027-05-12",
    loptid: "2027-05-01–2029-04-30",
    status: "Klar",
  },
  {
    color: "blue" as const,
    namn: "Fastigheter – Almega Tjänsteförbunden/Unionen",
    tecknades: "–",
    loptid: "Kvarstående, utlöper 2027-07-31",
    status: "Klar",
  },
  {
    color: "green" as const,
    namn: "Apotek – Almega Tjänsteförbunden/Sveriges Farmaceuter",
    tecknades: "2027-06-02",
    loptid: "2027-06-01–2028-05-31",
    status: "Ofullständig",
  },
];

function Start() {
  return (
    <AppShell
      user="Anna Andersson"
      role="Avtalsadministratör"
      aiIntro="Ställ frågor om påminnelser, ofullständiga registreringar och senast registrerade avtal – som komplement till vyerna på startsidan."
      aiReqTag="FS-001"
      aiSuggestions={[
        "Vilka avtal löper ut inom 90 dagar?",
        "Sammanfatta mina ofullständiga registreringar",
        "Vad innebär märket 2027–2029 för mina avtal?",
        "Visa händelser kopplade till medling senaste månaden",
      ]}
    >
      <PageHeading
        title="Startsida – Avtalsadministratör"
        subtitle="Rollanpassat innehåll enligt tilldelad roll och behörighet (FS-001, NFÅ-003). Inloggad via EFOS-kort, session avslutas efter 30 min inaktivitet (NFÅ-001, NFÅ-002)."
        tags={["FS-001"]}
        action={
          <Link
            to="/registrera"
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            + Ladda upp avtalsprotokoll
          </Link>
        }
      />


      <div className="mb-5 flex items-start gap-3 rounded-lg border border-sand-border bg-sand px-5 py-4">
        <div className="flex-1">
          <p className="text-[0.95rem] text-sand-foreground">
            <span className="font-bold">Märket 2027–2029:</span>{" "}
            <span className="ml-4">
              Kostnadsram 6,4 % · Periodisering 3,2 % / 3,2 % · Tilläggsöverenskommelse:
              deltidspension 0,2 %
            </span>
          </p>
          <p className="mt-1 text-sm text-sand-foreground/80">
            Gäller fr.o.m. 2027-04-01 t.o.m. 2029-03-31 · Registrerad 2027-03-18
          </p>
        </div>
        <ReqTag id="FM-003" />
      </div>

      <div className="grid gap-5 @3xl:grid-cols-2">
        <Panel title="Mina påminnelser" tags={["FA-022"]}>
          <ul className="divide-y divide-border">
            {paminnelser.map((p) => (
              <li key={p} className="py-2.5 text-[0.95rem]">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Påminnelser skickas även som e-post med länk till avtalet
          </p>
          <div className="mt-4">
            <Button variant="outline">Visa alla (12)</Button>
          </div>
        </Panel>

        <Panel title="Ofullständiga registreringar" tags={["FA-021"]}>
          <ul className="divide-y divide-border">
            {ofullstandiga.map((o) => (
              <li key={o} className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-[0.95rem]">{o}</span>
                <span className="rounded-md border border-mint-border bg-mint px-3 py-1 text-[0.7rem] font-bold tracking-wide text-primary">
                  OFULLSTÄNDIG
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Visas i Konjunkturlönerapportens vy med statuskolumn (registrerat / delvis
            registrerat), protokollslänk och vilka avtal som redan exporterats
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="outline">Öppna Konjunkturlönerapportens vy</Button>
            <ReqTag id="FR-008" />
          </div>
        </Panel>

      </div>

      <div className="mt-5">
        <Panel title="Senast registrerade avtal" tags={["FR-012"]}>
          <div className="overflow-x-auto"><table className="w-full min-w-[36rem] text-[0.95rem]">
            <thead>
              <tr className="border-b border-border text-left text-sm font-semibold text-muted-foreground">
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 pr-4 font-semibold">Avtal</th>
                <th className="py-2 pr-4 font-semibold">Tecknades</th>
                <th className="py-2 pr-4 font-semibold">Löptid</th>
                <th className="py-2 font-semibold">Reg.status</th>
              </tr>
            </thead>
            <tbody>
              {avtal.map((a) => (
                <tr key={a.namn} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4">
                    <StatusDot color={a.color} />
                  </td>
                  <td className="py-3 pr-4">{a.namn}</td>
                  <td className="py-3 pr-4">{a.tecknades}</td>
                  <td className="py-3 pr-4">{a.loptid}</td>
                  <td className="py-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <p className="mt-3 text-sm text-muted-foreground">
            Grön = nytecknat utan medling · Röd = tecknat efter medling / medlingskoppling ·
            Blå = kvarstående
          </p>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Senaste händelser" tags={["FH-002"]}>
          <ul className="divide-y divide-border">
            <li className="py-2.5 text-[0.95rem]">
              2027-05-12 14:02 · Avtal tecknat – Spårtrafik (efter medling M-2027/12)
            </li>
            <li className="py-2.5 text-[0.95rem]">
              2027-05-03 09:15 · Medling startar – Spårtrafik, GD-beslut nr 12/2027
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Ur händelseloggen – fullständig logg under Administration
          </p>
        </Panel>
      </div>

    </AppShell>
  );
}
