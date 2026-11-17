import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, TriangleAlert } from "lucide-react";
import { lookupPubChem } from "@/lib/pubchem";
import PubChemResult from "@/components/pubchem/PubChemResult";

// Wyszukiwarka PubChem: dowolna nazwa lub wzór, z fallbackiem formula → CID.
export default function PubChemSearch({ compact = false }) {
  const lookup = useServerFn(lookupPubChem);
  const [query, setQuery] = useState("");
  const [state, setState] = useState({ status: "idle" });

  const submit = async (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    setState({ status: "loading" });
    try {
      const result = await lookup({ data: { query: value } });
      setState(result);
    } catch (error) {
      setState({
        status: "error",
        message: error?.message || "Nie udało się połączyć z PubChem.",
      });
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-panel sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            PubChem · miliony związków
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Znajdź dowolny związek
          </h2>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] text-primary">
          Dane na żywo
        </span>
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="pubchem-query">
          Nazwa lub wzór związku
        </label>
        <input
          id="pubchem-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="np. kwas octowy, caffeine, Ca(OH)2, H2SO4"
          className="h-11 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-display text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {state.status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Szukaj
        </button>
      </form>

      {state.status === "loading" ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Pytam PubChem o właściwości i nazwę IUPAC…
        </p>
      ) : null}

      {state.status === "error" ? (
        <div className="mt-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm">
          <p className="flex items-center gap-2 font-medium text-amber-200">
            <TriangleAlert className="h-4 w-4" />
            Brak odpowiedzi z PubChem
          </p>
          <p className="mt-1 text-muted-foreground">{state.message}</p>
        </div>
      ) : null}

      {state.status === "not_found" ? (
        <p className="mt-4 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          PubChem nie znalazł rekordu dla „{state.query}”. Spróbuj pełnej nazwy lub wzoru
          sumarycznego.
        </p>
      ) : null}

      {state.status === "ok" ? (
        <>
          {state.translation ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Zapytanie przetłumaczone automatycznie: „{state.query}” → „{state.translation}”, bo
              PubChem indeksuje angielskie nazwy.
            </p>
          ) : null}
          {!compact && state.matchedBy === "formula" ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Dopasowanie po wzorze sumarycznym · CID zwrócony przez PubChem.
            </p>
          ) : null}
          <PubChemResult result={state} />
        </>
      ) : null}
    </div>
  );
}