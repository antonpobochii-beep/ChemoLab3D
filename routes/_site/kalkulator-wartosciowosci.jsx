import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, X } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { CATEGORIES, COMPOUNDS, getCategory, getCompound } from "@/lib/chemistry";
import { analysisForCompound } from "@/lib/ions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/kalkulator-wartosciowosci")({
  component: ValenceCalculator,
  head: () => ({
    meta: [
      { title: "Kalkulator wartościowości — reszty kwasowe krok po kroku" },
      {
        name: "description",
        content:
          "Wybierz związek i oblicz wartościowość reszty kwasowej: bilans ładunków, liczba kationów i anionów oraz wzór sumaryczny z wyjaśnieniem.",
      },
    ],
  }),
});

function questionFor(compound, analysis) {
  const category = getCategory(compound.category);
  if (category.id === "tlenek") {
    return { text: `Jaka jest wartościowość ${analysis.cation.label.split(" — ")[1]?.split("(")[0] || "pierwiastka"} w tym tlenku?`, answer: analysis.cationValence };
  }
  if (category.id === "wodorotlenek") {
    return { text: "Jaka jest wartościowość grupy wodorotlenkowej w tym związku?", answer: analysis.anionValence };
  }
  return { text: "Jaka jest wartościowość reszty kwasowej (anionu) w tym związku?", answer: analysis.anionValence };
}

const ROMAN = { 1: "I", 2: "II", 3: "III", 4: "IV" };

function ValenceCalculator() {
  const [compoundId, setCompoundId] = useState(COMPOUNDS[0].id);
  const [answer, setAnswer] = useState(null);

  const compound = getCompound(compoundId) || COMPOUNDS[0];
  const analysis = analysisForCompound(compound.id);
  const category = getCategory(compound.category);
  const question = analysis ? questionFor(compound, analysis) : null;
  const checked = answer !== null;
  const isCorrect = checked && answer === question.answer;

  function pick(id) {
    setCompoundId(id);
    setAnswer(null);
  }

  return (
    <PageShell
      eyebrow="Kalkulator wartościowości"
      title="Policz wartościowość reszty kwasowej"
      lead="Wybierz związek z katalogu, odpowiedz na pytanie, a potem sprawdź bilans ładunków — dokładnie tak, jak liczy się to w zeszycie."
    >
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <section className="rounded-[1.75rem] border border-border bg-card p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Wybierz związek
          </p>
          <div className="mt-3 space-y-3">
            {CATEGORIES.map((group) => (
              <div key={group.id}>
                <p className="text-[11px] text-muted-foreground" style={{ color: group.ink }}>
                  {group.label}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {COMPOUNDS.filter((item) => item.category === group.id).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pick(item.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition-colors",
                        item.id === compound.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ChemFormula text={item.formula} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-[1.75rem] border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {category.label} · {compound.tag}
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold">{compound.name}</h2>
                <p className="mt-1 font-display text-2xl">
                  <ChemFormula text={compound.formula} />
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAnswer(null)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Od nowa
              </button>
            </div>

            {question ? (
              <>
                <p className="mt-4 text-sm font-medium">{question.text}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((value) => {
                    const picked = answer === value;
                    const correct = question.answer === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => (checked ? null : setAnswer(value))}
                        disabled={checked}
                        className={cn(
                          "flex h-12 w-14 items-center justify-center rounded-xl border font-display text-lg transition-colors",
                          !checked && "border-border bg-background/60 hover:border-primary/50 hover:text-primary",
                          checked && correct && "border-primary bg-primary/10 text-primary",
                          checked && picked && !correct && "border-destructive/50 bg-destructive/10 text-destructive",
                          checked && !picked && !correct && "border-border/60 bg-card/50 text-muted-foreground"
                        )}
                      >
                        {ROMAN[value]}
                      </button>
                    );
                  })}
                </div>

                {checked ? (
                  <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4">
                    <p
                      className={cn(
                        "flex items-center gap-2 font-display text-sm font-semibold",
                        isCorrect ? "text-primary" : "text-destructive"
                      )}
                    >
                      {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {isCorrect ? "Poprawnie" : `Poprawna odpowiedź: ${ROMAN[question.answer]}`}
                    </p>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">Kation</dt>
                        <dd className="font-display">
                          {analysis.cation.label} × {analysis.cationCount}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">Anion</dt>
                        <dd className="font-display">
                          {analysis.anion.label} × {analysis.anionCount}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">Bilans ładunków</dt>
                        <dd className="font-display">{analysis.equation}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">Wartościowość reszty</dt>
                        <dd className="font-display text-primary">{ROMAN[analysis.anionValence]}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      Ładunek anionu to jednocześnie wartościowość reszty. Wzór musi być obojętny, więc
                      liczba kationów wynika wprost z ładunku anionu i odwrotnie — to reguła krzyżowa.
                    </p>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Dla tego związku nie mamy jeszcze rozpisanych jonów.
              </p>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}