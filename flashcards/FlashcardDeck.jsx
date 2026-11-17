import { useState } from "react";
import { ArrowRight, Check, Layers, RotateCcw, X } from "lucide-react";
import ChemFormula from "@/components/ChemFormula";
import StructuralFormula from "@/components/StructuralFormula";
import LewisStructure from "@/components/molecule/LewisStructure";
import { COMPOUNDS, getCompound } from "@/lib/chemistry";
import { addFlashcardResult } from "@/lib/labStore";
import { analyzeCompound, latticeIons, structureText } from "@/lib/structure";
import { buildFlashcardDeck } from "@/lib/flashcards";
import { cn } from "@/lib/utils";

// Fiszki: system losuje strukturę z bazy i pyta o nazwę lub właściwość.
export default function FlashcardDeck() {
  const [deck, setDeck] = useState(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);

  function start() {
    setDeck(buildFlashcardDeck(COMPOUNDS, 12));
    setIndex(0);
    setChosen(null);
    setScore(0);
  }

  if (!deck) {
    return (
      <div className="rounded-[1.75rem] border border-primary/30 bg-primary/5 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary">
          <Layers className="h-3.5 w-3.5" />
          Fiszki
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Losowa struktura, jedno pytanie
        </h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          System losuje związek z bazy i pokazuje jego strukturę. Twoje zadanie: wskazać nazwę
          substancji albo jedno z jej rzeczywistych zastosowań. Dwanaście kart w jednej serii.
        </p>
        <button
          type="button"
          onClick={start}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          Rozdaj fiszki
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const card = deck[index];
  const compound = getCompound(card.compoundId);
  const analysis = analyzeCompound(compound);
  const ions = analysis.ionic ? latticeIons(compound) : null;
  const isLast = index === deck.length - 1;
  const isCorrect = chosen === card.answerId;

  function choose(optionId) {
    if (chosen) return;
    const correct = optionId === card.answerId;
    setChosen(optionId);
    if (correct) setScore((value) => value + 1);
    addFlashcardResult({ compoundId: compound.id, category: compound.category, correct });
  }

  return (
    <div className="rounded-[1.75rem] border border-primary/30 bg-primary/5 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary">
          <Layers className="h-3.5 w-3.5" />
          Fiszka {index + 1} z {deck.length}
        </p>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs">
          Punkty: <strong className="font-display text-primary">{score}</strong>
        </span>
      </div>

      <p className="mt-3 font-display text-lg font-semibold">{card.question}</p>

      {card.kind === "nazwa" ? (
        <div className="mt-3 rounded-[1.35rem] border border-border bg-background/70 p-4">
          {ions ? (
            <LewisStructure cation={ions.cation} anion={ions.anion} className="py-2" />
          ) : (
            <StructuralFormula compound={compound} className="h-32 w-full text-foreground" />
          )}
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {ions ? "Jednostka formalna — brak cząsteczek" : "Wzór strukturalny"}
          </p>
        </div>
      ) : (
        <div className="mt-3 rounded-[1.35rem] border border-border bg-background/70 p-4">
          <p className="font-display text-2xl font-semibold">
            <ChemFormula text={compound.formula} />
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {compound.tag}
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-2">
        {card.options.map((option) => {
          const isAnswer = option.id === card.answerId;
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
              <span>{option.label}</span>
              {chosen && isAnswer ? <Check className="h-4 w-4" /> : null}
              {chosen && picked && !isAnswer ? <X className="h-4 w-4" /> : null}
            </button>
          );
        })}
      </div>

      {chosen ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p
            className={cn(
              "font-display text-sm font-semibold",
              isCorrect ? "text-primary" : "text-destructive"
            )}
          >
            {isCorrect ? "Dobrze!" : "Nie tym razem"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {compound.name} — <ChemFormula text={compound.formula} />.{" "}
            {structureText(compound.description, analysis.ionic)}
          </p>
          <button
            type="button"
            onClick={isLast ? start : () => { setIndex(index + 1); setChosen(null); }}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {isLast ? (
              <>
                <RotateCcw className="h-4 w-4" /> Nowa seria
              </>
            ) : (
              <>
                Następna fiszka
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}