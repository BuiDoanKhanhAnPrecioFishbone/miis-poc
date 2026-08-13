import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Panel, PageHeading, ReqTag, StatusDot } from "@/components/miis/AppShell";

export const Route = createFileRoute("/medling/")({
  head: () => ({
    meta: [
      { title: "MIIS – Medlingsärenden och GD-beslut" },
      {
        name: "description",
        content:
          "Översikt över pågående och avslutade medlingsärenden, GD-beslut, tillsatta medlare och medlingsresultat.",
      },
      { property: "og:title", content: "MIIS – Medlingsärenden och GD-beslut" },
      {
        property: "og:description",
        content: "Pågående medlingar, GD-beslut och medlingsresultat i Medlingsinstitutets informationssystem.",
      },
    ],
  }),
  component: Medling,
});

const arenden = [
  {
    id: "M-2027/12",
    namn: "Spårtrafik – Tågföretagen / Seko",
    typ: "Särskild medling",
    beslut: "GD-beslut nr 12/2027 · 2027-05-03",
    status: "Pågående",
    color: "red" as const,
  },
  {
    id: "M-2027/09",
    namn: "Hemserviceföretag – Almega / Kommunal",
    typ: "Särskild medling",
    beslut: "GD-beslut nr 9/2027 · 2027-04-14",
    status: "Avslutad – avtal tecknat",
    color: "red" as const,
  },
  {
    id: "M-2027/04",
    namn: "Bemanning – Kompetensföretagen / Unionen",
    typ: "Fast medling (lokal tvist)",
    beslut: "GD-beslut nr 4/2027 · 2027-02-28",
    status: "Avslutad",
    color: "blue" as const,
  },
];

function Medling() {
  return (
    <AppShell user="Per Persson" role="Medlingsadministratör">
      <PageHeading
        title="Medling"
        subtitle="Medlingsärenden skapas automatiskt vid uppladdat GD-beslut"
        tags={["FF-006", "FF-007"]}
      />
      <Panel title="Medlingsärenden">
        <div className="overflow-x-auto"><table className="w-full min-w-[36rem] text-[0.95rem]">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">Status</th>
              <th className="py-2 pr-4 font-semibold">Ärende</th>
              <th className="py-2 pr-4 font-semibold">Avtalsområde / parter</th>
              <th className="py-2 pr-4 font-semibold">Typ</th>
              <th className="py-2 pr-4 font-semibold">GD-beslut</th>
              <th className="py-2 font-semibold">Läge</th>
            </tr>
          </thead>
          <tbody>
            {arenden.map((a) => (
              <tr key={a.id} className="border-b border-border/60">
                <td className="py-3 pr-4">
                  <StatusDot color={a.color} />
                </td>
                <td className="py-3 pr-4 font-semibold text-primary">
                  <Link to="/medling/arende" className="underline-offset-2 hover:underline">
                    {a.id}
                  </Link>
                </td>
                <td className="py-3 pr-4">{a.namn}</td>
                <td className="py-3 pr-4">{a.typ}</td>
                <td className="py-3 pr-4">{a.beslut}</td>
                <td className="py-3">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          Öppna M-2027/12 för den kravannoterade vyn för US-07 <ReqTag id="FF-008" />
        </p>
      </Panel>
    </AppShell>
  );
}
