import type { RoleInfo } from "@/lib/domain/role";
import type { DatasetName } from "@/lib/domain/dataset";
import { AppShell } from "./AppShell";
import { PageHeading, Panel, ReqTag } from "./primitives";

/**
 * Stub view for screens that show their requirement content but are not yet
 * designed. Replace with a real screen via /screen — see docs/03-screen-backlog.md.
 */
export function PlaceholderPage({
  title,
  epic,
  subtitle,
  features,
  role,
  dataset,
}: {
  title: string;
  epic: string;
  subtitle: string;
  features: { id: string; text: string }[];
  role: RoleInfo;
  dataset: DatasetName;
}) {
  return (
    <AppShell role={role} dataset={dataset}>
      <PageHeading title={title} subtitle={subtitle} />
      <div className="grid gap-5 @3xl:grid-cols-2">
        <Panel title={epic}>
          <ul className="divide-y divide-border">
            {features.map((f) => (
              <li key={`${f.id}-${f.text}`} className="flex items-start gap-3 py-2.5">
                <ReqTag id={f.id} />
                <span className="text-sm text-foreground">{f.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Om vyn i demon">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Denna vy ingår i menystrukturen som speglar kravspecifikationens epics och
            features. I demoversionen är vyerna för Startsida, US-01 (registrering av
            avtalsprotokoll), US-07 (medlingsärende från GD-beslut) och US-11 (sökbyggaren)
            fullt utritade. Övriga vyer visar sitt kravinnehåll och detaljeras i nästa
            skissomgång.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
