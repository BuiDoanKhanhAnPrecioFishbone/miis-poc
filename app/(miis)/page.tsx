import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { Button, PageHeading, Panel, ReqTag, StatusDot } from "@/components/miis/primitives";
import { getStartsida } from "@/lib/data/start";
import { registreringsstatusEtikett } from "@/lib/domain/avtal";
import { statusInfo, STATUSFORKLARING } from "@/lib/domain/status";
import { procent } from "@/lib/format";
import { aktivRoll } from "@/lib/session";

export const metadata: Metadata = {
  title: "MIIS – Rollanpassad startsida",
  description:
    "Rollanpassad startsida i MIIS med påminnelser, ofullständiga registreringar, senast registrerade avtal och händelselogg.",
  openGraph: {
    title: "MIIS – Rollanpassad startsida",
    description:
      "Rollanpassad dashboard för Medlingsinstitutets informationssystem: påminnelser, avtal och händelser.",
  },
};

export default async function StartsidaPage() {
  const roll = await aktivRoll();
  const sida = await getStartsida(roll);
  const { marke } = sida;

  const tvaUpp = sida.paneler.filter((p) => p.sort === "lista" || p.sort === "paminnelser");
  const fullbredd = sida.paneler.filter((p) => p.sort === "avtalstabell" || p.sort === "handelser");

  return (
    <AppShell
      roll={sida.roll}
      aiIntro={sida.aiIntro}
      aiSuggestions={sida.aiForslag}
      aiReqTag="FS-001"
    >
      <PageHeading
        title={sida.rubrik}
        subtitle={sida.underrubrik}
        tags={["FS-001"]}
        action={
          sida.primarAtgard ? (
            <Link
              href={sida.primarAtgard.href}
              className="inline-flex min-h-12 items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {sida.primarAtgard.text}
            </Link>
          ) : undefined
        }
      />

      {marke && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-sand-border bg-sand px-5 py-4">
          <div className="flex-1">
            <p className="text-[0.95rem] text-sand-foreground">
              <span className="font-bold">Märket {marke.period}:</span>{" "}
              <span className="ml-4">
                Kostnadsram {procent(marke.kostnadsramProcent)} · Periodisering{" "}
                {marke.periodisering}
                {marke.tillaggsoverenskommelser.length > 0 &&
                  ` · Tilläggsöverenskommelse: ${marke.tillaggsoverenskommelser.join(", ")}`}
              </span>
            </p>
            <p className="mt-1 text-sm text-sand-foreground/80">
              Gäller fr.o.m. {marke.giltigFrom} t.o.m. {marke.giltigTom} · Registrerad{" "}
              {marke.registreradDatum}
            </p>
          </div>
          <ReqTag id="FM-003" />
        </div>
      )}

      <div className="grid gap-5 @3xl:grid-cols-2">
        {tvaUpp.map((panel) => (
          <Panel key={panel.titel} title={panel.titel} tags={panel.reqTaggar}>
            <ul className="divide-y divide-border">
              {panel.sort === "paminnelser"
                ? panel.poster.map((p) => (
                    <li key={p.id} className="py-2.5 text-[0.95rem]">
                      {p.datum} · {p.text}
                    </li>
                  ))
                : panel.poster.map((p) => (
                    <li
                      key={p.text}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <span className="text-[0.95rem]">{p.text}</span>
                      {p.badge && (
                        <span className="shrink-0 rounded-md border border-mint-border bg-mint px-3 py-1 text-[0.7rem] font-bold tracking-wide text-primary">
                          {p.badge}
                        </span>
                      )}
                    </li>
                  ))}
            </ul>
            {panel.fotnot && (
              <p className="mt-3 text-sm text-muted-foreground">{panel.fotnot}</p>
            )}
            {panel.knapp && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {panel.knapp.href ? (
                  <Link
                    href={panel.knapp.href}
                    className="inline-flex min-h-12 items-center rounded-sm border-2 border-primary px-5 py-3 text-[0.95rem] font-bold text-primary transition-colors hover:bg-secondary"
                  >
                    {panel.knapp.text}
                  </Link>
                ) : (
                  <Button variant="outline">{panel.knapp.text}</Button>
                )}
                {panel.knapp.reqTag && <ReqTag id={panel.knapp.reqTag} />}
              </div>
            )}
          </Panel>
        ))}
      </div>

      {fullbredd.map((panel) => (
        <div key={panel.titel} className="mt-5">
          <Panel title={panel.titel} tags={panel.reqTaggar}>
            {panel.sort === "avtalstabell" ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-[0.95rem]">
                    <thead>
                      <tr className="border-b border-border text-left text-sm font-semibold text-muted-foreground">
                        <th scope="col" className="py-2 pr-4 font-semibold">
                          Status
                        </th>
                        <th scope="col" className="py-2 pr-4 font-semibold">
                          Avtal
                        </th>
                        <th scope="col" className="py-2 pr-4 font-semibold">
                          Tecknades
                        </th>
                        <th scope="col" className="py-2 pr-4 font-semibold">
                          Löptid
                        </th>
                        <th scope="col" className="py-2 font-semibold">
                          Reg.status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {panel.rader.map((rad) => (
                        <tr key={rad.id} className="border-b border-border/60 last:border-0">
                          <td className="py-3 pr-4">
                            <StatusDot status={statusInfo(rad.status)} />
                          </td>
                          <td className="py-3 pr-4">{rad.namn}</td>
                          <td className="py-3 pr-4">{rad.teckningsdatum ?? "–"}</td>
                          <td className="py-3 pr-4">{rad.loptid}</td>
                          <td className="py-3">
                            {registreringsstatusEtikett(rad.registreringsstatus)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{STATUSFORKLARING}</p>
              </>
            ) : (
              <>
                <ul className="divide-y divide-border">
                  {panel.poster.map((h) => (
                    <li key={h.id} className="py-2.5 text-[0.95rem]">
                      {h.tidpunkt} · {h.text}
                    </li>
                  ))}
                </ul>
                {panel.fotnot && (
                  <p className="mt-3 text-sm text-muted-foreground">{panel.fotnot}</p>
                )}
              </>
            )}
          </Panel>
        </div>
      ))}
    </AppShell>
  );
}
