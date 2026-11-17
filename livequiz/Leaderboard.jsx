import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// Tabela wyników turnieju.
export default function Leaderboard({ players, meId }) {
  if (!players.length) return null;

  return (
    <ol className="space-y-1.5">
      {players.map((player, index) => (
        <li
          key={player.id}
          className={cn(
            "flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm",
            player.id === meId ? "border-primary/50 bg-primary/10" : "border-border bg-card"
          )}
        >
          <span className="w-6 shrink-0 text-center font-display text-xs text-muted-foreground">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1 truncate">{player.name}</span>
          {player.streak ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-primary">
              <Flame className="h-3.5 w-3.5" />
              {player.streak}
            </span>
          ) : null}
          <span className="shrink-0 font-display text-sm font-semibold text-primary">
            {player.score ?? 0}
          </span>
        </li>
      ))}
    </ol>
  );
}