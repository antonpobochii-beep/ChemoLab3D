import { cn } from "@/lib/utils";
import { LIVE_AVATARS } from "@/lib/liveQuiz";

// Kafelki graczy w poczekalni.
export default function LobbyPlayers({ players, empty = "Czekamy na pierwszego gracza — pokaż kod QR klasie." }) {
  if (!players.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
        {empty}
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => {
        const avatar = LIVE_AVATARS.find((item) => item.symbol === player.avatar) ?? LIVE_AVATARS[0];
        return (
          <div
            key={player.id}
            className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-semibold"
              style={{ background: avatar.color, color: "#0a1120" }}
            >
              {avatar.symbol}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">{player.name}</span>
            {player.best_streak ? (
              <span className="shrink-0 text-[10px] text-primary">×{player.best_streak}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}