import { ELEMENTS, ELEMENT_ORDER } from "@/lib/chemistry";
import { cn } from "@/lib/utils";

// Paleta atomów: wybierz pierwiastek, a potem kliknij miejsce na planszy.
export default function AtomPalette({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {ELEMENT_ORDER.map((symbol) => {
        const element = ELEMENTS[symbol];
        const active = selected === symbol;
        return (
          <button
            key={symbol}
            type="button"
            onClick={() => onSelect(symbol)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-2 transition-all duration-200",
              active
                ? "border-primary/40 bg-primary/5 shadow-sm"
                : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/25"
            )}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full font-display text-[11px] font-semibold text-[#20292a] ring-1 ring-black/10"
              style={{ backgroundColor: element.color }}
            >
              {symbol}
            </span>
            <span className="text-[10px] leading-none text-muted-foreground">{element.name}</span>
          </button>
        );
      })}
    </div>
  );
}