import { ELEMENTS } from "@/lib/chemistry";
import { bondKey } from "@/lib/acidBuilder";
import { boundsOf, offsetSegment, trimSegment } from "@/lib/structural";
import { cn } from "@/lib/utils";

const SLOT_PAD = 16;

// Plansza: atomy w miejscach wynikających z geometrii cząsteczki + rysowane wiązania.
export default function MoleculeBoard({
  compound,
  placed,
  bonds,
  pending,
  result,
  onSlotClick,
  onBondClick,
}) {
  const atoms = compound.structural.atoms;
  const natural = boundsOf(atoms, 34);
  // Plansza nie może być zbyt szeroka ani zbyt wysoka — inaczej atomy zachodzą na siebie.
  const naturalRatio = natural.w / natural.h;
  const boardWidth = naturalRatio > 1.6 ? natural.w : naturalRatio < 0.85 ? natural.h * 0.85 : natural.w;
  const boardHeight = naturalRatio > 1.6 ? natural.w / 1.6 : naturalRatio < 0.85 ? natural.h : natural.h;
  const box = {
    x: natural.x - (boardWidth - natural.w) / 2,
    y: natural.y - (boardHeight - natural.h) / 2,
    w: boardWidth,
    h: boardHeight,
  };
  const toPercent = (value, min, size) => ((value - min) / size) * 100;

  const wrongAtoms = new Set(result && !result.ok ? result.wrongAtoms : []);
  const wrongBonds = new Set(result && !result.ok ? result.extraBondKeys : []);

  return (
    <div
      className="relative w-full rounded-[1.5rem] border border-border bg-background/60 bg-[radial-gradient(circle_at_1px_1px,hsl(190_90%_60%/0.22)_1px,transparent_0)] bg-[length:18px_18px]"
      style={{ aspectRatio: `${box.w} / ${box.h}` }}
    >
      <svg
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {bonds.map((bond, index) => {
          const from = atoms[bond.a];
          const to = atoms[bond.b];
          const seg = trimSegment(from, to, SLOT_PAD, SLOT_PAD);
          const invalid = wrongBonds.has(bondKey(bond.a, bond.b, bond.order));
          const stroke = invalid ? "hsl(3 90% 62% / 0.9)" : "hsl(190 45% 62% / 0.85)";

          return (
            <g
              key={`${bond.a}-${bond.b}-${bond.order}-${index}`}
              className="cursor-pointer"
              onClick={() => onBondClick(index)}
            >
              <line
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="transparent"
                strokeWidth="22"
              />
              {bond.order === 2 ? (
                [4.2, -4.2].map((shift) => {
                  const line = offsetSegment(seg, shift);
                  return (
                    <line
                      key={shift}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={stroke}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  );
                })
              ) : (
                <line
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke={stroke}
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {pending !== null ? (
          <circle
            cx={atoms[pending].x}
            cy={atoms[pending].y}
            r="24"
            fill="none"
            stroke="hsl(165 100% 50%)"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
        ) : null}
      </svg>

      {atoms.map((atom, index) => {
        const element = placed[index] ? ELEMENTS[placed[index]] : null;
        const isPending = pending === index;
        const isWrong = wrongAtoms.has(index);

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSlotClick(index)}
            style={{
              left: `${toPercent(atom.x, box.x, box.w)}%`,
              top: `${toPercent(atom.y, box.y, box.h)}%`,
            }}
            className={cn(
              "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[13px] font-semibold transition-transform duration-150 hover:scale-105 active:scale-95 sm:h-12 sm:w-12 sm:text-sm",
              "font-display",
              element
                ? "text-[#20292a] shadow-sm ring-1 ring-white/20"
                : "border-2 border-dashed border-border bg-card/70 text-muted-foreground",
              isPending && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              isWrong && "ring-2 ring-destructive ring-offset-2 ring-offset-background"
            )}
            aria-label={`Pozycja ${index + 1}`}
          >
            <span
              className="flex h-full w-full items-center justify-center rounded-full"
              style={element ? { backgroundColor: element.color } : undefined}
            >
              {element ? placed[index] : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}