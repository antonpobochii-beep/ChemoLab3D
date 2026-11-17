import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly, Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Maximize2,
  Minimize2,
  Move3d,
  ScanEye,
} from "lucide-react";
import ARCamera from "@/components/ar/ARCamera";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { COMPOUNDS, getCompound } from "@/lib/chemistry";
import { analyzeCompound, latticeIons } from "@/lib/structure";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));
const CrystalLattice = lazy(() => import("@/components/molecule/CrystalLattice"));

export const Route = createFileRoute("/_site/ar")({
  component: ARPage,
  validateSearch: (search) => ({
    model: typeof search.model === "string" ? search.model : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tryb AR — model 3D na kamerze | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Augmented reality w chemii: wyciągnij dowolny model 3D z modułu, ustaw go na kamerze, obracaj i skaluj — także w pełnym ekranie.",
      },
    ],
  }),
});

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      Ładowanie modelu…
    </div>
  );
}

function ARPage() {
  const { model } = Route.useSearch();
  const [modelId, setModelId] = useState(model ?? "h2o");
  const [cameraOn, setCameraOn] = useState(true);
  const [scale, setScale] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const shellRef = useRef(null);

  useEffect(() => {
    if (model) setModelId(model);
  }, [model]);

  useEffect(() => {
    const onChange = () => setExpanded(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const compound = getCompound(modelId) ?? COMPOUNDS[0];
  const ionic = analyzeCompound(compound).ionic;
  const ions = latticeIons(compound);

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    await shellRef.current?.requestFullscreen?.().catch(() => {});
  }

  return (
    <PageShell
      eyebrow="Tryb AR"
      title="Model 3D na kamerze"
      lead="Wyciągnij dowolny model z modułu, ustaw go na kamerze i obejdź dookoła. Jeden przycisk w każdym module 3D prowadzi tutaj z gotowym modelem."
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCameraOn((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {cameraOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            {cameraOn ? "Wyłącz kamerę" : "Włącz kamerę"}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {expanded ? "Zamknij widok" : "Wyciągnij model"}
          </button>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div ref={shellRef} className="relative">
          <ARCamera enabled={cameraOn} className="h-[520px] w-full">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div
                className="h-full w-full transition-transform duration-200"
                style={{ transform: `scale(${scale})` }}
              >
                <ClientOnly fallback={<ViewerFallback />}>
                  <Suspense fallback={<ViewerFallback />}>
                    {ionic && ions ? (
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
            </div>

            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/85 px-3 py-1.5 text-[11px] text-muted-foreground">
              <Move3d className="h-3.5 w-3.5 text-primary" />
              Przeciągnij, aby obrócić · kółkiem lub szczypnięcia zmienisz zbliżenie
            </div>

            <div className="absolute left-4 top-4 rounded-xl border border-border bg-background/85 px-3 py-2">
              <p className="flex items-baseline gap-2 font-display text-lg">
                <ChemFormula text={compound.formula} />
                <span className="text-[10px] font-normal text-muted-foreground">
                  {compound.name}
                </span>
              </p>
            </div>

            <Link
              to="/zwiazki/$compoundId"
              params={{ compoundId: compound.id }}
              className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-border bg-background/85 px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3 w-3 rotate-180" />
              Karta
            </Link>
          </ARCamera>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <ScanEye className="h-3.5 w-3.5 text-primary" />
              Wyciągnięty model
            </p>
            <select
              value={compound.id}
              onChange={(event) => setModelId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
            >
              {COMPOUNDS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.formula} — {item.name}
                </option>
              ))}
            </select>

            <label className="mt-3 block">
              <span className="flex items-center justify-between text-[11px] text-muted-foreground">
                Skala modelu
                <span className="font-display text-foreground">{scale.toFixed(2)}×</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={scale}
                onChange={(event) => setScale(Number(event.target.value))}
                className="mt-1.5 w-full accent-[hsl(var(--primary))]"
              />
            </label>

            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              {ionic
                ? "To sieć jonowa — model pokazuje komórkę 3×3×3 jonów, bez pałeczek wiązań."
                : "Model kuleczkowo-pręcikowy z prawdziwymi długościami i kątami wiązań."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Jak używać
            </p>
            <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
              <li>1. Włącz kamerę i skieruj ją na równe biurko.</li>
              <li>2. Wybierz model — każdy moduł 3D otwiera tutaj swój model.</li>
              <li>3. „Wyciągnij model" rozkłada widok na pełny ekran.</li>
              <li>4. Przeciąganie obraca model, suwak ustawia jego rozmiar.</li>
            </ol>
          </div>
        </div>
      </div>
    </PageShell>
  );
}