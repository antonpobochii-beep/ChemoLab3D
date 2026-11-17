import { lazy, Suspense, useState } from "react";
import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { Box, Heart, RotateCcw, Trash2 } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import CompoundCard from "@/components/CompoundCard";
import LabAccountHint from "@/components/lab/LabAccountHint";
import ChemFormula from "@/components/ChemFormula";
import { atomCounts, formulaFromCounts, getCompound } from "@/lib/chemistry";
import { formatDate, removeMolecule, toggleFavorite, useLabStore } from "@/lib/labStore";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));

export const Route = createFileRoute("/_site/moje-ulubione")({
  component: FavoritesPage,
  head: () => ({
    meta: [
      { title: "Moje ulubione — związki i własne układy cząsteczek" },
      {
        name: "description",
        content:
          "Twoje ulubione związki chemiczne oraz cząsteczki zapisane z trybu układania 3D — z podglądem modelu i szybkim powrotem do nauki.",
      },
    ],
  }),
});

function FavoritesPage() {
  const store = useLabStore();
  const [previewId, setPreviewId] = useState(null);

  const compounds = store.favorites.map((id) => getCompound(id)).filter(Boolean);
  const molecules = store.molecules || [];

  return (
    <PageShell
      eyebrow="Moje ulubione"
      title="Twoja osobista półka"
      lead="Związki oznaczone sercem oraz cząsteczki zbudowane w trybie 3D — zapisane na Twoim koncie."
      actions={
        <Link
          to="/ukladanie-3d"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          <Box className="h-4 w-4" />
          Zbuduj cząsteczkę
        </Link>
      }
    >
      <LabAccountHint />

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Heart className="h-4 w-4 text-primary" />
            Ulubione związki
            <span className="text-sm font-normal text-muted-foreground">({compounds.length})</span>
          </h2>
          <Link to="/zwiazki" className="text-sm text-muted-foreground hover:text-primary">
            Dodaj z katalogu
          </Link>
        </div>

        {compounds.length === 0 ? (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-border bg-card/60 px-6 py-10 text-center text-sm text-muted-foreground">
            Nie masz jeszcze ulubionych związków. Otwórz kartę związku i kliknij serce — pojawi się tutaj.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compounds.map((compound) => (
              <div key={compound.id} className="relative">
                <CompoundCard compound={compound} />
                <button
                  type="button"
                  onClick={() => toggleFavorite(compound.id)}
                  aria-label="Usuń z ulubionych"
                  className="absolute right-4 top-14 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 text-primary transition-colors hover:border-destructive/50 hover:text-destructive"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Box className="h-4 w-4 text-primary" />
            Moje układy cząsteczek
            <span className="text-sm font-normal text-muted-foreground">({molecules.length})</span>
          </h2>
          <Link to="/ukladanie-3d" className="text-sm text-muted-foreground hover:text-primary">
            Otwórz edytor 3D
          </Link>
        </div>

        {molecules.length === 0 ? (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-border bg-card/60 px-6 py-10 text-center text-sm text-muted-foreground">
            Zbuduj cząsteczkę w trybie 3D i kliknij „Zapisz układ”, aby zobaczyć ją na tej liście.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {molecules.map((molecule) => {
              const counts = atomCounts({ atoms: molecule.atoms || [] });
              const formula = formulaFromCounts(counts);
              const isOpen = previewId === molecule.id;
              return (
                <article key={molecule.id} className="rounded-[1.5rem] border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-base font-semibold">{molecule.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formula ? <ChemFormula text={formula} /> : "pusty układ"} · {molecule.atoms?.length || 0} atomów ·{" "}
                        {molecule.bonds?.length || 0} wiązań
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                        zapisano {formatDate(molecule.date)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMolecule(molecule.id)}
                      aria-label="Usuń układ"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {isOpen ? (
                    <div className="mt-4 h-[280px] overflow-hidden rounded-2xl border border-border/70 bg-background/60">
                      <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-secondary/40" />}>
                        <Suspense fallback={<div className="h-full w-full animate-pulse bg-secondary/40" />}>
                          <MoleculeViewer
                            model={{ atoms: molecule.atoms || [], bonds: molecule.bonds || [] }}
                            className="h-full w-full cursor-grab active:cursor-grabbing"
                          />
                        </Suspense>
                      </ClientOnly>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setPreviewId(isOpen ? null : molecule.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {isOpen ? "Ukryj podgląd 3D" : "Pokaż podgląd 3D"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}