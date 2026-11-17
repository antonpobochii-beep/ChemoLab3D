import { ELEMENTS } from "@/lib/chemistry";

// Wspólna logika gry na żywo: kody pokoju, awatary, punktacja z premią za czas i serię.

export const LIVE_AVATARS = ["H", "O", "Na", "Cl", "S", "Fe", "N", "Ca"].map((symbol) => ({
  symbol,
  name: ELEMENTS[symbol].name,
  color: ELEMENTS[symbol].color,
}));

export const formatRoomCode = (code) =>
  String(code ?? "")
    .replace(/\D/g, "")
    .slice(0, 6)
    .replace(/^(\d{3})(\d{1,3})$/, "$1 $2");

export function generateRoomCode() {
  const digits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
  return digits.startsWith("0") ? `1${digits.slice(1)}` : digits;
}

export function scoreAnswer({ correct, remainingMs, totalMs, streak }) {
  if (!correct) return 0;
  const ratio = totalMs ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const base = 700 + Math.round(300 * ratio);
  const multiplier = 1 + Math.min(streak || 0, 4) * 0.1;
  return Math.round(base * multiplier);
}

export function remainingMsFor(room) {
  if (!room?.started_at) return 0;
  const total = (room.question_seconds || 20) * 1000;
  return Math.max(0, total - (Date.now() - Date.parse(room.started_at)));
}

export const sortByScore = (players) =>
  [...players].sort((a, b) => (b.score || 0) - (a.score || 0));