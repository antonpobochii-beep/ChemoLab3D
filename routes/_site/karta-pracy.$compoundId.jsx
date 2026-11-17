import { Suspense, lazy } from "react";
import { ClientOnly, Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";
import { atomCounts, ELEMENTS, getCompound } from "@/lib/chemistry";
import { analyzeCompound, latticeIons, terminology } from "@/lib/structure";
import ChemFormula from "@/components/ChemFormula";
import SimpleLanguage from "@/components/compound/SimpleLanguage";
import StructuralFormula from "@/components/StructuralFormula";
import LewisStructure from "@/components/molecule/LewisStructure";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));

export const Route = createFileRoute("/_site/karta-pracy/$compoundId")({
  component: WorksheetPage,
  head: ({ params }) => {
    const compound = getCompound(params?.compoundId);
    return {
      meta: [
        { title: `Karta pracy — ${compound?.name ?? "związek"} | ChemoLab 3D` },
        {
          name: "description",
          content: "Gotowa karta pracy do druku z modelem 3D, składem i zastosowaniami związku.",
        },
      ],
    };
  },
});

function WorksheetPage() {
  const { compoundId } = Route.useParams();
  const compound = getCompound(compoundId);
  if (!compound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Nie znaleziono tego związku</h1>
        <Link to="/zwiazki" className="mt-5 inline-flex text-sm text-primary hover:underline">
          Wróć do katalogu
        </Link>
      </div>
    );
  }

  const structure = analyzeCompound(compound);
  const terms = terminology(structure.ionic);
  const ions = structure.ionic ? latticeIons(compound) : null;
  const counts = atomCounts(compound.model);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/zwiazki/$compoundId"
          params={{ compoundId: compound.id }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Wróć do związku
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Printer className="h-4 w-4" /> Drukuj / zapisz PDF
        </button>
      </div>

      <article className="mt-5 rounded-[1.5rem] border border-border bg-card p-6 print:mt-0 print:rounded-none print:border-0 print:bg-white print:p-0 print:text-black">
        <header className="border-b border-border pb-4 print:border-black/20">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground print:text-black/60">
            ChemoLab 3D · karta pracy
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold print:text-black">
                {compound.name}
              </h1>
              <p className="text-sm text-muted-foreground print:text-black/70">
                {compound.aka} · {terms.structure}
              </p>
            </div>
            <p className="font-display text-3xl font-semibold">
              <ChemFormula text={compound.formula} />
            </p>
          </div>
        </header>

        <div className="mt-4 h-[260px] w-full overflow-hidden rounded-2xl border border-border bg-background/60 print:h-[220px] print:border-black/20 print:bg-white">
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              {structure.ionic && ions ? (
                <CrystalLattice cation={ions.cation} anion={ions.anion} autoRotate={false} className="h-full w-full" />
              ) : (
                <MoleculeViewer model={compound.model} autoRotate={false} className="h-full w-full" />
              )}
            </Suspense>
          </ClientOnly>
        </div>
        <p className="mt-1 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground print:text-black/60">
          Model 3D {structure.ionic ? "sieci krystalicznej" : "cząsteczki"} — zrzut ekranu do wydruku
        </p>

        <section className="mt-5">
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-muted-foreground print:text-black">
            Opis
          </h2>
          <p className="mt-1 text-sm leading-relaxed print:text-black">{compound.description}</p>
        </section>

        <section className="mt-4">
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-muted-foreground print:text-black">
            {structure.ionic ? "Zapis Lewisa" : "Wzór strukturalny"}
          </h2>
          <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-border bg-background/40 p-3 print:border-black/30 print:bg-white">
            {structure.ionic && structure.cation && structure.anion ? (
              <LewisStructure cation={structure.cation} anion={structure.anion} showLabels />
            ) : (
              <StructuralFormula compound={compound} className="h-32 w-full" />
            )}
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-muted-foreground print:text-black">
              Skład jednostki
            </h2>
            <ul className="mt-1 text-sm">
              {Object.entries(counts).map(([symbol, count]) => (
                <li key={symbol} className="flex justify-between border-b border-border/50 py-1 print:border-black/10">
                  <span>
                    {ELEMENTS[symbol]?.symbol || symbol} — {ELEMENTS[symbol]?.name || symbol}
                  </span>
                  <span className="font-display">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-muted-foreground print:text-black">
              Zastosowania
            </h2>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-sm">
              {compound.uses.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-5 print:break-inside-avoid">
          <SimpleLanguage compound={compound} />
        </div>

        <section className="mt-5 grid gap-2 print:break-inside-avoid">
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-muted-foreground print:text-black">
            Zadania do wykonania
          </h2>
          {[
            `Zapisz wzór sumaryczny i podaj, czy związek tworzy cząsteczki, czy sieć jonową.`,
            `Policz, ile atomów każdego pierwiastka znajduje się w jednej jednostce związku.`,
            structure.ionic
              ? `Wyjaśnij, dlaczego ${compound.name} przewodzi prąd w stanie stopionym.`
              : `Odczytaj z modelu kąt między wiązaniami i wyjaśnij, czy cząsteczka jest polarna.`,
            `Podaj dwa zastosowania i jeden środek ostrożności przy pracy z tą substancją.`,
          ].map((task, index) => (
            <p key={task} className="text-sm">
              {index + 1}. {task}
            </p>
          ))}
          <div className="mt-2 space-y-4">
            {[0, 1, 2].map((line) => (
              <div key={line} className="border-b border-border/60 pb-4 print:border-black/25" />
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}