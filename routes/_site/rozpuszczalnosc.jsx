import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Grid3x3 } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import SolubilityGrid from "@/components/solubility/SolubilityGrid";
import IonDetail from "@/components/solubility/IonDetail";
import ActivitySimulator from "@/components/solubility/ActivitySimulator";
import { SOLUBILITY_LEGEND } from "@/lib/solubility";

export const Route = createFileRoute("/_site/rozpuszczalnosc")({
  component: SolubilityPage,
  head: () => ({
    meta: [
      { title: "Tabela rozpuszczalności i szereg aktywności metali | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Interaktywna tabela rozpuszczalności soli: kliknij kation i anion, sprawdź wzór, kolor osadu i równanie wytrącania. Symulator wypierania metali z soli i kwasów.",
      },
    ],
  }),
});

function SolubilityPage() {
  const [selection, setSelection] = useState({
    cation: { id: "Ag", symbol: "Ag", charge: 1, name: "srebro", genitive: "srebra" },
    anion: { id: "Cl", symbol: "Cl", charge: 1, name: "chlorek", formula: "Cl" },
  });

  return (
    <PageShell
      eyebrow={
        <>
          <Grid3x3 className="h-3.5 w-3.5 text-primary" /> Rozpuszczalność
        </>
      }
      title="Tabela rozpuszczalności soli"
      lead="R — sól rozpuszczalna w wodzie, kolorowa kropka — osad, który wytrąca się po zmieszaniu roztworów. Kliknij komórkę, aby zobaczyć wzór i równanie jonowe."
    >
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <SolubilityGrid selection={selection} onSelect={setSelection} />
        <IonDetail selection={selection} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-border bg-card/70 p-5 sm:grid-cols-2">
        {SOLUBILITY_LEGEND.map((rule) => (
          <p key={rule} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {rule}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <Droplets className="h-4 w-4 text-primary" /> Szereg aktywności metali
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Metal wyżej w szeregu wypiera metal niżej stojący z roztworu jego soli. Metale przed
          wodorem wypierają wodór z rozcieńczonych kwasów.
        </p>
        <div className="mt-4">
          <ActivitySimulator />
        </div>
      </div>
    </PageShell>
  );
}