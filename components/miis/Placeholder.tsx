import type { DatasetName } from "@/lib/domain/dataset";
import type { Lang } from "@/lib/domain/lang";
import type { RoleInfo } from "@/lib/domain/role";
import type { Dictionary } from "@/lib/i18n";
import { AppShell } from "./AppShell";
import { PageHeading, Panel, ReqTag } from "./primitives";

/**
 * Stub view for screens that show their requirement content but are not yet
 * designed. Replace with a real screen via /screen — see docs/03-screen-backlog.md.
 *
 * The requirement IDs are structure and stay in the page; the sentences are copy
 * and come from the dictionary, so the two lists are zipped rather than stored
 * together.
 */
export function PlaceholderPage({
  title,
  epic,
  subtitle,
  features,
  featureIds,
  role,
  dataset,
  lang,
  reqTags,
  i18n,
}: {
  title: string;
  epic: string;
  subtitle: string;
  features: readonly string[];
  featureIds: readonly string[];
  role: RoleInfo;
  dataset: DatasetName;
  lang: Lang;
  reqTags: boolean;
  i18n: Dictionary;
}) {
  return (
    <AppShell role={role} dataset={dataset} lang={lang} reqTags={reqTags}>
      <PageHeading title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-2">
        <Panel title={epic}>
          <ul className="divide-y divide-border">
            {features.map((text, i) => (
              <li key={`${featureIds[i] ?? ""}-${i}`} className="flex items-start gap-3 py-2.5">
                <ReqTag id={featureIds[i] ?? ""} />
                <span className="text-table text-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={i18n.placeholder.aboutTitle}>
          <p className="text-table leading-relaxed text-muted-foreground">
            {i18n.placeholder.aboutBody}
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
