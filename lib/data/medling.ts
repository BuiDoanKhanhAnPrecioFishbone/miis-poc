/**
 * Data access for mediation — THE SEAM.
 * Week 1 reads from lib/mock/. Week 2 talks to Supabase; no page changes.
 */

import type { Handelse } from "@/lib/domain/handelse";
import type { Medlare, Medlingsarende } from "@/lib/domain/medling";
import { MEDLARE, MEDLINGSARENDEN, MEDLINGSDETALJ } from "@/lib/mock/medling";
import { MEDLINGSHANDELSER } from "@/lib/mock/ovrigt";

export async function listMedlingsarenden(): Promise<Medlingsarende[]> {
  return MEDLINGSARENDEN;
}

export interface MedlingsarendeDetalj {
  arende: Medlingsarende;
  kopplade: { namn: string; text: string }[];
  beslutsstod: { ovrigaParter: string; tidigareMedlingar: string };
  dokument: string;
  handelser: Handelse[];
}

export async function getMedlingsarende(id: string): Promise<MedlingsarendeDetalj | null> {
  const arende = MEDLINGSARENDEN.find((m) => m.id === id);
  if (!arende) return null;

  const detalj = MEDLINGSDETALJ[id];
  return {
    arende,
    kopplade: detalj?.kopplade ?? [],
    beslutsstod: detalj?.beslutsstod ?? { ovrigaParter: "–", tidigareMedlingar: "–" },
    dokument: detalj?.dokument ?? arende.gdBeslut.dokument,
    handelser: MEDLINGSHANDELSER.filter((h) => arende.avtalIds.includes(h.avtalId ?? "")),
  };
}

export async function listMedlare(): Promise<Medlare[]> {
  return MEDLARE;
}

export async function getMedlare(id: string): Promise<Medlare | null> {
  return MEDLARE.find((m) => m.id === id) ?? null;
}
