import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Beaker,
  Layers,
  ListChecks,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ProgressChart from "@/components/stats/ProgressChart";
import TopicMastery from "@/components/stats/TopicMastery";
import { CATEGORIES, COMPOUNDS, getCompound } from "@/lib/chemistry";
import { formatDate, useLabStore } from "@/lib/labStore";
import { buildStudyStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/panel-statystyk")({
  component: StatsPage,
  head: () => ({
    meta: [
      { title: "Panel statystyk — postępy z quizów i fiszek" },
      {
        name: "description",
        content:
          "Wykres postępów z quizów i fiszek ChemoLab 3D: trafność odpowiedzi w czasie, średnie wyniki oraz grupy związków, które warto powtórzyć przed klasówką.",
      },
      { name: "keywords", content: "panel statystyk chemia, postępy w nauce, fiszki chemiczne, quizy chemia 3D" },
    ],
  }),
});

function StatsPage() {
  const store = useLabStore();
  const stats = buildStudyStats(store.quizzes, store.flashcards);

  const viewedCompounds = store.viewed.map((entry) => getCompound(entry.id)).filter(Boolean);
  const analyzed = viewedCompounds.length;
  const total = COMPOUNDS.length;
  const coverage = total ? Math.round((analyzed / total) * 100) : 0;

  const byCategory = CATEGORIES.map((category) => ({
    ...category,
    count: viewedCompounds.filter((compound) => compound.category === category.id).length,
  }));

  const cards = [
    {
      label: "Podejścia do quizu",
      value: stats.quizAttempts,
      hint: stats.quizAttempts ? `średnio ${stats.quizAverage}%` : "jeszcze brak",
      icon: ListChecks,
    },
    {
      label: "Odpowiedzi na fiszki",
      value: stats.flashTotal,
      hint: stats.flashTotal ? `${stats.flashAccuracy}% poprawnych` : "jeszcze brak",
      icon: Layers,
    },
    {
      label: "Łącznie odpowiedzi",
      value: stats.totalAnswers,
      hint: "quizy i fiszki",
      icon: Target,
    },
    {
      label: "Przeanalizowane związki",
      value: `${analyzed}/${total}`,
      hint: `${coverage}% katalogu`,
      icon: Beaker,
    },
  ];

  return (
    <PageShell
      eyebrow="Panel statystyk"
      title="Twoje postępy w laboratorium"
      lead="Wyniki quizów i fiszek zapisują się automatycznie — wykres pokazuje trafność w czasie, a lista zagadnień podpowiada, co powtórzyć przed klasówką."
      actions={
        <Link
          to="/quizy"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          Rozwiąż quiz
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[1.5rem] border border-border bg-card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <card.icon className="h-4 w-4" />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold">{card.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-[11px] text-primary/80">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[1.75rem] border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Wykres postępów
            </h2>
            <span className="text-[11px] text-muted-foreground">ostatnie 14 dni nauki</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Każdy punkt to dzień: odsetek poprawnych odpowiedzi z quizów i fiszek.
          </p>
          <ProgressChart points={stats.dailySeries} />
        </section>

        <section className="rounded-[1.75rem] border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Co powtórzyć
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Trafność według grup związków — od najsłabszej. Poniżej 70% warto wrócić do teorii.
          </p>
          <TopicMastery topics={stats.topicStats} />
          {stats.weakest.length ? (
            <p className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-muted-foreground">
              Przed klasówką powtórz: {stats.weakest.map((topic) => topic.label).join(", ")}.
            </p>
          ) : stats.topicStats.length ? (
            <p className="mt-3 rounded-2xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-xs text-primary">
              Wszystkie grupy powyżej 70% — utrzymaj formę krótką serią fiszek.
            </p>
          ) : null}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[1.75rem] border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Ostatnie wyniki</h2>
          {stats.recent.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Brak wyników. Zacznij od quizu albo serii fiszek.
              <Link to="/centrum-wiedzy" className="mt-2 block text-primary">
                Fiszki w Centrum wiedzy
              </Link>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-border/60">
              {stats.recent.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="truncate">{entry.title}</span>
                    <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {entry.type}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {formatDate(entry.date)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-display text-sm",
                      entry.accuracy >= 70 ? "text-primary" : "text-destructive"
                    )}
                  >
                    {entry.result}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Pokrycie katalogu</h2>
            <span className="font-display text-sm text-primary">{coverage}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${coverage}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {analyzed} z {total} związków. Otwórz kartę związku, aby zaliczyć go do postępów.
          </p>
          <div className="mt-4 space-y-2.5">
            {byCategory.map((category) => (
              <div key={category.id} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">{category.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: category.accent,
                      width: `${total ? (category.count / (total / CATEGORIES.length)) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-xs text-muted-foreground">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[1.75rem] border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Ostatnia aktywność</h2>
          <Link to="/archiwum-eksperymentow" className="text-sm text-muted-foreground hover:text-primary">
            Całe archiwum
          </Link>
        </div>
        {store.history.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Tu pojawią się Twoje ostatnie działania — od obejrzanych związków po rozwiązane quizy.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border/60">
            {store.history.slice(0, 6).map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="truncate">{entry.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(entry.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}