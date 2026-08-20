import type { ReactNode } from "react";

import { AiAssistantProvider } from "@/components/miis/AiAssistant";
import { listAiQueue } from "@/lib/data/ai";

/**
 * The authenticated group's layout, and it exists for one thing: the AI review
 * queue.
 *
 * The queue is a `lib/data/` read and every screen's assistant shows the same
 * one, so it is fetched here — once, on the server — rather than passed as a
 * prop through nineteen pages into `AppShell`. Pages stay exactly as they were.
 *
 * The public entrance is outside this group and gets no assistant, which is
 * correct: §4.1's AI support is for the case officer's registration work, and
 * FR-011's public view has no proposals to approve.
 */
export default async function MiisLayout({ children }: { children: ReactNode }) {
  const queue = await listAiQueue();
  return <AiAssistantProvider queue={queue}>{children}</AiAssistantProvider>;
}
