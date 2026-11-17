import {
  ArrowRight,
  Equal,
  Eraser,
  Hash,
  Link2,
  Minus,
  Move,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Undo2,
  Zap,
} from "lucide-react";
import ElementPalette from "@/components/builder/ElementPalette";
import { COMPOUNDS } from "@/lib/chemistry";
import { classifyFormula } from "@/lib/structure";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "drag", label: "Przesuwaj", icon: Move },
  { id: "bond", label: "Połącz", icon: Link2 },
  { id: "erase", label: "Usuń", icon: Eraser },
];

const BOND_TYPES = [
  { order: 1, kind: "covalent", label: "Pojedyncze", icon: Minus },
  { order: 2, kind: "covalent", label: "Podwójne", icon: Equal },
  { order: 3, kind: "covalent", label: "Potrójne", icon: Hash },
  { order: 1, kind: "coordinate", label: "Koordynacyjne", icon: ArrowRight },
  { order: 1, kind: "ionic", label: "Jonowe", icon: Zap },
];

// Panel narzędzi edytora 3D: tryb pracy, typ wiązania, atomy i akcje.
export default function Builder3DTools({
  mode,
  onModeChange,
  bond,
  onBondChange,
  onAddAtom,
  onClear,
  onUndo,
  onResetView,
  onLoad,
  onCheck,
  canCheck,
  lastAdded,
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[1.5rem] border border-border bg-card p-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Narzędzie</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {MODES.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onModeChange(item.id)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] transition-colors",
                  active
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "bond" ? (
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Rodzaj wiązania
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {BOND_TYPES.map((item) => {
              const Icon = item.icon;
              const active = bond.order === item.order && bond.kind === item.kind;
              return (
                <button
                  key={`${item.kind}-${item.order}`}
                  type="button"
                  onClick={() => onBondChange({ order: item.order, kind: item.kind })}
                  aria-pressed={active}
                  title={
                    item.kind === "ionic"
                      ? "Wiązanie jonowe: bez pałeczki, jony obok siebie"
                      : item.kind === "coordinate"
                        ? "Wiązanie koordynacyjne: para elektronowa od donora"
                        : `Wiązanie ${item.label.toLowerCase()}`
                  }
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] transition-colors",
                    active
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
          {bond.kind === "ionic" ? (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Wiązanie jonowe nie rysuje pałeczki — jony tworzą sieć, nie cząsteczkę.
            </p>
          ) : null}
        </div>
      ) : null}

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Dodaj atom — wybierz pierwiastek
        </p>
        <div className="mt-2">
          <ElementPalette selected={lastAdded} onSelect={onAddAtom} />
        </div>
      </div>

      <button
        type="button"
        onClick={onCheck}
        disabled={!canCheck}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/45 bg-primary/10 px-3 py-2.5 font-display text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShieldCheck className="h-4 w-4" />
        Sprawdź, czy związek może istnieć naprawdę
      </button>

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Gotowy wzór do zabawy
        </p>
        <select
          value=""
          onChange={(event) => {
            if (event.target.value) onLoad(event.target.value);
          }}
          className="mt-2 w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50"
        >
          <option value="">Wczytaj cząsteczkę…</option>
          {COMPOUNDS.filter((compound) => !classifyFormula(compound.formula).ionic).map((compound) => (
            <option key={compound.id} value={compound.id}>
              {compound.name} ({compound.formula})
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Sole i wodorotlenki mają budowę jonową — oglądaj je w katalogu jako sieć krystaliczną.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Cofnij
        </button>
        <button
          type="button"
          onClick={onResetView}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Widok
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Wyczyść
        </button>
      </div>
    </div>
  );
}