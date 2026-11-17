import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, RotateCcw, Sparkles } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { balanceEquation } from "@/lib/redox";
import { COMPOUNDS } from "@/lib/chemistry";
import { playSound } from "@/lib/sound";

export const Route = createFileRoute("/_site/bilansowanie")({
  component: BalancePage,
  head: () => ({
    meta: [
      { title: "Bilansownik reakcji redox — ułóż współczynniki | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Wpisz nieuzgodnione równanie (np. Fe + O2 → Fe2O3), a bilansownik matematycznie dobierze współczynniki, wskaże utleniacz i reduktor oraz podpowie produkty 3D.",
      },
    ],
  }),
});

const EXAMPLES = [
  "Fe + O2 -> Fe2O3",
  "KClO3 -> KCl + O2",
  "C3H8 + O2 -> CO2 + H2O",
  "Zn + HCl -> ZnCl2 + H2",
  "Na + H2O -> NaOH + H2",
  "Fe2O3 + CO -> Fe + CO2",
];

function Equation({ terms, className = "" }) {
  return (
    <span className={className}>
      {terms.map((term, index) => (
        <span key={`${term.formula}-${index}`}>
          {index > 0 ? <span className="mx-1.5 text-muted-foreground">+</span> : null}
          {term.coefficient > 1 ? (
            <span className="mr-1 font-display font-semibold text-primary">{term.coefficient}</span>
          ) : null}
          <ChemFormula text={term.formula} />
        </span>
      ))}
    </span>
  );
}

function BalancePage() {
  const [input, setInput] = useState("Fe + O2 -> Fe2O3");
  const [result, setResult] = useState(null);

  const handleBalance = (value = input) => {
    const next = balanceEquation(value);
    setResult(next);
    playSound(next.ok ? "success" : "error");
  };

  return (
    <PageShell
      eyebrow={
        <>
          <FlaskConical className="h-3.5 w-3.5 text-primary" /> Bilansowanie równań
        </>
      }
      title="Bilansownik reakcji redox"
      lead="Wpisz równanie w zapisie substraty → produkty. Algorytm rozwiązuje układ równań na atomach, więc dobiera współczynniki dokładnie — także w reakcjach utleniania i redukcji."
    >
      <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-panel sm:p-7">
        <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground" htmlFor="equation">
          Nieuzgodnione równanie
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="equation"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleBalance()}
            spellCheck={false}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-primary/60"
            placeholder="np. Fe + O2 -> Fe2O3"
          />
          <button
            type="button"
            onClick={() => handleBalance()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" /> Zbilansuj
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setInput(example);
                handleBalance(example);
              }}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {result && !result.ok ? (
        <div className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive-foreground">
          {result.error}
        </div>
      ) : null}

      {result?.ok ? (
        <div className="mt-5 grid gap-4">
          <div className="rounded-[1.5rem] border border-primary/30 bg-primary/5 p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-primary">Równanie uzgodnione</p>
            <p className="mt-3 break-words font-display text-xl leading-relaxed sm:text-2xl">
              <Equation terms={result.left} />
              <ArrowRight className="mx-3 inline h-4 w-4 text-primary" />
              <Equation terms={result.right} />
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-border bg-card p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Kontrola bilansu atomów
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                {result.elements.map((element) => (
                  <li
                    key={element}
                    className="rounded-xl border border-border/70 bg-background px-3 py-2 text-center"
                  >
                    <span className="font-display font-semibold text-foreground">{element}</span>
                    <span className="ml-2 text-[11px] text-primary">✓</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-card p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Utlenianie i redukcja
              </p>
              {result.isRedox ? (
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">{result.oxidizedElement}</strong> utlenia się,{" "}
                    <strong className="text-foreground">{result.reducedElement}</strong> redukuje się.
                  </p>
                  <p className="rounded-xl bg-background px-3 py-2">
                    Reduktor (sam się utlenia):{" "}
                    <ChemFormula className="font-display text-primary" text={result.reductant.formula} />
                  </p>
                  <p className="rounded-xl bg-background px-3 py-2">
                    Utleniacz (sam się redukuje):{" "}
                    <ChemFormula className="font-display text-primary" text={result.oxidant.formula} />
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  To nie jest reakcja redox albo stopnie utlenienia nie zmieniają się w tym zapisie.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Produkty w katalogu 3D
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.right.map((term) => {
                const match = COMPOUNDS.find(
                  (compound) => compound.formula === term.formula
                );
                return match ? (
                  <Link
                    key={term.formula}
                    to="/zwiazki/$compoundId"
                    params={{ compoundId: match.id }}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-sm text-primary transition-colors hover:bg-primary/20"
                  >
                    <ChemFormula text={match.formula} /> {match.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span
                    key={term.formula}
                    className="rounded-full border border-border bg-background px-3.5 py-2 text-sm text-muted-foreground"
                  >
                    <ChemFormula text={term.formula} /> — brak w katalogu
                  </span>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setInput("");
              setResult(null);
            }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Wyczyść
          </button>
        </div>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Wskazówka: używaj strzałki <span className="font-mono text-foreground">-&gt;</span> lub znaku
        równania. Wzory zapisuj bez spacji (H2SO4, Ca(OH)2). Stopnie utlenienia wyznaczamy regułami
        IUPAC dla związków nieorganicznych.
      </p>
    </PageShell>
  );
}