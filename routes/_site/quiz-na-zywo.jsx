import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Play, RotateCcw, Timer, Trophy, Users, Zap } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import RoomSetup from "@/components/livequiz/RoomSetup";
import QRPanel from "@/components/livequiz/QRPanel";
import LobbyPlayers from "@/components/livequiz/LobbyPlayers";
import QuestionStage from "@/components/livequiz/QuestionStage";
import CountdownRing from "@/components/livequiz/CountdownRing";
import Leaderboard from "@/components/livequiz/Leaderboard";
import Podium from "@/components/livequiz/Podium";
import { findRoom, useLivePlayers, useLiveRoom } from "@/hooks/useLiveQuiz";
import { buildLiveQuestions, QUIZ_TOPICS } from "@/lib/quizBank";
import { generateRoomCode, remainingMsFor } from "@/lib/liveQuiz";
import { base44 } from "@/api/base44Client";
import { playSound } from "@/lib/sound";

export const Route = createFileRoute("/_site/quiz-na-zywo")({
  ssr: false,
  component: LiveQuizHostPage,
  head: () => ({
    meta: [
      { title: "Rozgrywka na żywo — quiz grupowy z kodem QR | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Tryb Quizizz w ChemoLab 3D: utwórz pokój, pokaż kod PIN i QR, a klasa dołącza telefonami. Punkty za czas, serie odpowiedzi, podium i pytania z modelami 3D.",
      },
    ],
  }),
});

const STORAGE_KEY = "chemolab-live-host";

