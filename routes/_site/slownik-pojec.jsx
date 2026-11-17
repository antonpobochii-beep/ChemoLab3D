import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import { GLOSSARY } from "@/lib/knowledge";

export const Route = createFileRoute("/_site/slownik-pojec")({
  component: GlossaryPage,
  head: () => ({
    meta: [
      { title: "Słownik pojęć chemicznych — wiązania, wartościowość, masa atomowa" },
      {
        name: "description",
        content:
          "Słownik najważniejszych pojęć chemicznych z wyjaśnieniami: atom, jon, wartościowość, wiązanie jonowe i kowalencyjne, mol, pH, dysocjacja, sól i tlenek.",
      },
    ],
  }),
});

const TAGS = ["wszystkie", "budowa", "wiązania", "obliczenia", "roztwory", "reakcje", "grupy", "modele"];

function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("wszystkie");

  const entries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return GLOSSARY.filter((entry) => {
      const matchesTag = tag === "wszystkie" || entry.tag === tag;
      const matchesQuery =
        !needle ||
        entry.term.toLowerCase().includes(needle) ||
        entry.short.toLowerCase().includes(needle) ||
        entry.long.toLowerCase().includes(needle);
      return matchesTag && matchesQuery;
    }).sort((a, b) => a.term.localeCompare(b.term, "pl"));
  }, [query, tag]);

  return (
    <PageShell
      eyebrow="Słownik pojęć"
      title="Pojęcia, które wracają w każdym temacie"
      lead="Krótka definicja i szersze wyjaśnienie — wszystko, co pojawia się w modelach, zadaniach i quizach."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Szukaj pojęcia</span>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj pojęcia, np. wartościowość…"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                tag === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Znaleziono {entries.length} {entries.length === 1 ? "pojęcie" : "pojęć"}.
      </p>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-card/60 px-6 py-12 text-center text-sm text-muted-foreground">
          Brak pojęć dla tego zapytania. Spróbuj innej frazy albo wybierz inną kategorię.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {entries.map((entry) => (
            <article
              key={entry.term}
              className="rounded-[1.5rem] border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-semibold">{entry.term}</h2>
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {entry.tag}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground/90">{entry.short}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{entry.long}</p>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}