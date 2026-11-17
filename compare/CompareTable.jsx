import ChemFormula from "@/components/ChemFormula";
import { cn } from "@/lib/utils";

// Tabela różnic: wiersze, w których związki się różnią, są podświetlone.
export default function CompareTable({ rows }) {
  const differences = rows.filter((row) => row.left !== row.right);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <p className="font-display text-sm font-semibold">Zestawienie danych</p>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px]",
            differences.length
              ? "bg-primary/15 text-primary"
              : "border border-border text-muted-foreground"
          )}
        >
          {differences.length ? `${differences.length} różnic` : "brak różnic"}
        </span>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-background/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <th className="px-4 py-2 text-left font-medium">Związek A</th>
            <th className="px-2 py-2 text-center font-medium">Cecha</th>
            <th className="px-4 py-2 text-right font-medium">Związek B</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const differs = row.left !== row.right;
            return (
              <tr
                key={row.label}
                className={cn("border-t border-border/60", differs && "bg-primary/10")}
              >
                <td className="px-4 py-2.5 align-top">
                  {row.formula ? <ChemFormula text={row.left} /> : <span>{row.left}</span>}
                </td>
                <td className="px-2 py-2.5 text-center align-top text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {row.label}
                </td>
                <td className="px-4 py-2.5 text-right align-top">
                  {row.formula ? <ChemFormula text={row.right} /> : <span>{row.right}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}