function LiveQuizHostPage() {
  const [code, setCode] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [origin, setOrigin] = useState("");
  const revealedRef = useRef(null);

  const { room, setRoom, resolvedCode } = useLiveRoom(code);
  const players = useLivePlayers(code);

  // Zapisany pokój zniknął (usunięty lub zamknięty) — wracamy do tworzenia nowego.
  useEffect(() => {
    if (code && resolvedCode === code && !room) {
      window.localStorage.removeItem(STORAGE_KEY);
      setCode(null);
    }
  }, [code, resolvedCode, room]);

  useEffect(() => {
    setOrigin(window.location.origin);
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setRestoring(false);
      return;
    }
    findRoom(saved)
      .then((found) => {
        if (found) setCode(found.code);
        else window.localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setRestoring(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  // Koniec czasu zamyka pytanie automatycznie — host nie musi klikać.
  useEffect(() => {
    if (!room || room.status !== "question" || !room.started_at) return;
    if (remainingMsFor(room) > 0) return;
    const key = `${room.id}-${room.current_index}`;
    if (revealedRef.current === key) return;
    revealedRef.current = key;
    base44.entities.QuizRoom.update(room.id, { status: "reveal" }).then(setRoom).catch(() => {});
  }, [room, now, setRoom]);

  async function createRoom({ topic, count, seconds }) {
    setBusy(true);
    setError("");
    try {
      const questions = buildLiveQuestions({ count, topic });
      let nextCode = generateRoomCode();
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const existing = await base44.entities.QuizRoom.filter({ code: nextCode });
        if (!existing.length) break;
        nextCode = generateRoomCode();
      }
      const created = await base44.entities.QuizRoom.create({
        code: nextCode,
        status: "lobby",
        topic,
        questions,
        current_index: 0,
        question_seconds: seconds,
        started_at: "",
      });
      window.localStorage.setItem(STORAGE_KEY, nextCode);
      setRoom(created);
      setCode(nextCode);
    } catch {
      setError("Nie udało się utworzyć pokoju. Spróbuj ponownie.");
    } finally {
      setBusy(false);
    }
  }

  async function startTournament() {
    const updated = await base44.entities.QuizRoom.update(room.id, {
      status: "question",
      current_index: 0,
      started_at: new Date().toISOString(),
    });
    revealedRef.current = null;
    setRoom(updated);
    playSound("success");
  }

  async function closeQuestion() {
    const updated = await base44.entities.QuizRoom.update(room.id, { status: "reveal" });
    setRoom(updated);
  }

  async function nextQuestion() {
    const nextIndex = (room.current_index ?? 0) + 1;
    if (nextIndex >= room.questions.length) {
      const updated = await base44.entities.QuizRoom.update(room.id, { status: "finished" });
      setRoom(updated);
      return;
    }
    const updated = await base44.entities.QuizRoom.update(room.id, {
      status: "question",
      current_index: nextIndex,
      started_at: new Date().toISOString(),
    });
    setRoom(updated);
  }

  async function endSession() {
    if (room) {
      try {
        await base44.entities.QuizRoom.update(room.id, { status: "finished" });
      } catch {
        /* pokój mógł już zostać usunięty */
      }
    }
    window.localStorage.removeItem(STORAGE_KEY);
    setCode(null);
    setRoom(null);
    setError("");
  }

  if (restoring || (code && !room && resolvedCode !== code)) {
    return (
      <PageShell eyebrow="Gra na żywo" title="Wczytuję pokój…">
        <div className="h-40 animate-pulse rounded-3xl bg-card" />
      </PageShell>
    );
  }

  if (!room) {
    return (
      <PageShell
        eyebrow="Gra na żywo · tryb Quizizz"
        title="Poprowadź turniej dla klasy"
        lead="Utwórz pokój, pokaż kod QR — uczniowie dołączają telefonami bez logowania, odpowiadają na czas i zbierają punkty za serie."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <RoomSetup onCreate={createRoom} busy={busy} error={error} />
          <div className="space-y-3">
            {[
              { icon: Users, title: "1. Lobby", text: "Uczniowie skanują QR lub wpisują PIN i podają nick oraz awatar atomu." },
              { icon: Zap, title: "2. Punkty za czas", text: "Poprawna odpowiedź to 700–1000 pkt — im szybciej, tym więcej. Seria poprawnych odpowiedzi daje mnożnik do 1,4×." },
              { icon: Trophy, title: "3. Podium", text: "Po każdym pytaniu widzisz rozkład odpowiedzi, a na końcu animowane podium i pełną tabelę." },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl border border-border bg-card p-4">
                <p className="flex items-center gap-2 font-display text-sm">
                  <step.icon className="h-4 w-4 text-primary" />
                  {step.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            ))}
            <p className="rounded-2xl border border-border bg-background/60 p-4 text-xs text-muted-foreground">
              Pytania obejmują obracane modele 3D: rozpoznawanie wzoru i nazwy, typ wiązania, liczbę wiązań
              podwójnych oraz rozstrzyganie „sieć jonowa czy cząsteczka”.
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  const index = room.current_index ?? 0;
  const question = room.questions?.[index] ?? null;
  const total = room.questions?.length ?? 0;
  const reveal = room.status === "reveal";
  const totalMs = (room.question_seconds || 20) * 1000;
  const left = remainingMsFor(room);

  const counts = players.reduce((acc, player) => {
    if (player.answered_index === index && player.answer_option) {
      acc[player.answer_option] = (acc[player.answer_option] || 0) + 1;
    }
    return acc;
  }, {});
  const answered = players.filter((player) => player.answered_index === index).length;

  return (
    <PageShell
      eyebrow="Gra na żywo"
      title={
        room.status === "lobby"
          ? "Poczekalnia — pokaż kod klasie"
          : room.status === "finished"
            ? "Wyniki turnieju"
            : `Pytanie ${index + 1} z ${total}`
      }
      lead={
        room.status === "lobby"
          ? `Zakres: ${QUIZ_TOPICS.find((item) => item.id === room.topic)?.label ?? "Wszystko"} · ${total} pytań · ${room.question_seconds} s na odpowiedź.`
          : undefined
      }
      actions={
        <Link
          to="/quizy"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-primary"
        >
          Laboratorium quizów
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {room.status === "lobby" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <QRPanel code={room.code} link={`${origin}/dolacz?room=${room.code}`} />
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Dołączyli ({players.length})
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                na żywo
              </span>
            </div>
            <div className="mt-3">
              <LobbyPlayers players={players} />
            </div>
            <button
              type="button"
              onClick={startTournament}
              disabled={!players.length}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play className="h-4 w-4" />
              🚀 Rozpocznij turniej
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Start odblokuje się po dołączeniu pierwszego gracza.
            </p>
          </div>
        </div>
      ) : null}

      {room.status === "question" || reveal ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <CountdownRing remainingMs={reveal ? 0 : left} totalMs={totalMs} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {reveal ? "Czas minął — pokazuję odpowiedzi" : "Czas na odpowiedź"}
                </p>
                <p className="font-display text-sm">
                  Odpowiedziało {answered} z {players.length}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 font-display text-sm text-primary">
              PIN {room.code}
            </span>
          </div>

          {question ? (
            <QuestionStage
              question={question}
              correctId={question.answerId}
              selectedId={null}
              counts={reveal ? counts : undefined}
              showResult={reveal}
            />
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {reveal ? (
              <button
                type="button"
                onClick={nextQuestion}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-sm text-primary-foreground"
              >
                {index + 1 >= total ? "Zobacz podium" : "Następne pytanie"}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={closeQuestion}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 font-display text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Timer className="h-4 w-4" />
                Zakończ pytanie teraz
              </button>
            )}
            <button
              type="button"
              onClick={endSession}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-[11px] text-muted-foreground transition-colors hover:text-destructive"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Zamknij pokój
            </button>
          </div>

          {reveal && question ? (
            <p className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
              Poprawna odpowiedź: <span className="text-primary">{question.note}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      {room.status === "finished" ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5">
            <Podium players={players} />
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Klasyfikacja</p>
            <div className="mt-3">
              <Leaderboard players={players} />
            </div>
            <button
              type="button"
              onClick={endSession}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-sm text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Nowy turniej
            </button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}