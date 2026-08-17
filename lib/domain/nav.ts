/**
 * The main menu.
 *
 * The structure mirrors **MI's own functional modules** from Appendix 1 §4.3,
 * quoted in spec §5.1: agreement registration · party management · document
 * management · search & reports · AI-assisted registration · change log ·
 * mediation management (mediators and party meetings). It is deliberately not a
 * list of requirement Epics — the menu is the customer's mental model of their
 * own system, not our index of the specification.
 *
 * Two consequences worth keeping:
 *
 * - Registration is an **action, not a place**. It is reached from the primary
 *   button on the start page; `/registrera` has no menu entry.
 * - Mediators and party meetings sit **under Mediation**, because MI groups them
 *   as one module ("mediation management (mediators and party meetings)").
 *
 * Labels are not here — they are interface copy and live in `lib/i18n/`, keyed
 * by `NavId`. This file only knows structure and routes.
 *
 * Pure domain — no imports beyond sibling types, no I/O.
 */

export type NavId =
  | "start"
  | "avtal"
  | "parter"
  | "forhandlingar"
  | "medling"
  | "partstraffar"
  | "medlare"
  | "dokument"
  | "rapporter"
  | "sok"
  | "market"
  | "administration"
  | "anvandare";

/** Route paths stay Swedish — they are user-facing URLs in a Swedish authority's system. */
export const NAV_HREF: Record<NavId, string> = {
  start: "/",
  avtal: "/avtal",
  parter: "/parter",
  forhandlingar: "/forhandlingar",
  medling: "/medling",
  partstraffar: "/partstraffar",
  medlare: "/medlare",
  dokument: "/dokument",
  rapporter: "/rapporter",
  sok: "/sok",
  market: "/market",
  administration: "/administration",
  anvandare: "/administration/anvandare",
};

export interface NavNode {
  id: NavId;
  children?: readonly NavId[];
}

/** The canonical order. A role's menu is this list, filtered — never reordered. */
export const NAV_TREE: readonly NavNode[] = [
  { id: "start" },
  { id: "avtal" },
  { id: "parter" },
  { id: "forhandlingar" },
  { id: "medling", children: ["partstraffar", "medlare"] },
  { id: "dokument" },
  { id: "rapporter" },
  { id: "sok" },
  { id: "market" },
  { id: "administration", children: ["anvandare"] },
] as const;

/**
 * The menu a role actually sees.
 *
 * NFÅ-003 is role-based authorisation. A statistics user who can see an
 * "Administration" item is a screen that contradicts the requirement it claims
 * to satisfy, so the menu is filtered rather than merely guarded.
 *
 * A parent is kept when the role has the parent itself or any of its children;
 * a parent granted only through a child renders as a heading for that child.
 */
export function navFor(allowed: readonly NavId[]): NavNode[] {
  const has = new Set(allowed);
  return NAV_TREE.flatMap((node) => {
    const children = (node.children ?? []).filter((c) => has.has(c));
    if (!has.has(node.id) && children.length === 0) return [];
    return [children.length > 0 ? { id: node.id, children } : { id: node.id }];
  });
}

/** True when the role reaches this node only as a container for its children. */
export function isHeadingOnly(node: NavNode, allowed: readonly NavId[]): boolean {
  return !allowed.includes(node.id) && (node.children?.length ?? 0) > 0;
}
