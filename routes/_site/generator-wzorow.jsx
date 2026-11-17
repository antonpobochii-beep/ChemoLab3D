import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Shuffle, Sparkles } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { COMPOUNDS } from "@/lib/chemistry";
import {
  ANIONS,
  CATIONS,
  buildFormula,
  buildName,
  chargeBalance,
  findAnion,
  findCation,
} from "@/lib/ions";
import { logEvent } from "@/lib/labStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/generator-wzorow")({
  component: FormulaGenerator,
  head: () => ({
    meta: [
      { title: "Generator wzorów — z jonów do wzoru sumarycznego" },
      {
        name: "description",
        content:
          "Wybierz kation i anion, a generator ułoży wzór sumaryczny i nazwę związku według reguły krzyżowej — z bilansem ładunków i odnośnikiem do modelu 3D.",
      },
    ],
  }),
});

function FormulaGenerator() {
  const [cationId, setCationId] = useState("Ca");
  const [anionId, setAnionId] = useState("Cl");
  const [saved, setSaved] = useState(false);

  const cation = findCation(cationId);
  const anion = findAnion(anionId);
  const formula = buildFormula(cation, anion);
  const name = buildName(cation, anion);
  const balance = chargeBalance(cation, anion);
  const match = COMPOUNDS.find(
    (compound) => compound.name === name || compound.formula === formula
  );

  function update(nextCation, nextAnion) {
    setCationId(nextCation);
    setAnionId(nextAnion);
    setSaved(false);
  }

  function randomise() {
    const nextCation = CATIONS[Math.floor(Math.random() * CATIONS.length)];
    const nextAnion = ANIONS[Math.floor(Math.random() * ANIONS.length)];
    update(nextCation.id, nextAnion.id);
  }

  function save() {
    logEvent({ type: "formula", label: name, detail: `Wzór ${formula} — wartościowość ${balance.anionValence}` });
    setSaved(true);
  }

  return (
    <PageShell
      eyebrow="Generator wzorów"
      title="Z jonów powstaje wzór i nazwa"
      lead="Wskaż kation i anion. Generator zamieni ładunki miejscami (reguła krzyżowa), skróci indeksy i sprawdzi sumę ładunków."
      actions={
        <button
          type="button"
          onClick={randomise}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Shuffle className="h-4 w-4" />
          Losuj zestaw
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-4">
          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Kation (jon dodatni)
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {CATIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update(item.id, anionId)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    item.id === cationId
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Anion (reszta kwasowa)
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {ANIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update(cationId, item.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    item.id === anionId
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[1.75rem] border border-primary/25 bg-card p-6 shadow-glow">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Wynik
          </p>
          <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-glow">
            <ChemFormula text={formula} />
          </p>
          <p className="mt-1 font-display text-lg">{name}</p>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Skład</dt>
              <dd className="font-display">
                {cation.symbol}
                {balance.cationCount > 1 ? balance.cationCount : ""} · {anion.symbol}
                {balance.anionCount > 1 ? balance.anionCount : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Bilans ładunków</dt>
              <dd className="font-display">{balance.equation}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Wartościowość reszty</dt>
              <dd className="font-display">{balance.anionValence}</dd>
            </div>
          </dl>

          <p className="mt-4 rounded-xl border border-border bg-background/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Reguła krzyżowa: ładunek kationu ({cation.charge}) staje się liczbą anionów, a ładunek
            anionu ({anion.charge}) — liczbą kationów. Wspólny dzielnik skracamy, żeby indeksy były
            najmniejsze możliwe.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {saved ? <Check className="h-4 w-4" /> : null}
              {saved ? "Zapisano w archiwum" : "Zapisz w archiwum"}
            </button>
            {match ? (
              <Link
                to="/zwiazki/$compoundId"
                params={{ compoundId: match.id }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm"
              >
                Model 3D tego związku
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full border border-dashed border-border px-4 py-2.5 text-xs text-muted-foreground">
                Tego związku nie ma jeszcze w katalogu
              </span>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}