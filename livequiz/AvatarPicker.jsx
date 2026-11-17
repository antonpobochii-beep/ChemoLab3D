import { LIVE_AVATARS } from "@/lib/liveQuiz";
import { cn } from "@/lib/utils";

// Wybór awatara atomu — symbol pierwiastka w jego kolorze.
export default function AvatarPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {LIVE_AVATARS.map((avatar) => (
        <button
          key={avatar.symbol}
          type="button"
          onClick={() => onChange(avatar.symbol)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 transition-all",
            value === avatar.symbol
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/40"
          )}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full font-display text-xs font-semibold"
            style={{ background: avatar.color, color: "#0a1120" }}
          >
            {avatar.symbol}
          </span>
          <span className="text-[10px]">{avatar.name}</span>
        </button>
      ))}
    </div>
  );
}