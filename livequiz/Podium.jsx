import { motion } from "framer-motion";
import { Crown, Trophy } from "lucide-react";
import { LIVE_AVATARS } from "@/lib/liveQuiz";
import { cn } from "@/lib/utils";

const BAR_HEIGHT = { 1: 96, 2: 64, 3: 48 };
const ORDER = [1, 0, 2];

// Animowane podium: drugie, pierwsze i trzecie miejsce wjeżdżają kolejno.
export default function Podium({ players }) {
  const top = players.slice(0, 3);
  if (!top.length) {
    return (
      <p className="text-center text-sm text-muted-foreground">Brak wyników — turniej nie został rozegrany.</p>
    );
  }

  return (
    <div className="flex items-end justify-center gap-3">
      {ORDER.filter((index) => top[index]).map((index, order) => {
        const player = top[index];
        const avatar = LIVE_AVATARS.find((item) => item.symbol === player.avatar) ?? LIVE_AVATARS[0];
        const place = index + 1;
        return (
          <div key={player.id} className="flex w-full max-w-[150px] flex-col items-center">
            {place === 1 ? <Crown className="mb-1 h-5 w-5 text-primary" /> : null}
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-semibold"
              style={{ background: avatar.color, color: "#0a1120" }}
            >
              {avatar.symbol}
            </span>
            <p className="mt-1 max-w-full truncate text-xs">{player.name}</p>
            <p className="text-[11px] text-muted-foreground">{player.score ?? 0} pkt</p>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: BAR_HEIGHT[place], opacity: 1 }}
              transition={{ delay: order * 0.16, type: "spring", stiffness: 140, damping: 16 }}
              className={cn(
                "mt-2 flex w-full flex-col items-center justify-start overflow-hidden rounded-t-2xl border border-b-0 pt-2",
                place === 1 ? "border-primary/50 bg-primary/15" : "border-border bg-card"
              )}
            >
              <span className="font-display text-lg font-semibold">
                {place === 1 ? <Trophy className="h-4 w-4 text-primary" /> : place}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}