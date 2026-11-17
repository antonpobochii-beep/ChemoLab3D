import { Suspense, lazy, useEffect, useState } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowRight, Check, RotateCcw, Sparkles, X } from "lucide-react";
import { COMPOUNDS, getCategory } from "@/lib/chemistry";
import { analyzeCompound, latticeIons, terminology } from "@/lib/structure";
import { checkCompoundAnswer, pickRandomCompound } from "@/lib/flashcards";
import { addFlashcardResult } from "@/lib/labStore";
import ChemFormula from "@/components/ChemFormula";
import { cn } from "@/lib/utils";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));

// Fiszka z modelem 3D: wylosowany związek trzeba rozpoznać po nazwie.
export default function MoleculeNameQuiz() {
  const [compound, setCompound] = useState(COMPOUNDS[0]);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setCompound(pickRandomCompound(COMPOUNDS));
  }, []);

  const structure = analyzeCompound(compound);
  const ions = structure.ionic ? latticeIons(compound) : null;
  const terms = terminology(structure.ionic);
  const category = getCategory(compound.category);

  const next = () => {
    setCompound(pickRandomCompound(COMPOUNDS, compound.id));
    setAnswer("");
    setResult(null);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!answer.trim()) return;
    const correct = checkCompoundAnswer(compound, answer);
    setResult(correct ? "correct" : "wrong");
    addFlashcardResult({ compoundId: compound.id, category: compound.category, correct });
    setScore((current) => ({
      correct: current.correct + (correct ? 1 : 0),
      total: current.total + 1,
    }));
  };

  const giveUp = () => {
    setResult("revealed");
    setScore((current) => ({ correct: current.correct, total: current.total + 1 }));
    addFlashcardResult({ compoundId: compound.id, category: compound.category, correct: false });
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <p className="inline-flex items-center gap-2 font-display text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          Rozpoznaj związek po modelu
        </p>
        <span className="text-[11px] text-muted-foreground">
          {score.correct} / {score.total} poprawnych
        </span>
      </div>

      <div className="h-[240px] w-full bg-[radial-gradient(120%_95%_at_50%_0%,hsl(var(--secondary))_0%,hsl(var(--background))_72%)] sm:h-[260px]">
        <ClientOnly fallback={<ViewerFallback />}>
          <Suspense fallback={<ViewerFallback />}>
            {structure.ionic && ions ? (
              <CrystalLattice
                key={compound.id}
                cation={ions.cation}
                anion={ions.anion}
                className="h-full w-full cursor-grab active:cursor-grabbing"
              />
            ) : (
              <MoleculeViewer
                key={compound.id}
                model={compound.model}
                className="h-full w-full cursor-grab active:cursor-grabbing"
              />
            )}
          </Suspense>
        </ClientOnly>
      </div>

      <form onSubmit={submit} className="space-y-3 border-t border-border px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
            {terms.structure}
          </span>
          <span className="rounded-full border border-border px-2.5 py-1">{category.label}</span>
          <span className="rounded-full border border-border px-2.5 py-1">
            pytanie o nazwę systematyczną
          </span>
        </div>

        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Wpisz nazwę lub wzór
          </span>
          <input
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              if (result) setResult(null);
            }}
            placeholder="np. kwas siarkowy(VI)"
            autoComplete="off"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/60"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Check className="h-4 w-4" /> Sprawdź
          </button>
          <button
            type="button"
            onClick={giveUp}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" /> Pokaż odpowiedź
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Następna
          </button>
        </div>

        {result ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              result === "correct"
                ? "border-primary/40 bg-primary/10 text-primary"
                : result === "wrong"
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-background text-muted-foreground"
            )}
          >
            {result === "correct" ? (
              <p className="font-display font-semibold">Dobrze! To {compound.name}.</p>
            ) : result === "wrong" ? (
              <p className="font-display font-semibold">
                Jeszcze nie — spróbuj innej nazwy albo pokaż odpowiedź.
              </p>
            ) : (
              <p className="font-display font-semibold text-foreground">
                To {compound.name} (<ChemFormula text={compound.formula} />).
              </p>
            )}
            <Link
              to="/zwiazki/$compoundId"
              params={{ compoundId: compound.id }}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              Pełna karta związku <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}
      </form>
    </div>
  );
}

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-9 w-9 animate-pulse rounded-full border-2 border-primary/30 bg-primary/10" />
    </div>
  );
}