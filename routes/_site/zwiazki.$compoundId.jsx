import { Suspense, lazy, useEffect, useState } from "react";
import { ClientOnly, Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Boxes,
  Cloud,
  Crosshair,
  Heart,
  Move3d,
  Play,
  RotateCcw,
  Ruler,
} from "lucide-react";
import { COMPOUNDS, getCompound, getCategory } from "@/lib/chemistry";
import CompoundInfoCard from "@/components/CompoundInfoCard";
import PolarityNote from "@/components/compound/PolarityNote";
import ARLauncher from "@/components/ar/ARLauncher";
import DynamicsPanel from "@/components/molecule/DynamicsPanel";
import { orbitalPlan } from "@/lib/orbitals";
import { Printer } from "lucide-react";
import PresentationMode from "@/components/presentation/PresentationMode";
import PubChemPanel from "@/components/molecule/PubChemPanel";
import ChemFormula from "@/components/ChemFormula";
import { analyzeCompound, latticeIons, terminology } from "@/lib/structure";
import { logEvent, markViewed, toggleFavorite, useLabStore } from "@/lib/labStore";
import { cn } from "@/lib/utils";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));
const MeasureViewer = lazy(() => import("@/components/molecule/MeasureViewer"));

export const Route = createFileRoute("/_site/zwiazki/$compoundId")({
  component: CompoundPage,
  head: ({ params }) => {
    const compound = getCompound(params?.compoundId);
    const ionic = compound ? analyzeCompound(compound).ionic : false;
    return {
      meta: [
        {
          title: compound
            ? `${compound.name} — ${ionic ? "sieć krystaliczna 3D" : "model 3D cząsteczki"} | Chemia 3D`
            : "Chemia 3D",
        },
        {
          name: "description",
          content: compound
            ? `${compound.name} (${compound.formula}): ${
                ionic
                  ? "sieć jonowa z liczbą koordynacyjną 6, zapis Lewisa z ładunkami"
                  : "model 3D cząsteczki, wzór strukturalny"
              }, dane z PubChem i zastosowania.`
            : "Interaktywne modele cząsteczek i sieci jonowych związków nieorganicznych.",
        },
      ],
    };
  },
});

