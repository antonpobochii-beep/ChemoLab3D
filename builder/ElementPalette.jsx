import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ELEMENTS_TABLE } from "@/lib/elements";
import { elementSpec } from "@/lib/elementVisuals";
import { cn } from "@/lib/utils";

const QUICK = ["H", "C", "N", "O", "Na", "Mg", "P", "S", "Cl", "K", "Ca", "Fe"];

// Paleta wszystkich 118 pierwiastków: szybki wybór najczęstszych + pełna tablica z wyszukiwaniem.
export default function ElementPalette({ selected, onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return ELEMENTS_TABLE;
    return ELEMENTS_TABLE.filter(
      (element) =>
        element.symbol.toLowerCase().startsWith(value) ||
        element.name.toLowerCase().includes(value) ||
        String(element.z) === value
    );
  }, [query]);

  return (
    <div>
      <div className="grid grid-cols-6 gap-1.5">
        {QUICK.map((symbol) => {
          const spec = elementSpec(symbol);
          return (
            <button
              key={symbol}
              type="button"
              onClick={() => onSelect(symbol)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1.5 text-[11px] transition-colors",
                selected === symbol
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <span
                className="h-3 w-3 rounded-full ring-1 ring-black/20"
                style={{ backgroundColor: spec.color }}
              />
              {symbol}
            </button>
          );
        })}
      </div>

      <label className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Szukaj: symbol, nazwa, liczba atomowa"
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-border/70 p-1.5">
        <div className="grid grid-cols-6 gap-1">
          {filtered.map((element) => {
            const spec = elementSpec(element.symbol);
            return (
              <button
                key={element.z}
                type="button"
                onClick={() => onSelect(element.symbol)}
                title={`${element.name} · Z = ${element.z}`}
                className={cn(
                  "rounded-md border px-1 py-1 text-[10px] transition-colors",
                  selected === element.symbol
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                )}
              >
                <span
                  className="mx-auto mb-0.5 block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: spec.color }}
                />
                {element.symbol}
              </button>
            );
          })}
          {!filtered.length ? (
            <p className="col-span-6 px-2 py-3 text-center text-[11px] text-muted-foreground">
              Brak pierwiastka o tej nazwie.
            </p>
          ) : null}
        </div>
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">118 pierwiastków tablicy Mendelejewa</p>
    </div>
  );
}