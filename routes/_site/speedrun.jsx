import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Gauge, RotateCcw, Trophy } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { COMPOUNDS } from "@/lib/chemistry";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/speedrun")({
  component: SpeedrunPage,
  head: () => ({
    meta: [
      { title: "Speedrun IUPAC — wyzwanie na czas 60 s | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Tryb gry: w 60 sekund rozpoznaj jak najwięcej związków nieorganicznych po wzorze i nazwie IUPAC. Zapisz swój rekord.",
      },
    ],
  }),
});

const BEST_KEY = "chem-lab-speedrun-best";
const ROUND_SIZE = 5;

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

function buildDeck() {
  return shuffle(COMPOUNDS)
    .slice(0, ROUND_SIZE)
    .map((compound) => {
      const others = shuffle(COMPOUNDS.filter((item) => item.id !== compound.id)).slice(0, 2);
      const options = shuffle([compound, ...others]);
      return { compound, options };
    });
}

function readBest() {
  if (typeof window === "undefined") return null;
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || null;
  } catch {
    return null;
  }
}

function SpeedrunPage() {
  const [phase, setPhase] = useState("idle");
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [picked, setPicked] = useState(null);
  const [best, setBest] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setBest(readBest());
  }, []);

  useEffect(() => {
    if (phase !== "play") return undefined;
    const timer = setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) return 0;
        return value - 1;
      });
      setElapsed((value) => value + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const finish = useCallback(
    (points) => {
      setPhase("done");
      playSound("success");
      const stored = readBest();
      if (!stored || points > stored) {
        setBest(points);
        try {
          window.localStorage.setItem(BEST_KEY, String(points));
        } catch {
          /* brak dostępu do localStorage */
        }
      }
    },
    []
  );

  useEffect(() => {
    if (phase === "play" && timeLeft === 0) finish(score);
  }, [phase, timeLeft, score, finish]);

  const start = () => {
    setDeck(buildDeck());
    setIndex(0);
    setScore(0);
    setTimeLeft(60);
    setElapsed(0);
    setPicked(null);
    setPhase("play");
    playSound("click");
  };

  const answer = (option) => {
    if (picked) return;
    const current = deck[index];
    const correct = option.id === current.compound.id;
    setPicked(option.id);
    if (correct) {
      setScore((value) => value + 1);
      playSound("success");
    } else {
      setTimeLeft((value) => Math.max(0, value - 3));
      playSound("error");
    }

    window.setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= deck.length) {
        finish(score + (correct ? 1 : 0));
      } else {
        setIndex(nextIndex);
        setPicked(null);
      }
    }, 700);
  };

  const current = deck[index];
  const progress = useMemo(
    () => (current ? Math.min(100, ((index + (picked ? 1 : 0)) / deck.length) * 100) : 0),
    [current, index, picked, deck.length]
  );

  return (
    <PageShell
      eyebrow={
        <>
          <Gauge className="h-3.5 w-3.5 text-primary" /> Tryb gry
        </>
      }
      title="Speedrun IUPAC — 60 sekund"
      lead="Pięć losowych związków, jedna minuta i trzy odpowiedzi do wyboru. Błędna odpowiedź kosztuje 3 sekundy, poprawna daje punkt."
      actions={
        best !== null ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Trophy className="h-4 w-4" /> Rekord: {best} pkt
          </span>
        ) : null
      }
    >
      {phase === "idle" ? (
        <div className="rounded-[1.75rem] border border-border bg-card p-8 text-center shadow-panel">
          <p className="font-display text-2xl font-semibold">Gotowy na wyzwanie?</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Start uruchamia zegar. Za każdą poprawną odpowiedź dostajesz punkt, za błędną tracisz
            3 sekundy. Rundę kończy pięć związków albo koniec czasu.
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
          >
            <Clock className="h-4 w-4" /> Start 60 s
          </button>
        </div>
      ) : null}

      {phase === "play" && current ? (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4">
            <span className="font-display text-sm text-muted-foreground">
              Pytanie {index + 1}/{deck.length}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Punkty: <strong className="font-display text-foreground">{score}</strong>
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-display text-sm",
                  timeLeft <= 10
                    ? "bg-destructive/15 text-destructive"
                    : "bg-primary/10 text-primary"
                )}
              >
                <Clock className="h-4 w-4" /> {timeLeft} s
              </span>
            </div>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card p-6 text-center shadow-panel sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Rozpoznaj związek
            </p>
            <p className="mt-3 font-display text-5xl font-semibold tracking-tight text-primary text-glow">
              <ChemFormula text={current.compound.formula} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {current.compound.residue?.name ? `Reszta: ${current.compound.residue.name}` : null}
            </p>

            <div className="mt-6 grid gap-2.5">
              {current.options.map((option) => {
                const isCorrect = option.id === current.compound.id;
                const isPicked = picked === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => answer(option)}
                    disabled={Boolean(picked)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      !picked && "border-border bg-background hover:border-primary/40 hover:text-primary",
                      picked && isCorrect && "border-primary bg-primary/15 text-primary",
                      picked && isPicked && !isCorrect && "border-destructive bg-destructive/15"
                    )}
                  >
                    {option.name}
                    {option.aka ? (
                      <span className="ml-2 text-xs text-muted-foreground">({option.aka})</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="rounded-[1.75rem] border border-border bg-card p-8 text-center shadow-panel">
          <Trophy className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-display text-3xl font-semibold">
            {score} / {deck.length} pkt
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Czas rundy: {elapsed} s · rekord: {best ?? score} pkt
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4" /> Jeszcze raz
            </button>
            <Link
              to="/quizy"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Pełny quiz
            </Link>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}