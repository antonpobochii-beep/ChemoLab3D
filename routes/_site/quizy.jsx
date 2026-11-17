import { lazy, Suspense, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Gamepad2, RotateCcw, Trophy, X } from "lucide-react";
import { ClientOnly } from "@tanstack/react-router";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { COMPOUNDS, getCompound } from "@/lib/chemistry";
import { analyzeCompound, latticeIons, structureText } from "@/lib/structure";
import { addQuizResult } from "@/lib/labStore";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));

export const Route = createFileRoute("/_site/quizy")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Laboratorium quizów — dopasuj wzór do modelu 3D" },
      {
        name: "description",
        content:
          "Interaktywny quiz chemiczny: dopasuj wzór sumaryczny do modelu 3D cząsteczki albo rozpoznaj związek na podstawie opisu i zastosowań.",
      },
    ],
  }),
});

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const BOND_OPTIONS = [
  { id: "ionowe", label: "Jonowe" },
  { id: "pojedyncze", label: "Kowalencyjne pojedyncze" },
  { id: "podwojne", label: "Kowalencyjne podwójne" },
  { id: "potrojne", label: "Kowalencyjne potrójne" },
];

const BOND_NOTES = {
  ionowe:
    "Wiązanie jonowe: metal oddaje elektrony, anion je przyjmuje — powstaje sieć jonowa, nie cząsteczka.",
  pojedyncze: "Wiązanie kowalencyjne pojedyncze — jedna wspólna para elektronowa.",
  podwojne: "Wiązanie kowalencyjne podwójne — dwie wspólne pary elektronowe.",
  potrojne: "Wiązanie kowalencyjne potrójne — trzy wspólne pary elektronowe.",
};

function bondTypeOf(compound) {
  const analysis = analyzeCompound(compound);
  if (analysis.ionic) return "ionowe";
  const highest = Math.max(...compound.model.bonds.map((bond) => bond.order || 1), 1);
  return highest === 3 ? "potrojne" : highest === 2 ? "podwojne" : "pojedyncze";
}

function buildQuestions() {
  const picks = shuffle(COMPOUNDS).slice(0, 15);
  return picks.map((compound, index) => {
    const kind = ["model", "opis", "wiazanie"][index % 3];
    const others = shuffle(COMPOUNDS.filter((item) => item.id !== compound.id)).slice(0, 3);

    if (kind === "wiazanie") {
      return {
        id: `${compound.id}-w`,
        type: "wiazanie",
        compoundId: compound.id,
        options: BOND_OPTIONS.map((option) => ({ id: option.id, label: option.label })),
        answerId: bondTypeOf(compound),
      };
    }

    const isModel = kind === "model";
    return {
      id: `${compound.id}-${isModel ? "m" : "d"}`,
      type: kind,
      compoundId: compound.id,
      options: shuffle([compound, ...others]).map((item) => ({
        id: item.id,
        label: isModel ? item.formula : item.name,
      })),
      answerId: compound.id,
    };
  });
}

