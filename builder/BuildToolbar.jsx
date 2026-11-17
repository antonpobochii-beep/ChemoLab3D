import { cn } from "@/lib/utils";

const tools = [
  { id: "atom", label: "Atomy" },
  { id: "bond", label: "Wiązania" },
  { id: "erase", label: "Gumka" },
];

export default function BuildToolbar({ tool, onToolChange, bondOrder, onBondOrderChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-full border border-border bg-background p-1">
        {tools.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToolChange(item.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              tool === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tool === "bond" ? (
        <div className="flex rounded-full border border-border bg-background p-1">
          {[
            { order: 1, label: "Pojedyncze" },
            { order: 2, label: "Podwójne" },
          ].map((item) => (
            <button
              key={item.order}
              type="button"
              onClick={() => onBondOrderChange(item.order)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                bondOrder === item.order
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}