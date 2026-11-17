import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, COMPOUNDS, compoundsByCategory } from "@/lib/chemistry";
import CompoundCard from "@/components/CompoundCard";
import PubChemSearch from "@/components/pubchem/PubChemSearch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/zwiazki/")({
  component: CompoundsPage,
  validateSearch: (search) => ({
    grupa: typeof search.grupa === "string" ? search.grupa : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Związki nieorganiczne — kwasy, wodorotlenki, tlenki, sole" },
      {
        name: "description",
        content:
          "Przeglądaj modele 3D kwasów, wodorotlenków, tlenków i soli: wzory strukturalne, reszty kwasowe, wartościowości i zastosowania.",
      },
    ],
  }),
});

function CompoundsPage() {
  const { grupa } = Route.useSearch();
  const active = grupa && CATEGORIES.some((item) => item.id === grupa) ? grupa : null;
  const visible = active ? compoundsByCategory(active) : COMPOUNDS;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Katalog związków
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Kwasy, wodorotlenki, tlenki i sole
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {COMPOUNDS.length} substancji w czterech grupach. Cząsteczki kowalencyjne pokazujemy modelem
        kulkowo-patyczkowym, a sole, wodorotlenki i tlenki metali — siecią jonową z zapisem Lewisa i
        liczbą koordynacyjną 6.
      </p>

      <div className="mt-6">
        <PubChemSearch />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/zwiazki"
          search={{}}
          className={cn(
            "rounded-full border px-4 py-2 font-display text-sm transition-all",
            !active
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
          )}
        >
          Wszystkie
          <span className="ml-2 text-xs opacity-70">{COMPOUNDS.length}</span>
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to="/zwiazki"
            search={{ grupa: category.id }}
            className={cn(
              "rounded-full border px-4 py-2 font-display text-sm transition-all",
              active === category.id
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
            )}
          >
            {category.label}
            <span className="ml-2 text-xs opacity-70">
              {compoundsByCategory(category.id).length}
            </span>
          </Link>
        ))}
      </div>

      {active ? (
        <p className="mt-4 rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground">
          {CATEGORIES.find((category) => category.id === active).blurb}
        </p>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((compound) => (
          <CompoundCard key={compound.id} compound={compound} />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/ukladanie"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Tryb układania cząsteczek
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/uklad-okresowy"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 font-display text-sm font-medium transition-colors hover:border-primary/30 hover:text-primary"
        >
          Układ okresowy pierwiastków
        </Link>
      </div>
    </div>
  );
}