function QuizPage() {
  const [questions, setQuestions] = useState(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = questions?.[index];
  const compound = question ? getCompound(question.compoundId) : null;
  const structure = compound ? analyzeCompound(compound) : null;
  const ions = compound && structure?.ionic ? latticeIons(compound) : null;
  const isLast = questions ? index === questions.length - 1 : false;

  function start() {
    setQuestions(buildQuestions());
    setIndex(0);
    setChosen(null);
    setScore(0);
    setAnswers([]);
    setFinished(false);
  }

  function choose(optionId) {
    if (chosen) return;
    const correct = optionId === question.answerId;
    setChosen(optionId);
    playSound(correct ? "success" : "error");
    if (correct) setScore((value) => value + 1);
    // Zapamiętujemy grupę związku — panel statystyk pokaże, co warto powtórzyć.
    setAnswers((previous) => [...previous, { category: compound.category, correct }]);
  }

  function advance() {
    if (isLast) {
      addQuizResult({ score, total: questions.length, topics: answers });
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setChosen(null);
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <PageShell eyebrow="Laboratorium quizów" title="Wynik quizu" lead="Twój rezultat zapisaliśmy w archiwum eksperymentów.">
        <div className="rounded-[1.75rem] border border-border bg-card p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
            <Trophy className="h-7 w-7" />
          </span>
          <p className="mt-4 font-display text-4xl font-semibold">
            {score}/{questions.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{percent}% poprawnych odpowiedzi</p>
          <div className="mx-auto mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4" /> Zagraj jeszcze raz
            </button>
            <Link
              to="/panel-statystyk"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm"
            >
              Panel statystyk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!questions) {
    return (
      <PageShell
        eyebrow="Laboratorium quizów"
        title="Dziesięć pytań, trzy formaty"
        lead="Rozpoznasz wzór po modelu 3D, związek po opisie właściwości oraz typ wiązania, który decyduje o jego budowie."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "Modele 3D", text: "Dopasuj wzór do modelu, który możesz obrócić — cząsteczki lub sieci jonowej." },
            { title: "Opisy", text: "Wskaż nazwę związku na podstawie właściwości." },
            {
              title: "Wiązania",
              text: "Rozstrzygnij: jonowe, kowalencyjne pojedyncze, podwójne czy potrójne?",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[1.25rem] border border-border bg-card p-5">
              <p className="font-display text-sm font-semibold">{card.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={start}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          Rozpocznij quiz
          <ArrowRight className="h-4 w-4" />
        </button>

        <Link
          to="/quiz-na-zywo"
          className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary transition-colors hover:border-primary/70"
        >
          <span className="inline-flex items-center gap-2 font-display font-medium">
            <Gamepad2 className="h-4 w-4" />
            🎮 Rozgrywka na żywo (Tryb Quizizz / QR)
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Utwórz pokój, pokaż kod QR i PIN — klasa dołącza telefonami, odpowiada na czas i zbiera punkty za
          serie.
        </p>
      </PageShell>
    );
  }

  const isCorrect = chosen === question.answerId;

  return (
    <PageShell
      eyebrow="Laboratorium quizów"
      title={`Pytanie ${index + 1} z ${questions.length}`}
      lead={
        question.type === "model"
          ? "Który wzór odpowiada temu modelowi 3D?"
          : question.type === "wiazanie"
            ? "Jaki typ wiązania decyduje o budowie tego układu?"
            : "Który związek opisano poniżej?"
      }
      actions={
        <span className="rounded-full border border-border bg-card px-4 py-2 text-sm">
          Punkty: <strong className="font-display text-primary">{score}</strong>
        </span>
      }
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((index + (chosen ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="rounded-[1.75rem] border border-border bg-[radial-gradient(120%_110%_at_50%_0%,hsl(var(--secondary)),hsl(var(--background))_75%)] p-3">
          {question.type !== "opis" ? (
            <div className="h-[300px] w-full overflow-hidden rounded-[1.35rem] sm:h-[360px]">
              <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-[1.35rem] bg-secondary/40" />}>
                <Suspense fallback={<div className="h-full w-full animate-pulse rounded-[1.35rem] bg-secondary/40" />}>
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
                      model={compound.model}
                      className="h-full w-full cursor-grab active:cursor-grabbing"
                    />
                  )}
                </Suspense>
              </ClientOnly>
            </div>
          ) : (
            <div className="rounded-[1.35rem] bg-background/60 p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Opis związku
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                {structureText(compound.description, structure?.ionic)}
              </p>
              <ul className="mt-4 space-y-1">
                {compound.uses.slice(0, 2).map((use) => (
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
          <div className="grid gap-2">
            {question.options.map((option) => {
              const isAnswer = option.id === question.answerId;
              const picked = chosen === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  disabled={Boolean(chosen)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                    !chosen && "border-border bg-card hover:border-primary/40 hover:text-primary",
                    chosen && isAnswer && "border-primary bg-primary/10 text-primary",
                    chosen && picked && !isAnswer && "border-destructive/50 bg-destructive/10 text-destructive",
                    chosen && !picked && !isAnswer && "border-border/60 bg-card/50 text-muted-foreground"
                  )}
                >
                  <span className="font-display">
                    <ChemFormula text={option.label} />
                  </span>
                  {chosen && isAnswer ? <Check className="h-4 w-4" /> : null}
                  {chosen && picked && !isAnswer ? <X className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </div>

          {chosen ? (
            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <p className={cn("font-display text-sm font-semibold", isCorrect ? "text-primary" : "text-destructive")}>
                {isCorrect ? "Dobrze!" : "Nie tym razem"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {compound.name} — <ChemFormula text={compound.formula} />. {compound.tag}.
              </p>
              {question.type === "wiazanie" ? (
                <p className="mt-1 text-xs text-muted-foreground">{BOND_NOTES[question.answerId]}</p>
              ) : null}
              <button
                type="button"
                onClick={advance}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {isLast ? "Zobacz wynik" : "Następne pytanie"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}