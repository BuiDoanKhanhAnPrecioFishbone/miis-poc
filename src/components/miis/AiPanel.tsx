import { useState } from "react";
import { ReqTag } from "./AppShell";

type Message = { role: "user" | "ai"; text: string };

export function AiPanelTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={false}
      className="flex min-h-12 items-center gap-2 rounded-sm border-2 border-ai-border bg-ai px-5 py-3 text-[0.95rem] font-bold text-ai-foreground transition-colors hover:bg-ai/80"
    >
      <span aria-hidden>✦</span> Öppna AI-assistent
    </button>
  );
}

export function AiPanel({
  title,
  intro = "Ställ frågor i naturligt språk om avtal, medlingsärenden, parter och märket. AI:n är ett komplement till formulären och sökbyggaren.",
  suggestions = [
    "Sammanfatta läget för mina pågående ärenden",
    "Vilka avtal löper ut inom 90 dagar?",
    "Vad säger märket för innevarande avtalsperiod?",
  ],
  reqTag,
  onClose,
}: {
  title?: string | undefined;
  intro?: string | undefined;
  suggestions?: string[] | undefined;
  reqTag?: string | undefined;
  onClose: () => void;
}) {
  const heading = title ?? "AI-assistent";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      {
        role: "ai",
        text: "AI-förslag (demo): jag tolkar frågan och föreslår ett urval baserat på registrerade avtal, medlingsärenden och märket. Resultatet visas som ett komplement – kontrollera alltid mot källdokumenten innan beslut.",
      },
    ]);
    setInput("");
  };

  return (
    <aside
      aria-label={heading}
      className="fixed inset-y-0 right-0 z-40 flex w-[360px] max-w-[92vw] flex-col border-l-4 border-[var(--mi-sand-500)] bg-card shadow-card xl:sticky xl:top-0 xl:z-auto xl:h-screen xl:w-[380px] xl:max-w-none xl:shrink-0"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border bg-primary px-5 py-4 text-primary-foreground">
        <div>
          <h2 className="font-display text-lg font-semibold">{heading}</h2>
          <p className="text-sm opacity-85">Komplement eller alternativ till formulären</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Stäng AI-assistent"
          className="rounded-sm border-2 border-primary-foreground/40 px-3 py-1 text-sm font-bold"
        >
          Stäng
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <div className="rounded-sm border border-ai-border bg-ai p-3 text-sm text-ai-foreground">
          {intro}
          {reqTag && (
            <div className="mt-2">
              <ReqTag id={reqTag} />
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-bold">Förslag på frågor</p>
          <ul className="space-y-2">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => send(s)}
                  className="w-full rounded-sm border border-border bg-secondary px-3 py-2 text-left text-sm text-secondary-foreground transition-colors hover:bg-mint"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-6 rounded-sm bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                : "mr-6 rounded-sm border border-ai-border bg-ai px-3 py-2 text-sm text-ai-foreground"
            }
          >
            <span className="mb-1 block text-[0.7rem] font-bold tracking-wide">
              {m.role === "user" ? "DU" : "AI-FÖRSLAG"}
            </span>
            {m.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border px-5 py-4"
      >
        <label htmlFor="ai-fraga" className="mb-1 block text-sm font-bold">
          Fråga AI
        </label>
        <textarea
          id="ai-fraga"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Skriv din fråga i naturligt språk…"
          className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="mt-2 min-h-12 w-full rounded-sm bg-primary px-5 py-3 text-[0.95rem] font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
        >
          Skicka
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          Demo – AI-svar är simulerade och ska alltid granskas av handläggare.
        </p>
      </form>
    </aside>
  );
}
