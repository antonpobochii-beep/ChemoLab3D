import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import ChemFormula from "@/components/ChemFormula";
import { getCompound } from "@/lib/chemistry";
import { analyzeCompound, latticeIons } from "@/lib/structure";
import { cn } from "@/lib/utils";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));

const Loading = () => (
  <div className="h-full w-full animate-pulse rounded-[1.35rem] bg-secondary/40" />
);

// Pytanie turnieju: model 3D (lub opis) i cztery odpowiedzi — wspólne dla hosta i graczy.
export default function QuestionStage({
  question,
  selectedId,
  correctId,
  counts,
  disabled,
  onSelect,
  showResult,
}) {
  const compound = getCompound(question.compoundId);
  const ionic = compound ? analyzeCompound(compound).ionic : false;
  const ions = compound && ionic ? latticeIons(compound) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="rounded-[1.6rem] border border-border bg-[radial-gradient(120%_110%_at_50%_0%,hsl(var(--secondary)),hsl(var(--background))_75%)] p-2.5">
        {question.showModel ? (
          <div className="h-[230px] w-full overflow-hidden rounded-[1.3rem] sm:h-[290px]">
            <ClientOnly fallback={<Loading />}>
              <Suspense fallback={<Loading />}>
                {ions ? (
                  <CrystalLattice
                    key={question.id}
                    cation={ions.cation}
                    anion={ions.anion}
                    className="h-full w-full cursor-grab active:cursor-grabbing"
                  />
                ) : (
                  <MoleculeViewer
                    key={question.id}
                    model={compound?.model}
                    className="h-full w-full cursor-grab active:cursor-grabbing"
                  />
                )}
              </Suspense>
            </ClientOnly>
          </div>
        ) : (
          <div className="rounded-[1.3rem] bg-background/60 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Opis związku
            </p>
            <p className="mt-2 text-sm leading-relaxed">{question.description}</p>
            <ul className="mt-3 space-y-1">
              {(question.uses ?? []).map((use) => (
                <li key={use} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {use}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <p className="font-display text-base leading-snug sm:text-lg">{question.prompt}</p>
        <div className="mt-3 grid gap-2">
          {question.options.map((option) => {
            const isAnswer = showResult && option.id === correctId;
            const picked = option.id === selectedId;
            const wrongPick = showResult && picked && option.id !== correctId;
            const count = counts?.[option.id] ?? 0;
            const totalVotes = counts ? Object.values(counts).reduce((sum, value) => sum + value, 0) : 0;
            const share = totalVotes ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect?.(option.id)}
                disabled={disabled || !onSelect}
                className={cn(
                  "relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                  !showResult && !picked && "border-border bg-card hover:border-primary/40 hover:text-primary",
                  picked && !showResult && "border-primary bg-primary/10 text-primary",
                  isAnswer && "border-primary bg-primary/10 text-primary",
                  wrongPick && "border-destructive/60 bg-destructive/10 text-destructive",
                  showResult && !isAnswer && !picked && "border-border/60 bg-card/60 text-muted-foreground"
                )}
              >
                {counts ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 bg-primary/10"
                    style={{ width: `${share}%` }}
                  />
                ) : null}
                <span className="relative font-display">
                  {question.formulaOptions ? <ChemFormula text={option.label} /> : option.label}
                </span>
                {counts ? (
                  <span className="relative shrink-0 text-[11px] text-muted-foreground">{count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}