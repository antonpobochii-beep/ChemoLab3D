import { Suspense, lazy } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Boxes, Loader2 } from "lucide-react";
import ChemFormula from "@/components/ChemFormula";
import { buildPubChemModel } from "@/lib/pubchemModel";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));

const signedCharge = (charge = 1, sign = "−") => `${charge > 1 ? charge : ""}${sign}`;

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

export default function PubChemResult({ result }) {
  const structure = buildPubChemModel(result);
  const ionic = structure.kind === "lattice";

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="overflow-hidden rounded-[1.5rem] border border-primary/25 bg-[radial-gradient(120%_95%_at_50%_0%,hsl(var(--secondary))_0%,hsl(var(--background))_72%)]">
        <div className="h-[260px] w-full sm:h-[320px]">
          {structure.kind === "lattice" ? (
            <ClientOnly fallback={<ViewerFallback />}>
              <Suspense fallback={<ViewerFallback />}>
                <CrystalLattice
                  cation={structure.cation}
                  anion={structure.anion}
                  className="h-full w-full cursor-grab active:cursor-grabbing"
                />
              </Suspense>
            </ClientOnly>
          ) : null}

          {structure.kind === "molecule" ? (
            <ClientOnly fallback={<ViewerFallback />}>
              <Suspense fallback={<ViewerFallback />}>
                <MoleculeViewer
                  model={structure.model}
                  className="h-full w-full cursor-grab active:cursor-grabbing"
                />
              </Suspense>
            </ClientOnly>
          ) : null}

          {structure.kind === "none" ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground">
              <Boxes className="h-5 w-5 text-primary" />
              Nie udało się zbudować modelu przestrzennego dla tego rekordu.
            </div>
          ) : null}
        </div>

        <p className="border-t border-border/60 bg-background/70 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-primary">
          {ionic
            ? "Sieć krystaliczna (Brak wydzielonych cząsteczek wg IUPAC)"
            : "Model kulkowo-patyczkowy z notacji SMILES"}
        </p>

        {ionic ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 bg-background/70 px-4 py-2.5 text-xs">
            {[structure.cation, structure.anion].map((ion, position) => (
              <span
                key={`${ion.symbol}-${position}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-black/20"
                  style={{ backgroundColor: ion.color }}
                />
                <span className="font-display">
                  {ion.symbol}
                  <sup className="ml-0.5 text-[0.65em]">
                    {signedCharge(ion.charge, position === 0 ? "+" : "−")}
                  </sup>
                </span>
                <span className="text-muted-foreground">{position === 0 ? "kation" : "anion"}</span>
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
              <Boxes className="h-3.5 w-3.5" />
              27 jonów · CN = 6
            </span>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Nazwa IUPAC
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold leading-tight">
            {result.iupacName || result.title || "brak nazwy IUPAC"}
          </h3>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Nazwy alternatywne
          </p>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {[result.title, result.query]
              .filter((name, index, list) => name && list.indexOf(name) === index)
              .map((name) => (
                <li key={name} className="rounded-full border border-border bg-background px-3 py-1">
                  {name}
                </li>
              ))}
          </ul>
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-secondary/60 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Wzór</dt>
            <dd className="mt-0.5 font-display font-semibold">
              <ChemFormula text={result.formula || result.query} />
            </dd>
          </div>
          <div className="rounded-xl bg-secondary/60 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Masa</dt>
            <dd className="mt-0.5 font-display font-semibold">
              {result.weight ? `${result.weight} g/mol` : "—"}
            </dd>
          </div>
          <div className="rounded-xl bg-secondary/60 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Ładunek</dt>
            <dd className="mt-0.5 font-display font-semibold">{result.charge ?? 0}</dd>
          </div>
          <div className="rounded-xl bg-secondary/60 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Klasyfikacja
            </dt>
            <dd className="mt-0.5 font-display font-semibold">{result.terminology?.structure}</dd>
          </div>
        </dl>

        {result.smiles ? (
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              SMILES (kanoniczny)
            </p>
            <code className="mt-1 block break-all rounded-xl bg-background px-3 py-2 font-mono text-xs text-primary">
              {result.smiles}
            </code>
          </div>
        ) : null}

        <p className="text-[11px] leading-relaxed text-muted-foreground">{result.terminology?.note}</p>
      </div>
    </div>
  );
}