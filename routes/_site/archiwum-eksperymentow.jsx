import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Atom, Beaker, FlaskConical, Trash2, Trophy } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import LabAccountHint from "@/components/lab/LabAccountHint";
import { clearHistory, formatDate, useLabStore } from "@/lib/labStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/archiwum-eksperymentow")({
  component: ArchivePage,
  head: () => ({
    meta: [
      { title: "Archiwum eksperymentów — ostatnie układy cząsteczek i zjawiska" },
      {
        name: "description",
        content:
          "Historia Twojej pracy w Chemii 3D: ostatnio wczytane i zapisane cząsteczki, obejrzane zjawiska chemiczne, przeanalizowane związki oraz wyniki quizów.",
      },
    ],
  }),
});

const FILTERS = [
  { id: "all", label: "Wszystko" },
  { id: "molecule", label: "Cząsteczki" },
  { id: "phenomenon", label: "Zjawiska" },
  { id: "compound", label: "Związki" },
  { id: "quiz", label: "Quizy" },
  { id: "formula", label: "Wzory" },
];

const ICONS = {
  molecule: Atom,
  phenomenon: FlaskConical,
  compound: Beaker,
  quiz: Trophy,
  formula: FlaskConical,
};

function ArchivePage() {
  const { history } = useLabStore();
  const [filter, setFilter] = useState("all");

  const entries = filter === "all" ? history : history.filter((entry) => entry.type === filter);

  return (
    <PageShell
      eyebrow="Archiwum eksperymentów"
      title="Co robiłeś w laboratorium"
      lead="Ostatnie układy cząsteczek, obejrzane zjawiska, przeanalizowane związki i wyniki quizów — w jednej osi czasu."
      actions={
        history.length > 0 ? (
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Wyczyść archiwum
          </button>
        ) : null
      }
    >
      <LabAccountHint />

      <div className="mt-6 flex flex-wrap gap-1.5">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              filter === item.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-card/60 px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold">Archiwum jest puste</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Obejrzyj związek, wczytaj model w trybie 3D albo rozwiąż quiz — wpisy pojawią się tutaj automatycznie.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/zwiazki" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
              Katalog związków
            </Link>
            <Link to="/quizy" className="rounded-full border border-border bg-background px-4 py-2 text-sm">
              Laboratorium quizów
            </Link>
          </div>
        </div>
      ) : (
        <ol className="mt-5 space-y-3">
          {entries.map((entry) => {
            const Icon = ICONS[entry.type] || Beaker;
            return (
              <li
                key={entry.id}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card px-5 py-4"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{entry.label}</p>
                  {entry.detail ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{entry.detail}</p>
                  ) : null}
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatDate(entry.date)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </PageShell>
  );
}