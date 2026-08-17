import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { EmptyState, PageHeading, Panel, ReqTag, StatusDot } from "@/components/miis/primitives";
import { listMediationCases } from "@/lib/data/mediation";
import { caseNumber, MEDIATION_TYPE_LABEL } from "@/lib/domain/mediation";
import { roleInfo } from "@/lib/domain/role";
import { statusInfo } from "@/lib/domain/status";
import { activeDataset } from "@/lib/session";

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

export default async function MediationListPage() {
  const [cases, dataset] = await Promise.all([listMediationCases(), activeDataset()]);
  const role = roleInfo("mediation-admin");

  return (
    <AppShell role={role} dataset={dataset}>
      <PageHeading
        title="Medling"
        subtitle="Medlingsärenden skapas automatiskt vid uppladdat GD-beslut"
        tags={["FF-006", "FF-007"]}
      />
      <Panel title="Medlingsärenden">
        {cases.length === 0 ? (
          <EmptyState text="Inga medlingsärenden registrerade. Ärenden skapas när ett GD-beslut laddas upp." />
        ) : (
          <>
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
                  {cases.map((c) => (
                    <tr key={c.id} className="border-b border-border/60">
                      <td className="py-3 pr-4">
                        <StatusDot
                          status={statusInfo(c.ongoing ? "after-mediation" : "remaining")}
                        />
                      </td>
                      <td className="py-3 pr-4 font-semibold text-primary">
                        <Link href={`/medling/${c.id}`} className="underline-offset-2 hover:underline">
                          {caseNumber(c.id)}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">{c.name}</td>
                      <td className="py-3 pr-4">{MEDIATION_TYPE_LABEL[c.type]}</td>
                      <td className="py-3 pr-4">
                        {c.dgDecision.number} · {c.dgDecision.date}
                      </td>
                      <td className="py-3">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              Öppna M-2027/12 för den kravannoterade vyn för US-07 <ReqTag id="FF-008" />
            </p>
          </>
        )}
      </Panel>
    </AppShell>
  );
}
