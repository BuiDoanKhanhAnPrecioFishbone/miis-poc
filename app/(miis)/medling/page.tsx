import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { PageHeading, Panel, ReqTag, StatusDot } from "@/components/miis/primitives";
import { listMedlingsarenden } from "@/lib/data/medling";
import { arendenummer, MEDLINGSTYP_ETIKETT } from "@/lib/domain/medling";
import { rollInfo } from "@/lib/domain/roll";
import { statusInfo } from "@/lib/domain/status";

export const metadata: Metadata = {
  title: "MIIS – Medlingsärenden och GD-beslut",
  description:
    "Översikt över pågående och avslutade medlingsärenden, GD-beslut, tillsatta medlare och medlingsresultat.",
  openGraph: {
    title: "MIIS – Medlingsärenden och GD-beslut",
    description:
      "Pågående medlingar, GD-beslut och medlingsresultat i Medlingsinstitutets informationssystem.",
  },
};

export default async function MedlingPage() {
  const arenden = await listMedlingsarenden();
  const roll = rollInfo("medlingsadministrator");

  return (
    <AppShell roll={roll}>
      <PageHeading
        title="Medling"
        subtitle="Medlingsärenden skapas automatiskt vid uppladdat GD-beslut"
        tags={["FF-006", "FF-007"]}
      />
      <Panel title="Medlingsärenden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-[0.95rem]">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Status
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Ärende
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Avtalsområde / parter
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Typ
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  GD-beslut
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Läge
                </th>
              </tr>
            </thead>
            <tbody>
              {arenden.map((a) => (
                <tr key={a.id} className="border-b border-border/60">
                  <td className="py-3 pr-4">
                    <StatusDot
                      status={statusInfo(a.typ === "fast" ? "kvarstaende" : "efter-medling")}
                    />
                  </td>
                  <td className="py-3 pr-4 font-semibold text-primary">
                    <Link href={`/medling/${a.id}`} className="underline-offset-2 hover:underline">
                      {arendenummer(a.id)}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{a.namn}</td>
                  <td className="py-3 pr-4">{MEDLINGSTYP_ETIKETT[a.typ]}</td>
                  <td className="py-3 pr-4">
                    {a.gdBeslut.nummer} · {a.gdBeslut.datum}
                  </td>
                  <td className="py-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          Öppna M-2027/12 för den kravannoterade vyn för US-07 <ReqTag id="FF-008" />
        </p>
      </Panel>
    </AppShell>
  );
}
