import { ELEMENTS_TABLE, ELEMENT_CATEGORIES, GROUP_LABELS } from "@/lib/elements";

// Układ okresowy: 18 grup, 7 okresów + wyodrębnione lantanowce i aktynowce.
export default function PeriodicTable({ selected, onSelect }) {
  const gridStyle = { gridTemplateColumns: "repeat(18, minmax(0, 1fr))" };

  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-3">
      <div className="min-w-[840px]">
        <div className="grid gap-1" style={gridStyle}>
          {GROUP_LABELS.map((group) => (
            <div
              key={group}
              className="pb-1 text-center text-[10px] font-medium text-muted-foreground"
            >
              {group}
            </div>
          ))}
        </div>

        <div className="grid gap-1" style={gridStyle}>
          {ELEMENTS_TABLE.map((element) => {
            const category = ELEMENT_CATEGORIES[element.category];
            const active = selected === element.symbol;
            return (
              <button
                key={element.z}
                type="button"
                onClick={() => onSelect(element)}
                style={{
                  gridColumn: element.col,
                  gridRow: element.row,
                  backgroundColor: category.bg,
                  color: category.ink,
                }}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-md border px-0.5 transition-transform duration-150 hover:z-10 hover:scale-105 ${
                  active ? "border-primary ring-2 ring-primary/50" : "border-white/10"
                }`}
                aria-label={`${element.name}, symbol ${element.symbol}`}
              >
                <span className="absolute left-1 top-0.5 text-[8px] leading-none opacity-70">
                  {element.z}
                </span>
                <span className="font-display text-[13px] font-semibold leading-none">
                  {element.symbol}
                </span>
                <span className="mt-0.5 hidden w-full truncate text-center text-[7px] leading-none opacity-80 lg:block">
                  {element.name}
                </span>
              </button>
            );
          })}

          <div
            style={{ gridColumn: 3, gridRow: 6 }}
            className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-[8px] text-muted-foreground"
          >
            57–71
          </div>
          <div
            style={{ gridColumn: 3, gridRow: 7 }}
            className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-[8px] text-muted-foreground"
          >
            89–103
          </div>
          <div style={{ gridColumn: "1 / -1", gridRow: 8 }} className="h-3" />
        </div>
      </div>
    </div>
  );
}