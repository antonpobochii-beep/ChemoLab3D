import { useState } from "react";
import { Play, Sparkles, Timer, Users } from "lucide-react";
import { QUIZ_TOPICS } from "@/lib/quizBank";
import { cn } from "@/lib/utils";

const COUNTS = [8, 12, 16];
const TIMES = [10, 20, 30];

// Konfiguracja nowego pokoju turnieju.
export default function RoomSetup({ onCreate, busy, error }) {
  const [topic, setTopic] = useState("all");
  const [count, setCount] = useState(12);
  const [seconds, setSeconds] = useState(20);

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Nowy pokój</p>

      <p className="mt-3 text-xs text-muted-foreground">Zakres materiału</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {QUIZ_TOPICS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTopic(item.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              topic === item.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Liczba pytań
          </p>
          <div className="mt-1.5 flex gap-1.5">
            {COUNTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCount(value)}
                className={cn(
                  "flex-1 rounded-xl border px-2 py-2 text-xs transition-colors",
                  count === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="h-3.5 w-3.5" /> Czas na pytanie
          </p>
          <div className="mt-1.5 flex gap-1.5">
            {TIMES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSeconds(value)}
                className={cn(
                  "flex-1 rounded-xl border px-2 py-2 text-xs transition-colors",
                  seconds === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {value} s
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}

      <button
        type="button"
        onClick={() => onCreate({ topic, count, seconds })}
        disabled={busy}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Users className="h-4 w-4" />
        {busy ? "Tworzę pokój…" : "Utwórz pokój i pokaż kod QR"}
        <Play className="h-4 w-4" />
      </button>
    </div>
  );
}