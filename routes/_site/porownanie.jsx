import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowLeftRight, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { COMPOUNDS, atomCounts, getCategory, getCompound } from "@/lib/chemistry";
import { analyzeCompound, terminology } from "@/lib/structure";
import CompareColumn from "@/components/compare/CompareColumn";
import CompareTable from "@/components/compare/CompareTable";

export const Route = createFileRoute("/_site/porownanie")({
  validateSearch: (search = {}) => ({
    a: typeof search.a === "string" ? search.a : undefined,
    b: typeof search.b === "string" ? search.b : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Porównanie dwóch związków — modele 3D i dane | Chemia 3D" },
      {
        name: "description",
        content:
          "Zestaw dwa związki chemiczne obok siebie: modele 3D cząsteczek lub sieci jonowych, wzory, wartościowość i różnice w budowie.",
      },
    ],
  }),
  component: ComparePage,
});

const DEFAULT_PAIR = ["h2so4", "nacl"];

const sideFor = (value) => (value && getCompound(value) ? value : null);

function ComparePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const fallbackA = sideFor(DEFAULT_PAIR[0]) || COMPOUNDS[0].id;
  const fallbackB = sideFor(DEFAULT_PAIR[1]) || COMPOUNDS[1]?.id || COMPOUNDS[0].id;

  const left = getCompound(sideFor(search.a) || fallbackA) || COMPOUNDS[0];
  const right = getCompound(sideFor(search.b) || fallbackB) || COMPOUNDS[0];

  const select = (side, id) =>
    navigate({
      to: "/porownanie",
      search: { a: side === "a" ? id : left.id, b: side === "b" ? id : right.id },
    });

  const swap = () =>
    navigate({ to: "/porownanie", search: { a: right.id, b: left.id } });

  const leftStructure = analyzeCompound(left);
  const rightStructure = analyzeCompound(right);
  const leftCounts = atomCounts(left.model);
  const rightCounts = atomCounts(right.model);
  const composition = (counts) =>
    Object.entries(counts)
      .map(([symbol, amount]) => `${amount} × ${symbol}`)
      .join(", ");

  const rows = [
    { label: "Wzór", left: left.formula, right: right.formula, formula: true },
    {
      label: "Struktura",
      left: terminology(leftStructure.ionic).structure,
      right: terminology(rightStructure.ionic).structure,
    },
    {
      label: "Kategoria",
      left: getCategory(left.category).label,
      right: getCategory(right.category).label,
    },
    {
      label: "Wartościowość",
      left: `${left.valence.roman} — ${left.valence.word}`,
      right: `${right.valence.roman} — ${right.valence.word}`,
    },
    {
      label: "Reszta / anion",
      left: `${left.residue.symbol} (${left.residue.charge})`,
      right: `${right.residue.symbol} (${right.residue.charge})`,
    },
    {
      label: "Skład",
      left: composition(leftCounts),
      right: composition(rightCounts),
    },
    {
      label: "Atomy w modelu",
      left: String(Object.values(leftCounts).reduce((sum, value) => sum + value, 0)),
      right: String(Object.values(rightCounts).reduce((sum, value) => sum + value, 0)),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/zwiazki"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Wszystkie związki
        </Link>
        <button
          type="button"
          onClick={swap}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" /> Zamień strony
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ArrowLeftRight className="h-5 w-5 text-primary" />
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Porównanie związków</h1>
        <p className="text-sm text-muted-foreground">
          Dwa modele 3D w jednym widoku — różnice oznaczone kolorem.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { side: "A", value: left.id, onPick: (id) => select("a", id) },
          { side: "B", value: right.id, onPick: (id) => select("b", id) },
        ].map((field) => (
          <label
            key={field.side}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 font-display text-xs font-semibold text-primary">
              {field.side}
            </span>
            <select
              value={field.value}
              onChange={(event) => field.onPick(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-display text-sm text-foreground outline-none"
            >
              {COMPOUNDS.map((compound) => (
                <option key={compound.id} value={compound.id} className="bg-card text-foreground">
                  {compound.name} ({compound.formula})
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <CompareColumn compound={left} side="A" />
        <CompareColumn compound={right} side="B" />
      </div>

      <div className="mt-6">
        <CompareTable rows={rows} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[left, right].map((compound) => (
          <Link
            key={compound.id}
            to="/zwiazki/$compoundId"
            params={{ compoundId: compound.id }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm transition-all hover:border-primary/60 hover:text-primary hover:shadow-glow-sm"
          >
            <span>
              Pełna karta: {compound.name}
              <span className="block text-xs text-muted-foreground">
                Tryb prezentacji i wszystkie dane
              </span>
            </span>
            <ArrowLeftRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}