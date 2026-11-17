import { boundsOf, LABEL_PAD, offsetSegment, trimSegment } from "@/lib/structural";

// Rysuje wzór strukturalny jako SVG (wiązania pojedyncze i podwójne).
export default function StructuralFormula({ compound, className = "", strokeWidth = 2.6 }) {
  const { atoms, bonds } = compound.structural;
  const viewBox = boundsOf(atoms, 26);

  return (
    <svg
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      className={className}
      role="img"
      aria-label={`Wzór strukturalny: ${compound.name}`}
    >
      {bonds.map((bond, index) => {
        const from = atoms[bond.a];
        const to = atoms[bond.b];
        const seg = trimSegment(from, to, LABEL_PAD[from.el] ?? 14, LABEL_PAD[to.el] ?? 14);
        if (bond.order === 2) {
          const offset = 4;
          return (
            <g key={index}>
              {[offset, -offset].map((shift) => {
                const line = offsetSegment(seg, shift);
                return (
                  <line
                    key={shift}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="currentColor"
                    strokeWidth={strokeWidth * 0.72}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        }
        return (
          <line
            key={index}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      })}

      {atoms.map((atom, index) => (
        <text
          key={index}
          x={atom.x}
          y={atom.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display"
          fontSize="23"
          fontWeight="600"
          fill="currentColor"
        >
          {atom.el}
        </text>
      ))}
    </svg>
  );
}