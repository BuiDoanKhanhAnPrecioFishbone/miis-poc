/**
 * Mock särskilda frågor — Bilaga 3 §3.11, in MI's own three-question shape.
 *
 * These are not the working groups in `./workingGroups.ts`, and the difference
 * is the reason both exist. A working group is a body the parties set up with a
 * name and a reporting date. A särskild fråga is a question the agreement text
 * itself answers — MI registers the question, whether it is a gender-equality
 * question, the clause that settles it, and a comment.
 *
 * An agreement routinely has one and not the other: A-009 below settles two
 * questions in the agreement text and appoints nobody, while A-002 does both.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { SpecialQuestions } from "@/lib/domain/agreement";

export const SPECIAL_QUESTIONS: SpecialQuestions[] = [
  {
    agreementId: "A-001",
    year: "2027",
    questions: [
      {
        number: 1,
        question: "Deltidspension – avsättningens storlek och uttagsregler",
        genderEquality: false,
        agreementText:
          "Avsättningen till deltidspension höjs med 0,2 procentenheter från och med 2027-04-01. " +
          "Uttag får ske tidigast vid 62 års ålder efter överenskommelse med arbetsgivaren.",
        comment: "Tilläggsöverenskommelse utöver kostnadsramen, se Märket 2027–2029.",
      },
      {
        number: 2,
        question: "Lönekartläggning och osakliga löneskillnader",
        genderEquality: true,
        agreementText:
          "Lokala parter ska årligen gå igenom resultatet av lönekartläggningen och redovisa " +
          "vilka åtgärder som vidtagits för att åtgärda osakliga löneskillnader mellan kvinnor och män.",
        comment: "Samma skrivning som i föregående avtalsperiod, oförändrad.",
      },
      {
        number: 3,
        question: "Arbetstidsförkortning – avsättning till arbetstidskonto",
        genderEquality: false,
        agreementText:
          "Avsättningen till arbetstidskonto uppgår till 1,7 procent av lönesumman. " +
          "Den anställde väljer mellan ledig tid, kontant utbetalning och pensionspremie.",
      },
    ],
    comment: "Registrerat från förhandlingsprotokoll 2027-03-31, punkterna 6–8.",
  },
  {
    agreementId: "A-002",
    year: "2027",
    questions: [
      {
        number: 1,
        question: "Föräldralön vid längre ledighet",
        genderEquality: true,
        agreementText:
          "Föräldralön utges under högst 180 dagar per födsel, mot tidigare 150 dagar.",
        comment: "Parterna hänvisar till jämställdhetsskäl i protokollet.",
      },
      {
        number: 2,
        question: "Beredskapsersättning vid nattarbete",
        genderEquality: false,
        agreementText: "Ersättningen räknas upp med samma tal som lönerna, 3,2 procent per år.",
      },
    ],
  },
  {
    /*
      A question registered in slot 3 with slot 2 empty. It happens — the slots
      are MI's own numbering and an officer fills the one the protocol point
      belongs to. `orderedQuestions` must not close the gap.
    */
    agreementId: "A-009",
    year: "2027",
    questions: [
      {
        number: 1,
        question: "Lägstlöner för anställda utan yrkesvana",
        genderEquality: false,
        agreementText:
          "Lägstlönen för arbetstagare utan yrkesvana räknas upp med samma tal som lönerna " +
          "och revideras 2027-05-01. Beloppen redovisas under Lägstalöner per yrkesgrupp.",
      },
      {
        number: 3,
        question: "Heltid som norm vid nyanställning",
        genderEquality: true,
        agreementText:
          "Nyanställning ska ske på heltid om inte verksamhetens behov eller arbetstagarens " +
          "egen önskan motiverar annat. Deltidsanställda har företräde till högre sysselsättningsgrad.",
        comment:
          "Central fråga i avtalsområdet — 6 100 årsarbetare på 9 400 anställda.",
      },
    ],
    comment: "Ingen arbetsgrupp tillsatt; frågorna regleras i avtalstexten.",
  },
];
