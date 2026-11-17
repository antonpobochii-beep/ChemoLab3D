import { Suspense, lazy } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { getCategory } from "@/lib/chemistry";
import { analyzeCompound, latticeIons, terminology } from "@/lib/structure";
import ChemFormula from "@/components/ChemFormula";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));

// Jedna kolumna porównania: model 3D (cząsteczka lub sieć jonowa) i skrót danych.
export default function CompareColumn({ compound, side }) {
  const structure = analyzeCompound(compound);
  const ions = structure.ionic ? latticeIons(compound) : null;
  const terms = terminology(structure.ionic);
  const category = getCategory(compound.category);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-panel">
      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 font-display text-xs font-semibold text-primary">
          {side}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold">{compound.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{compound.aka}</p>
        </div>
        <span className="font-display text-sm">
          <ChemFormula text={compound.formula} />
        </span>
      </div>

      <div className="relative h-[280px] w-full bg-[radial-gradient(120%_95%_at_50%_0%,hsl(var(--secondary))_0%,hsl(var(--background))_72%)] sm:h-[320px]">
        <ClientOnly fallback={<ViewerFallback />}>
          <Suspense fallback={<ViewerFallback />}>
            {structure.ionic && ions ? (
              <CrystalLattice
                key={compound.id}
                cation={ions.cation}
                anion={ions.anion}
                className="h-full w-full cursor-grab active:cursor-grabbing"
              />
            ) : (
              <MoleculeViewer
                key={compound.id}
                model={compound.model}
                className="h-full w-full cursor-grab active:cursor-grabbing"
              />
            )}
          </Suspense>
        </ClientOnly>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-4 py-3 text-[11px]">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
          {terms.structure}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          {category.label}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          wartościowość {compound.valence.roman}
        </span>
      </div>
    </div>
  );
}

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-9 w-9 animate-pulse rounded-full border-2 border-primary/30 bg-primary/10" />
    </div>
  );
}