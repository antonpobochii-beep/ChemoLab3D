// Pierścieniowy licznik czasu pytania.
export default function CountdownRing({ remainingMs, totalMs, size = 76 }) {
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const ratio = totalMs ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ratio < 0.25 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold">
        {seconds}
      </span>
    </div>
  );
}