function CompoundPage() {
  const { compoundId } = Route.useParams();
  const compound = getCompound(compoundId);
  const { favorites } = useLabStore();
  const favorite = compound ? favorites.includes(compound.id) : false;
  const [presenting, setPresenting] = useState(false);
  const [showCloud, setShowCloud] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [showOrbitals, setShowOrbitals] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [irMode, setIrMode] = useState(false);

  useEffect(() => {
    if (!compound) return;
    const ionic = analyzeCompound(compound).ionic;
    markViewed(compound.id);
    logEvent({
      type: "compound",
      label: compound.name,
      detail: `Wzór ${compound.formula} — ${ionic ? "struktura jonowa" : "struktura kowalencyjna"}`,
    });
  }, [compound?.id]);

  if (!compound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">Nie znaleziono tego związku</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Wybierz jedną z substancji dostępnych w katalogu.
        </p>
        <Link
          to="/zwiazki"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Wróć do katalogu
        </Link>
      </div>
    );
  }

  const index = COMPOUNDS.findIndex((item) => item.id === compound.id);
  const previous = COMPOUNDS[(index - 1 + COMPOUNDS.length) % COMPOUNDS.length];
  const next = COMPOUNDS[(index + 1) % COMPOUNDS.length];
  const category = getCategory(compound.category);
  const structure = analyzeCompound(compound);
  const terms = terminology(structure.ionic);
  const ions = structure.ionic ? latticeIons(compound) : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/zwiazki"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Wszystkie związki
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPresenting(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
          >
            <Play className="h-4 w-4" /> Tryb prezentacji
          </button>
          <Link
            to="/porownanie"
            search={{ a: compound.id }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeftRight className="h-4 w-4" /> Porównaj
          </Link>
          <ARLauncher modelId={compound.id} />
          <Link
            to="/karta-pracy/$compoundId"
            params={{ compoundId: compound.id }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Printer className="h-4 w-4" /> Karta pracy PDF
          </Link>
          <button
            type="button"
            onClick={() => toggleFavorite(compound.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
              favorite
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
            {favorite ? "W ulubionych" : "Dodaj do ulubionych"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {COMPOUNDS.map((item) => (
          <Link
            key={item.id}
            to="/zwiazki/$compoundId"
            params={{ compoundId: item.id }}
            className={cn(
              "rounded-full border px-4 py-2 font-display text-sm transition-all",
              item.id === compound.id
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
            )}
          >
            <ChemFormula text={item.formula} />
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[radial-gradient(120%_95%_at_50%_0%,hsl(var(--secondary))_0%,hsl(var(--background))_72%)] shadow-glow">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl"
              style={{ backgroundColor: compound.accent, opacity: 0.26 }}
            />
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: compound.accent }} />
              <span className="font-display text-xs font-medium tracking-wide">
                <ChemFormula text={compound.formula} />
              </span>
              <span className="text-xs text-muted-foreground">
                {structure.ionic ? terms.model.toLowerCase() : category.single}
              </span>
            </div>
            <div className="absolute right-4 top-4 z-10 flex max-w-[72%] flex-wrap justify-end gap-1.5">
              {!structure.ionic ? (
                <button
                  type="button"
                  onClick={() => setShowCloud((value) => !value)}
                  title="Pokaż chmurę elektronową i polarność"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] backdrop-blur transition-colors",
                    showCloud
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/70 bg-background/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Cloud className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Chmura elektronowa</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowMeasurements((value) => !value)}
                title="Pokaż kąty i długości wiązań"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] backdrop-blur transition-colors",
                  showMeasurements
                    ? "border-primary/60 bg-primary/20 text-primary"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:text-foreground"
                )}
              >
                <Ruler className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Kąty i długości</span>
              </button>
              {!structure.ionic ? (
                <button
                  type="button"
                  onClick={() => setMeasuring((value) => !value)}
                  title="Klikaj atomy, aby zmierzyć odległość i kąt"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] backdrop-blur transition-colors",
                    measuring
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/70 bg-background/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Pomiar</span>
                </button>
              ) : null}
            </div>
            <div className="h-[360px] w-full sm:h-[460px] lg:h-[540px]">
              <ClientOnly fallback={<ViewerFallback />}>
                <Suspense fallback={<ViewerFallback />}>
                  {structure.ionic && ions ? (
                    <CrystalLattice
                      key={compound.id}
                      cation={ions.cation}
                      anion={ions.anion}
                      showMeasurements={showMeasurements}
                      className="h-full w-full cursor-grab active:cursor-grabbing"
                    />
                  ) : measuring ? (
                    <MeasureViewer
                      key={`pomiar-${compound.id}`}
                      model={compound.model}
                      className="h-full w-full"
                    />
                  ) : (
                    <MoleculeViewer
                      key={compound.id}
                      model={compound.model}
                      showCloud={showCloud}
                      showMeasurements={showMeasurements}
                      showOrbitals={showOrbitals}
                      temperature={temperature}
                      irMode={irMode}
                      className="h-full w-full cursor-grab active:cursor-grabbing"
                    />
                  )}
                </Suspense>
              </ClientOnly>
            </div>

            {structure.ionic ? (
              <p className="relative border-t border-border/60 bg-background/70 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-primary backdrop-blur">
                Sieć krystaliczna (Brak wydzielonych cząsteczek wg IUPAC)
              </p>
            ) : null}

            {structure.ionic && ions ? (
              <div className="relative flex flex-wrap items-center gap-2 border-t border-border/60 bg-background/70 px-5 py-3 text-xs backdrop-blur">
                {[ions.cation, ions.anion].map((ion, position) => (
                  <span
                    key={ion.symbol}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full ring-1 ring-black/20"
                      style={{ backgroundColor: ion.color }}
                    />
                    <span className="font-display">
                      {ion.symbol}
                      <sup className="ml-0.5 text-[0.65em]">
                        {ion.charge > 1 ? ion.charge : ""}
                        {position === 0 ? "+" : "−"}
                      </sup>
                    </span>
                    <span className="text-muted-foreground">
                      {position === 0 ? "kation" : "anion"}
                    </span>
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
                  <Boxes className="h-3.5 w-3.5" />
                  27 jonów · CN = 6
                </span>
              </div>
            ) : null}

            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-background/70 px-5 py-3 text-xs text-muted-foreground backdrop-blur">
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Przeciągnij, aby obrócić
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Move3d className="h-3.5 w-3.5" />
                Scroll / pinch, aby przybliżyć
              </span>
            </div>
          </div>

          {!structure.ionic ? (
            <DynamicsPanel
              orbitals={showOrbitals}
              onOrbitals={setShowOrbitals}
              temperature={temperature}
              onTemperature={setTemperature}
              irMode={irMode}
              onIrMode={setIrMode}
              plan={orbitalPlan(compound.model)}
            />
          ) : null}

          {!structure.ionic ? <PolarityNote compound={compound} /> : null}

          {structure.ionic ? (
            <Link
              to="/ukladanie-3d"
              className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm transition-all hover:border-primary/60 hover:text-primary hover:shadow-glow-sm"
            >
              <span>
                Zbuduj własny model 3D
                <span className="block text-xs text-muted-foreground">
                  {terms.note}
                </span>
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/ukladanie"
              search={{ zwiazek: compound.id }}
              className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm transition-all hover:border-primary/60 hover:text-primary hover:shadow-glow-sm"
            >
              <span>
                Ułóż tę cząsteczkę sam
                <span className="block text-xs text-muted-foreground">
                  Układanka z atomów i wiązań dla {compound.formula}
                </span>
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <CompoundInfoCard compound={compound} />
          <PubChemPanel compound={compound} />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/zwiazki/$compoundId"
          params={{ compoundId: previous.id }}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm transition-colors hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {previous.name}
        </Link>
        <Link
          to="/zwiazki/$compoundId"
          params={{ compoundId: next.id }}
          className="group inline-flex items-center justify-end gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm transition-colors hover:border-primary/30 hover:text-primary"
        >
          {next.name}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {presenting ? (
        <PresentationMode compound={compound} onClose={() => setPresenting(false)} />
      ) : null}
    </div>
  );
}

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-pulse rounded-full border-2 border-primary/30 bg-primary/10" />
    </div>
  );
}