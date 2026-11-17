import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Flame, KeyRound, Loader2, Trophy, X } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import AvatarPicker from "@/components/livequiz/AvatarPicker";
import QuestionStage from "@/components/livequiz/QuestionStage";
import CountdownRing from "@/components/livequiz/CountdownRing";
import LobbyPlayers from "@/components/livequiz/LobbyPlayers";
import Leaderboard from "@/components/livequiz/Leaderboard";
import Podium from "@/components/livequiz/Podium";
import { findRoom, useLivePlayers, useLiveRoom } from "@/hooks/useLiveQuiz";
import { LIVE_AVATARS, formatRoomCode, remainingMsFor, scoreAnswer, sortByScore } from "@/lib/liveQuiz";
import { base44 } from "@/api/base44Client";
import { playSound } from "@/lib/sound";

export const Route = createFileRoute("/_site/dolacz")({
  ssr: false,
  component: JoinLiveQuizPage,
  head: () => ({
    meta: [
      { title: "Dołącz do quizu na żywo — ChemoLab 3D" },
      {
        name: "description",
        content:
          "Wejdź kodem PIN lub kodem QR do turnieju ChemoLab 3D, wybierz awatar atomu i odpowiadaj na pytania z modelami 3D.",
      },
    ],
  }),
});

function JoinLiveQuizPage() {
  const search = Route.useSearch();
  const roomParam =
    typeof search?.room === "string" ? search.room.replace(/\D/g, "").slice(0, 6) : "";
  const [code, setCode] = useState(roomParam);
  const [pin, setPin] = useState(roomParam);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("H");
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const autoRef = useRef("");

  const { room, isLoading, resolvedCode } = useLiveRoom(code || null);
  const players = useLivePlayers(code || null);
  const searching = Boolean(code) && !room && resolvedCode !== code && !error;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  // Powrót do turnieju po odświeżeniu strony — gracz jest zapisany lokalnie.
  useEffect(() => {
    if (!code) return undefined;
    const storageKey = `chemolab-live-player-${code}`;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return undefined;
    let alive = true;
    base44.entities.QuizPlayer.get(saved)
      .then((found) => {
        if (!alive || !found?.room_code) return;
        setPlayer(found);
      })
      .catch(() => window.localStorage.removeItem(storageKey));
    return () => {
      alive = false;
    };
  }, [code]);

  async function join() {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Podaj nick — minimum 2 znaki.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const found = await findRoom(code);
      if (!found) {
        setError("Nie ma pokoju o tym kodzie — sprawdź PIN.");
        return;
      }
      if (found.status === "finished") {
        setError("Ten turniej już się zakończył. Poproś o nowy kod.");
        return;
      }
      const created = await base44.entities.QuizPlayer.create({
        room_code: found.code,
        name: trimmed.slice(0, 20),
        avatar,
        score: 0,
        streak: 0,
        best_streak: 0,
        correct_count: 0,
        answered_index: -1,
      });
      window.localStorage.setItem(`chemolab-live-player-${found.code}`, created.id);
      setPlayer(created);
      setCode(found.code);
    } catch {
      setError("Nie udało się dołączyć. Spróbuj ponownie.");
    } finally {
      setBusy(false);
    }
  }

  async function submitAnswer(optionId) {
    if (!room || !player) return;
    const index = room.current_index ?? 0;
    if (player.answered_index === index) return;
    const question = room.questions?.[index];
    if (!question) return;

    const correct = Boolean(optionId) && optionId === question.answerId;
    const totalMs = (room.question_seconds || 20) * 1000;
    const streak = correct ? (player.streak || 0) + 1 : 0;
    const points = scoreAnswer({
      correct,
      remainingMs: remainingMsFor(room),
      totalMs,
      streak: player.streak || 0,
    });
    const patch = {
      answered_index: index,
      answer_option: optionId ?? "",
      answer_correct: correct,
      answer_points: points,
      score: (player.score || 0) + points,
      streak,
      best_streak: Math.max(player.best_streak || 0, streak),
      correct_count: (player.correct_count || 0) + (correct ? 1 : 0),
    };

    setPlayer({ ...player, ...patch });
    playSound(correct ? "success" : "error");
    try {
      await base44.entities.QuizPlayer.update(player.id, patch);
    } catch {
      setError("Nie udało się zapisać odpowiedzi — sprawdź połączenie.");
    }
  }

  // Koniec czasu zapisuje brak odpowiedzi i zeruje serię.
  useEffect(() => {
    if (!room || room.status !== "question" || !player) return;
    const index = room.current_index ?? 0;
    if (player.answered_index === index) return;
    if (remainingMsFor(room) > 0) return;
    const key = `${room.id}-${index}-${player.id}`;
    if (autoRef.current === key) return;
    autoRef.current = key;
    submitAnswer(null);
  }, [room, player, now]);

  function leave() {
    if (code) window.localStorage.removeItem(`chemolab-live-player-${code}`);
    setPlayer(null);
    setCode("");
    setPin("");
    setName("");
    setError("");
  }

  // 1. Wejście kodem PIN
  if (!code) {
    return (
      <PageShell
        eyebrow="Gra na żywo"
        title="Dołącz do turnieju"
        lead="Wpisz sześciocyfrowy PIN od nauczyciela albo zeskanuj kod QR z ekranu."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <KeyRound className="h-3.5 w-3.5" /> Kod pokoju
            </p>
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="482910"
              className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-center font-display text-2xl tracking-[0.3em] outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => {
                setError("");
                setCode(pin);
              }}
              disabled={pin.length !== 6}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Wejdź do pokoju
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Kod ma 6 cyfr — nauczyciel widzi go na ekranie razem z kodem QR.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p className="font-display text-base text-foreground">Jak to działa?</p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed">
              <li>1. Wpisujesz PIN lub skanujesz QR telefonem.</li>
              <li>2. Podajesz nick i wybierasz awatar atomu.</li>
              <li>3. Odpowiadasz na pytania — punkty zależą od poprawności i tempa.</li>
              <li>4. Seria trafień podbija mnożnik, a na końcu zobaczysz podium.</li>
            </ul>
            <Link
              to="/quiz-na-zywo"
              className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
            >
              Jesteś nauczycielem? Utwórz pokój
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (isLoading || searching) {
    return (
      <PageShell eyebrow="Gra na żywo" title="Łączę z pokojem…">
        <div className="flex h-40 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  if (!room) {
    return (
      <PageShell eyebrow="Gra na żywo" title="Nie znalazłem tego pokoju">
        <div className="rounded-3xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Pokój <span className="font-display text-foreground">{formatRoomCode(code)}</span> nie istnieje albo
            nauczyciel go zamknął.
          </p>
          <button
            type="button"
            onClick={() => {
              setCode("");
              setPin("");
              setError("");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
          >
            Wpisz inny PIN
          </button>
        </div>
      </PageShell>
    );
  }

  // 2. Formularz dołączania
  if (!player) {
    return (
      <PageShell
        eyebrow={`Pokój ${formatRoomCode(room.code)}`}
        title="Podaj nick i wybierz awatar"
        lead="Nick widzą wszyscy w poczekalni — bez danych osobowych, wystarczy imię lub pseudonim."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-border bg-card p-5">
            <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground" htmlFor="nick">
              Nick w turnieju
            </label>
            <input
              id="nick"
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, 20))}
              placeholder="np. Kasia"
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Awatr atomu</p>
            <div className="mt-2">
              <AvatarPicker value={avatar} onChange={setAvatar} />
            </div>
            {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
            <button
              type="button"
              onClick={join}
              disabled={busy}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {busy ? "Dołączam…" : "Dołącz do poczekalni"}
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              W pokoju ({players.length})
            </p>
            <div className="mt-3">
              <LobbyPlayers players={players} empty="Jesteś pierwszy — reszta klasy dopiero dołącza." />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const avatarInfo = LIVE_AVATARS.find((item) => item.symbol === player.avatar) ?? LIVE_AVATARS[0];
  const index = room.current_index ?? 0;
  const question = room.questions?.[index];
  const answered = player.answered_index === index;
  const totalMs = (room.question_seconds || 20) * 1000;

  // 3. Poczekalnia
  if (room.status === "lobby") {
    return (
      <PageShell
        eyebrow={`Pokój ${formatRoomCode(room.code)}`}
        title={`Cześć, ${player.name}!`}
        lead="Jesteś w poczekalni. Turniej ruszy, gdy nauczyciel kliknie start."
        actions={
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            {players.length} graczy gotowych
          </span>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-3xl border border-border bg-card p-5 text-center">
            <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-semibold"
              style={{ background: avatarInfo.color, color: "#0a1120" }}
            >
              {avatarInfo.symbol}
            </span>
            <p className="mt-3 font-display text-lg">{player.name}</p>
            <p className="text-[11px] text-muted-foreground">awatar: {avatarInfo.name}</p>
            <p className="mt-4 animate-pulse text-xs text-primary">Czekamy na start turnieju…</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Dołączyli ({players.length})
            </p>
            <div className="mt-3">
              <LobbyPlayers players={players} />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // 4. Pytanie i odpowiedzi
  if (room.status === "question" || room.status === "reveal") {
    const reveal = room.status === "reveal";
    const left = remainingMsFor(room);
    const correct = answered && Boolean(player.answer_correct);

    return (
      <PageShell
        eyebrow={reveal ? "Odpowiedzi" : `Pytanie ${index + 1}`}
        title={reveal ? (correct ? "Dobrze!" : "Nie tym razem") : "Wybierz odpowiedź"}
        lead={reveal ? (question?.note ?? "") : "Im szybciej odpowiesz, tym więcej punktów. Seria trafień daje mnożnik."}
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-border bg-card px-3 py-1.5">
              {player.score ?? 0} pkt
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-primary">
              <Flame className="h-3.5 w-3.5" /> {player.streak ?? 0}
            </span>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <CountdownRing remainingMs={reveal ? 0 : left} totalMs={totalMs} size={64} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {answered ? "Odpowiedź zapisana" : "Czas na odpowiedź"}
                </p>
                <p className="font-display text-sm">
                  {answered
                    ? `Zdobyte punkty: ${player.answer_points ?? 0}`
                    : reveal
                      ? "Pytanie zamknięte"
                      : `${Math.ceil(left / 1000)} s`}
                </p>
              </div>
            </div>
            <span className="max-w-[40%] truncate text-right text-[11px] text-muted-foreground">
              {player.name}
            </span>
          </div>

          {question ? (
            <QuestionStage
              question={question}
              selectedId={answered ? player.answer_option : null}
              key={question.id}
              correctId={question.answerId}
              disabled={answered || reveal}
              onSelect={answered || reveal ? undefined : submitAnswer}
              showResult={reveal}
            />
          ) : null}

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          {reveal ? (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 font-display text-sm">
                {correct ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <X className="h-4 w-4 text-destructive" />
                )}
                {correct
                  ? `+${player.answer_points ?? 0} pkt · seria ${player.streak ?? 0}`
                  : answered
                    ? "Tym razem bez punktów — seria wyzerowana."
                    : "Nie zdążyłeś z odpowiedzią."}
              </p>
            </div>
          ) : answered ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground">
              Czekamy na koniec czasu — nauczyciel pokaże odpowiedzi.
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground">
              Pokój {formatRoomCode(room.code)}
            </span>
            <button
              type="button"
              onClick={leave}
              className="rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-destructive"
            >
              Wyjdź z turnieju
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // 5. Koniec turnieju
  const ranked = sortByScore(players);
  const place = Math.max(0, ranked.findIndex((item) => item.id === player.id) + 1);

  return (
    <PageShell
      eyebrow={`Pokój ${formatRoomCode(room.code)}`}
      title={`Twój wynik: ${player.score ?? 0} pkt`}
      lead={`Miejsce ${place || "—"} z ${ranked.length} · seria ${player.streak ?? 0} · trafienia ${player.correct_count ?? 0}`}
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-primary">
          <Trophy className="h-3.5 w-3.5" /> {place ? `${place}. miejsce` : "poza klasyfikacją"}
        </span>
      }
    >
      <div className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5">
          <Podium players={ranked} />
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Klasyfikacja</p>
          <div className="mt-3">
            <Leaderboard players={ranked} meId={player.id} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/quizy"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-sm text-primary-foreground"
            >
              Potrenuj sam
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={leave}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground"
            >
              Dołącz do innego pokoju
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}