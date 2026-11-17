import { lazy, Suspense, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ClientOnly, Link, createFileRoute } from "@tanstack/react-router";
import { Box, Check, ChevronRight, MousePointer2, Save, Sparkles } from "lucide-react";
import Builder3DTools from "@/components/builder3d/Builder3DTools";
import ARLauncher from "@/components/ar/ARLauncher";
import { playSound } from "@/lib/sound";
import ValidityReport from "@/components/builder3d/ValidityReport";
import ChemFormula from "@/components/ChemFormula";
import { COMPOUNDS, formulaFromCounts, getCompound } from "@/lib/chemistry";
import { canonicalFormula } from "@/lib/formulaCanonical";
import { checkStructure } from "@/lib/valence";
import { verifyFormulaInPubChem } from "@/lib/pubchem";
import { addMolecule, logEvent } from "@/lib/labStore";

const Builder3DCanvas = lazy(() => import("@/components/builder3d/Builder3DCanvas"));

export const Route = createFileRoute("/_site/ukladanie-3d")({
  head: () => ({
    meta: [
      { title: "Układanie cząsteczek w 3D — Chemia 3D" },
      {
        name: "description",
        content:
          "Trójwymiarowy edytor cząsteczek: przeciągaj atomy myszką, łącz je w wiązania i obracaj całą scenę, budując modele kuleczkowo-pręcikowe.",
      },
    ],
  }),
  component: Ukladanie3DPage,
});

const HINTS = {
  drag: "Przeciągnij kulę, aby przesunąć atom. Przeciągnięcie tła obraca scenę.",
  bond: "Kliknij dwa atomy, aby połączyć je pałeczką (wiążaniem).",
  erase: "Kliknij atom lub wiązanie, aby je usunąć.",
};

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
      Ładowanie sceny 3D…
    </div>
  );
}

function Ukladanie3DPage() {
  const canvasApi = useRef(null);
  const verify = useServerFn(verifyFormulaInPubChem);
  const [mode, setMode] = useState("drag");
  const [bond, setBond] = useState({ order: 1, kind: "covalent" });
  const [lastAdded, setLastAdded] = useState("O");
  const [stats, setStats] = useState({ atoms: 0, bonds: 0, counts: {} });
  const [saved, setSaved] = useState(false);
  const [check, setCheck] = useState(null);

  const formula = canonicalFormula(formulaFromCounts(stats.counts));

  async function handleCheck() {
    const state = canvasApi.current?.getState?.();
    if (!state?.atoms?.length) return;

    const local = checkStructure(state);
    if (!formula) {
      setCheck({ local, formula: "", pubchem: { status: "error" } });
      return;
    }

    setCheck({ local, formula, pubchem: { status: "loading" } });
    try {
      const result = await verify({ data: { formula } });
      setCheck({
        local,
        formula,
        pubchem: result.found ? { status: "found", data: result } : { status: "missing" },
      });
    } catch {
      setCheck({ local, formula, pubchem: { status: "error" } });
    }
  }

  function handleAddAtom(symbol) {
    playSound("atom");
    setLastAdded(symbol);
    canvasApi.current?.addAtom(symbol);
  }

  function handleLoad(id) {
    const compound = getCompound(id);
    if (!compound) return;
    canvasApi.current?.load(compound.model);
    setSaved(false);
    logEvent({
      type: "molecule",
      label: `Wczytano model: ${compound.name}`,
      detail: `${compound.formula} — układ gotowy do edycji w 3D`,
    });
  }

  function handleSave() {
    const state = canvasApi.current?.getState?.();
    if (!state || !state.atoms.length) return;
    const match = COMPOUNDS.find((item) => item.formula === formula);
    addMolecule({
      name: match ? match.name : formula || "Własny układ",
      atoms: state.atoms,
      bonds: state.bonds,
    });
    setSaved(true);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <Box className="h-3.5 w-3.5 text-primary" />
            Tryb 3D
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Ułóż cząsteczkę w przestrzeni
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Kule to atomy, pałeczki to wiązania. Dodawaj pierwiastki, przeciągaj je myszką w trzech
            osiach i obracaj całą scenę, żeby obejrzeć model z każdej strony.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
            Atomy <strong className="font-display text-foreground">{stats.atoms}</strong>
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
            Wiązania <strong className="font-display text-foreground">{stats.bonds}</strong>
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1.5 font-display text-foreground">
            {formula ? <ChemFormula text={formula} /> : "—"}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={!stats.atoms}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Zapisano" : "Zapisz układ"}
          </button>
          <ARLauncher label="Tryb AR" />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
        <div className="rounded-[1.75rem] border border-border bg-card p-3 shadow-panel sm:p-4">
          <div className="relative h-[430px] overflow-hidden rounded-[1.35rem] border border-border/70 bg-[radial-gradient(120%_120%_at_50%_-10%,hsl(192_95%_55%/0.14),transparent_60%),linear-gradient(180deg,hsl(224_50%_6%),hsl(222_46%_9%))] sm:h-[540px]">
            <ClientOnly fallback={<CanvasFallback />}>
              <Suspense fallback={<CanvasFallback />}>
                <Builder3DCanvas
                  ref={canvasApi}
                  mode={mode}
                  bondOrder={bond.order}
                  bondKind={bond.kind}
                  onStats={setStats}
                  className="h-full w-full"
                />
              </Suspense>
            </ClientOnly>

            <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur">
                <MousePointer2 className="h-3.5 w-3.5 text-primary" />
                {HINTS[mode]}
              </span>
              <span className="hidden shrink-0 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-primary/80 backdrop-blur sm:block">
                przeciągnij = obrót
              </span>
            </div>
          </div>
        </div>

        <Builder3DTools
          mode={mode}
          onModeChange={setMode}
          bond={bond}
          onBondChange={setBond}
          onAddAtom={handleAddAtom}
          onClear={() => canvasApi.current?.clear()}
          onUndo={() => canvasApi.current?.undo()}
          onResetView={() => canvasApi.current?.resetView()}
          onLoad={handleLoad}
          onCheck={handleCheck}
          canCheck={Boolean(stats.atoms)}
          lastAdded={lastAdded}
        />
      </div>

      {check ? (
        <div className="mt-4">
          <ValidityReport result={check} />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[1.5rem] border border-border bg-card p-6">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Jak budować w 3D
          </p>
          <ol className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            {[
              "Kliknij pierwiastek w palecie — nowa kula pojawi się w scenie.",
              "Przeciągnij kulę myszką, aby ustawić ją w przestrzeni; tło obraca kamerę.",
              "Wybierz „Połącz” i kliknij dwa atomy — powstanie pałeczka. Podwójne wiązanie też.",
              "„Usuń” czyści atom lub wiązanie, a „Cofnij” przywraca poprzedni stan.",
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

        <div className="flex flex-col gap-3">
          <Link
            to="/ukladanie"
            className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-card px-5 py-4 text-sm transition-colors hover:border-primary/30 hover:text-primary"
          >
            <span>
              Zadania z oceną poprawności
              <span className="block text-xs text-muted-foreground">
                Ułóż cząsteczkę na planszy i sprawdź wynik
              </span>
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            to="/zwiazki"
            className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-card px-5 py-4 text-sm transition-colors hover:border-primary/30 hover:text-primary"
          >
            <span>
              Katalog związków
              <span className="block text-xs text-muted-foreground">18 modeli 3D do obejrzenia</span>
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}