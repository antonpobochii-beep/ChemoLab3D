import ChemFormula from "@/components/ChemFormula";
import { netIonicEquation, saltFormula, solubilityOf } from "@/lib/solubility";

// Szczegóły wybranej pary jonów: wzór soli, rozpuszczalność, kolor osadu.
export default function IonDetail({ selection }) {
  if (!selection) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Kliknij dowolną komórkę tabeli, aby zobaczyć wzór soli, rozpuszczalność i równanie
        wytrącania.
      </div>
    );
  }

  const { cation, anion } = selection;
  const result = solubilityOf(cation, anion);
  const formula = saltFormula(cation, anion);

  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-6">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {anion.name} {cation.genitive}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold">
        <ChemFormula text={formula} />
      </p>

      <div className="mt-4 flex items-center gap-3">
        {result.soluble ? (
          <span className="rounded-full bg-primary/12 px-3 py-1.5 text-xs text-primary">
            Substancja rozpuszczalna w wodzie
          </span>
        ) : (
          <>
            <span
              className="h-5 w-5 rounded-full ring-1 ring-white/30"
              style={{ backgroundColor: result.color }}
            />
            <span className="rounded-full bg-destructive/12 px-3 py-1.5 text-xs text-destructive">
              Osad nierozpuszczalny
            </span>
          </>
        )}
      </div>

      <p className="mt-4 rounded-xl bg-background px-3.5 py-3 font-mono text-xs text-foreground/85">
        {netIonicEquation(cation, anion)}
      </p>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {result.soluble
          ? "Jony pozostają w roztworze — w probówce nie pojawi się zmętnienie."
          : "Po zmieszaniu roztworów powstaje trudno rozpuszczalny osad, który opada na dno probówki."}
      </p>
    </div>
  );
}