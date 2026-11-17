import { Check, Loader2, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Raport z walidacji: reguły chemiczne + weryfikacja wzoru w PubChem.
export default function ValidityReport({ result }) {
  if (!result) return null;

  const issues = result.local?.issues || [];
  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level !== "error");
  const pubchem = result.pubchem || { status: "idle" };

  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Sprawdzenie modelu
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px]",
            result.local?.ok
              ? "bg-primary/15 text-primary"
              : "bg-destructive/15 text-destructive"
          )}
        >
          {result.local?.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          {result.local?.ok ? "Reguły chemiczne spełnione" : `${errors.length} błędów`}
        </span>
      </div>

      <p className="mt-2 text-sm">
        Wzór: <strong className="font-display">{result.formula || "—"}</strong>
      </p>

      {issues.length ? (
        <ul className="mt-3 space-y-1.5 text-xs">
          {[...errors, ...warnings].map((issue, index) => (
            <li
              key={`${issue.text}-${index}`}
              className={cn(
                "flex gap-2 rounded-lg px-2 py-1.5",
                issue.level === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary/60 text-muted-foreground"
              )}
            >
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{issue.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          Wartościowości i oktety atomów się zgadzają.
        </p>
      )}

      <div className="mt-3 rounded-xl border border-border/70 bg-background/60 p-3 text-xs">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Weryfikacja w PubChem
        </p>
        {pubchem.status === "loading" ? (
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Sprawdzam, czy taki związek istnieje…
          </p>
        ) : null}
        {pubchem.status === "found" ? (
          <p className="mt-1">
            <span className="text-primary">Istnieje w bazie PubChem.</span>{" "}
            {pubchem.data?.iupacName || pubchem.data?.title}
            {pubchem.data?.weight ? ` · ${pubchem.data.weight} g/mol` : ""}
          </p>
        ) : null}
        {pubchem.status === "missing" ? (
          <p className="mt-1 text-amber-300">
            PubChem nie zna związku o tym wzorze — model może być hipotetyczny lub błędny.
          </p>
        ) : null}
        {pubchem.status === "error" ? (
          <p className="mt-1 text-muted-foreground">
            Nie udało się zapytać PubChem. Reguły lokalne nadal obowiązują.
          </p>
        ) : null}
      </div>
    </div>
  );
}