import { segment, type Watchword } from "@/lib/domain/watchword";

/**
 * FAI-004's marking, as a component.
 *
 * `<mark>` rather than a styled span: the element means "marked for reference
 * in another context", which is exactly what a watchword hit is, and a screen
 * reader announces it. Sand rather than a status hue, because a watchword hit
 * is attention, not an FR-012 agreement status, and those three colours stay
 * reserved (CLAUDE.md rule 2).
 */
export function Marked({ text, watchwords }: { text: string; watchwords: readonly Watchword[] }) {
  const parts = segment(text, watchwords);
  if (parts.length === 1 && !parts[0]!.hit) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        part.hit ? (
          <mark key={i} className="bg-sand px-1 text-sand-foreground">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}
