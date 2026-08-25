"use client";

import { IconCheck } from "./icons";
import { useId, useState, type DragEvent } from "react";

import type { Lang } from "@/lib/domain/lang";
import type { PipelineStage, UploadedFile } from "@/lib/domain/upload";
import {
  ACCEPTED_EXTENSIONS,
  fileSizeKb,
  identificationName,
  isAcceptedFile,
  UPLOAD_PIPELINE,
} from "@/lib/domain/upload";
import { decimal } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { Badge, Callout, Panel, Rationale, ReqTag } from "./primitives";

/**
 * US-01, step 1 — the only step of MI's five that the screen did not have.
 *
 * It was missing in a specific and awkward way: the stepper said *" 1. Ladda
 * upp — Klart"* on a screen where nothing had been uploaded, and the `OCR`
 * badge on the protocol pane asserted FAI-003 rather than showing it. Four
 * mandatory requirements are discharged in the gap between choosing a file and
 * seeing a pre-filled form (FD-001, FAI-003, FAI-004, FAI-001), so the gap is
 * where they are demonstrated.
 *
 * The file is real. Its name and size are the ones the officer picked, and the
 * name carries through to FA-018 — *"Agreement name not stated in the protocol:
 * the system uses the file name … as identification input"* — which is a
 * requirement that cannot be shown at all without an upload. The protocol text
 * that follows is prepared sample data, and the annotation layer says so
 * (`demoNote`) rather than letting the demo imply an OCR engine we have not
 * built.
 *
 * Presentational: the stage machine lives in `ProtocolReview`, which owns the
 * stepper and therefore has to know how far along the pipeline is.
 */

const STATE_STYLE = {
  done: "border-ok-border bg-ok-border text-card",
  current: "border-transparent bg-primary text-primary-foreground",
  upcoming: "border-border bg-secondary text-muted-foreground",
} as const;

function stageLabel(d: Dictionary, id: PipelineStage): string {
  return d.registrera.upload.stages[id];
}

/** One pipeline stage. Never colour alone — the state word is beside the mark. */
function StageRow({
  d,
  id,
  req,
  state,
}: {
  d: Dictionary;
  id: PipelineStage;
  req: string;
  state: "done" | "current" | "upcoming";
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {/*
        A completed stage is a filled disc with a tick in it. The tick was lost
        when the emoji sweep replaced ✓ with an icon everywhere else and left
        this one empty, so "done" and "remaining" differed only by the colour of
        an empty ring — which is exactly the failure the icon set exists to
        prevent.
      */}
      <span
        aria-hidden
        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-meta font-bold ${STATE_STYLE[state]}`}
      >
        {state === "done" ? <IconCheck size="sm" /> : state === "current" ? "…" : ""}
      </span>
      <span className={state === "upcoming" ? "text-muted-foreground" : "text-foreground"}>
        {stageLabel(d, id)}
      </span>
      <span className="text-label text-muted-foreground">
        — {d.registrera.stepState[state]}
      </span>
      <ReqTag id={req} />
    </li>
  );
}

export function ProtocolUpload({
  d,
  lang,
  file,
  completed,
  onPick,
}: {
  d: Dictionary;
  lang: Lang;
  /** Null until a file has been chosen; then the pipeline is shown instead. */
  file: UploadedFile | null;
  /** How many pipeline stages have finished. */
  completed: number;
  onPick: (file: UploadedFile | null) => void;
}) {
  const t = d.registrera.upload;
  const inputId = useId();
  const [rejected, setRejected] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  function accept(picked: File | undefined) {
    if (!picked) return;
    if (!isAcceptedFile(picked.name)) {
      setRejected(picked.name);
      onPick(null);
      return;
    }
    setRejected(null);
    onPick({ name: picked.name, bytes: picked.size });
  }

  function drop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    accept(e.dataTransfer.files?.[0]);
  }

  if (file) {
    return (
      <Panel title={t.title} tags={["FD-001", "FAI-003"]}>
        <div className="flex flex-wrap items-center gap-3 border-b border-border pb-3">
          <span className="min-w-0 break-all font-semibold text-foreground">{file.name}</span>
          <span className="text-label tabular-nums text-muted-foreground">
            {t.size(decimal(fileSizeKb(file.bytes), lang))}
          </span>
          {/*
            `ok`, not `ai`. The filled violet badge means "machine-generated and
            not yet approved"; OCR is a fact about the document that has already
            happened. The protocol pane marks it the same way, and two badges
            for one thing were saying different things about it.
          */}
          <Badge tone="ok">{d.registrera.document.ocr}</Badge>
        </div>

        <p aria-live="polite" className="mt-4 text-table">
          {completed >= UPLOAD_PIPELINE.length
            ? t.ready(file.name)
            : t.progress(completed, UPLOAD_PIPELINE.length)}
        </p>

        <ul className="mt-3 space-y-2 text-table">
          {UPLOAD_PIPELINE.map((stage, i) => (
            <StageRow
              key={stage.id}
              d={d}
              id={stage.id}
              req={stage.req}
              state={i < completed ? "done" : i === completed ? "current" : "upcoming"}
            />
          ))}
        </ul>

        {/* FA-018 — the file name is identification input, so it is shown as data. */}
        <p className="mt-4 text-label text-muted-foreground">
          {t.identifiedAs(identificationName(file))} <ReqTag id="FA-018" />
        </p>
      </Panel>
    );
  }

  return (
    <Panel title={t.title} tags={["FD-001", "FAI-003", "FAI-004"]}>
      <p className="mb-4 text-table">{t.intro}</p>

      {/*
        The label is the control: it is what a pointer clicks and what a
        keyboard reaches through the input, so drag-and-drop stays a pure
        enhancement rather than the only way in (2.1.1).
      */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
        className={`rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors ${
          over ? "border-primary bg-ai" : "border-input bg-secondary"
        }`}
      >
        <p className="mb-4 text-table font-semibold">{over ? t.dropActive : t.dropHint}</p>

        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="peer sr-only"
          onChange={(e) => accept(e.target.files?.[0])}
        />
        <label
          htmlFor={inputId}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm border-2 border-primary bg-primary px-5 py-3 font-bold text-primary-foreground transition-colors hover:brightness-110 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-[var(--mi-focus)]"
        >
          {t.choose}
        </label>

        <p className="mt-3 text-label text-muted-foreground">{t.accepts}</p>
      </div>

      {rejected && (
        <div className="mt-4">
          <Callout tone="error" live>
            {t.rejected(rejected)}
          </Callout>
        </div>
      )}

      <h3 className="mb-2 mt-6 font-display text-body font-semibold">{t.pipelineTitle}</h3>
      <ul className="space-y-2 text-table">
        {UPLOAD_PIPELINE.map((stage) => (
          <StageRow key={stage.id} d={d} id={stage.id} req={stage.req} state="upcoming" />
        ))}
      </ul>

      <p className="mt-4 text-label text-muted-foreground">
        {t.fileNameNote} <ReqTag id="FA-018" />
      </p>
      <Rationale>{t.demoNote}</Rationale>
    </Panel>
  );
}
