import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { CATEGORIES, COMPOUNDS, compoundsByCategory, elementsOf } from "@/lib/chemistry";
import { checkBuild } from "@/lib/acidBuilder";
import { analyzeCompound } from "@/lib/structure";
import AtomPalette from "@/components/builder/AtomPalette";
import AtomLegend from "@/components/AtomLegend";
import BuildToolbar from "@/components/builder/BuildToolbar";
import ChemFormula from "@/components/ChemFormula";
import MoleculeBoard from "@/components/builder/MoleculeBoard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/ukladanie")({
  component: BuilderPage,
  validateSearch: (search) => ({
    zwiazek: typeof search.zwiazek === "string" ? search.zwiazek : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tryb układania cząsteczek — chemia 3D" },
      {
        name: "description",
        content:
          "Ułóż samodzielnie cząsteczki kowalencyjne z atomów w kolorach legendy i połącz je wiązaniami. Sole i wodorotlenki o strukturze jonowej poznasz jako sieci krystaliczne.",
      },
    ],
  }),
});

// Budujemy wyłącznie cząsteczki kowalencyjne — substancje jonowe mają osobny model sieci.
const BUILDABLE = COMPOUNDS.filter((compound) => !analyzeCompound(compound).ionic);

function BuilderPage() {
  const { zwiazek } = Route.useSearch();
  const startIndex = Math.max(
    0,
    BUILDABLE.findIndex((compound) => compound.id === zwiazek)
  );

  const [stepIndex, setStepIndex] = useState(startIndex);
  const [placed, setPlaced] = useState({});
  const [bonds, setBonds] = useState([]);
  const [tool, setTool] = useState("atom");
  const [bondOrder, setBondOrder] = useState(1);
  const [selectedEl, setSelectedEl] = useState("H");
  const [pending, setPending] = useState(null);
  const [result, setResult] = useState(null);
  const [solved, setSolved] = useState([]);

  const compound = BUILDABLE[stepIndex];
  const allSolved = solved.length === BUILDABLE.length;

  function resetBoard() {
    setPlaced({});
    setBonds([]);
    setPending(null);
    setResult(null);
  }

  function handleSelectCompound(index) {
    setStepIndex(index);
    setTool("atom");
    resetBoard();
  }

  function handleSelectElement(symbol) {
    setSelectedEl(symbol);
    setTool("atom");
    setPending(null);
  }

  function removeBondsAt(index) {
    setBonds((list) => list.filter((bond) => bond.a !== index && bond.b !== index));
  }

  function handleSlotClick(index) {
    setResult(null);

    if (tool === "erase") {
      setPlaced((current) => {
        const next = { ...current };
        delete next[index];
        return next;
      });
      removeBondsAt(index);
      setPending(null);
      return;
    }

    if (tool === "bond") {
      if (pending === null) {
        setPending(index);
        return;
      }
      if (pending === index) {
        setPending(null);
        return;
      }
      const a = Math.min(pending, index);
      const b = Math.max(pending, index);
      setBonds((list) => [
        ...list.filter((bond) => !(bond.a === a && bond.b === b)),
        { a, b, order: bondOrder },
      ]);
      setPending(null);
      return;
    }

    setPlaced((current) => ({ ...current, [index]: selectedEl }));
  }

  function handleBondClick(index) {
    setResult(null);
    setBonds((list) => list.filter((_, position) => position !== index));
  }

  function handleCheck() {
    const check = checkBuild(compound, placed, bonds);
    setResult(check);
    if (check.ok) {
      setSolved((list) => (list.includes(compound.id) ? list : [...list, compound.id]));
      import("canvas-confetti")
        .then((module) =>
          module.default({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.62 },
            colors: ["#2ECC71", "#F4D03F", "#E74C3C", "#9B59B6"],
          })
        )
        .catch(() => {});
    }
  }

  function handleNext() {
    setStepIndex((current) => (current + 1) % BUILDABLE.length);
    setTool("atom");
    resetBoard();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Tryb układania
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Zbuduj cząsteczkę
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Wybierz atom, kliknij miejsce na planszy, a następnie połącz atomy wiązaniami. Na końcu
            sprawdź, czy cząsteczka jest poprawna. Sole i wodorotlenki mają własny model sieci
            jonowej — te zobaczysz w kartach związków.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            Rozwiązane
            <span className="font-display font-semibold text-foreground">
              {solved.length}/{BUILDABLE.length}
            </span>
          </div>
          <Link
            to="/ukladanie-3d"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tryb 3D
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {CATEGORIES.map((category) => {
          const items = compoundsByCategory(category.id).filter(
            (item) => !analyzeCompound(item).ionic
          );
          return (
            <div key={category.id} className="flex flex-wrap items-center gap-2">
              <span className="w-full text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:w-32">
                {category.label}
              </span>
              {items.map((item) => {
                const index = BUILDABLE.findIndex((entry) => entry.id === item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCompound(index)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
                      index === stepIndex
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
                    )}
                  >
                    <span className="font-display">
                      <ChemFormula text={item.formula} />
                    </span>
                    {solved.includes(item.id) ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="rounded-[1.75rem] border border-border bg-card p-4 shadow-[0_30px_80px_-70px_rgba(15,42,38,0.8)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Do ułożenia
              </p>
              <p className="mt-1 font-display text-lg font-semibold">{compound.name}</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 font-display text-sm">
              <ChemFormula text={compound.formula} />
            </span>
          </div>

          <div className="mt-4">
            <BuildToolbar
              tool={tool}
              onToolChange={setTool}
              bondOrder={bondOrder}
              onBondOrderChange={setBondOrder}
            />
          </div>

          <div className="mt-4">
            <AtomPalette selected={selectedEl} onSelect={handleSelectElement} />
            <p className="mt-2 text-[11px] text-muted-foreground">
              {tool === "atom"
                ? "Kliknij miejsce na planszy, aby wstawić wybrany atom."
                : tool === "bond"
                  ? "Kliknij dwa atomy, aby połączyć je wiązaniem."
                  : "Kliknij atom lub wiązanie, aby je usunąć."}
            </p>
          </div>

          <div className="mt-4">
            <MoleculeBoard
              key={compound.id}
              compound={compound}
              placed={placed}
              bonds={bonds}
              pending={pending}
              result={result}
              onSlotClick={handleSlotClick}
              onBondClick={handleBondClick}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleCheck}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Sprawdź cząsteczkę
            </button>
            <button
              type="button"
              onClick={resetBoard}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-display text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Wyczyść
            </button>
          </div>

          {result ? (
            <div
              className={cn(
                "mt-4 rounded-2xl border p-4 text-sm",
                result.ok
                  ? "border-primary/40 bg-accent/70 shadow-glow-sm"
                  : "border-amber-400/40 bg-amber-400/10"
              )}
            >
              {result.ok ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-display font-semibold text-accent-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      {compound.name} — model poprawny
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {allSolved
                        ? `Wszystkie ${BUILDABLE.length} cząsteczek gotowe.`
                        : "Możesz przejść do kolejnego związku."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                  >
                    {allSolved ? "Od początku" : "Następny związek"}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div>
                  <p className="flex items-center gap-2 font-display font-semibold text-amber-200">
                    <TriangleAlert className="h-4 w-4" />
                    Jeszcze nie wszystko się zgadza
                  </p>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>
                      Atomy do poprawy: <strong>{result.wrongAtoms.length}</strong>
                    </li>
                    <li>
                      Brakujące wiązania: <strong>{result.missingBondKeys.length}</strong>
                    </li>
                    <li>
                      Zbędne wiązania: <strong>{result.extraBondKeys.length}</strong>
                    </li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Błędne atomy i wiązania zaznaczono na czerwono.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Jak to działa
            </p>
            <ol className="mt-3 space-y-3 text-sm">
              {[
                "Wybierz atom z palety — kolor wskazuje pierwiastek.",
                "Kliknij miejsce na planszy, aby wstawić atom.",
                "Przełącz na „Wiązania”, wybierz pojedyncze lub podwójne i połącz dwa atomy.",
                "Kliknij „Sprawdź cząsteczkę”, aby otrzymać informację zwrotną.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-[11px] font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Atomy w tej cząsteczce
            </p>
            <AtomLegend className="mt-3" symbols={elementsOf(compound)} />
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Cała paleta
            </p>
            <AtomLegend className="mt-3" dense />
          </div>

          <Link
            to="/zwiazki/$compoundId"
            params={{ compoundId: compound.id }}
            className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-card px-5 py-4 text-sm transition-colors hover:border-primary/30 hover:text-primary"
          >
            <span>
              Potrzebujesz podpowiedzi?
              <span className="block text-xs text-muted-foreground">
                Zobacz model 3D — {compound.name}
              </span>
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}