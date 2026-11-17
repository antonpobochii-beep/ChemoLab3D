import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ELEMENT_CATEGORIES, ELEMENTS_TABLE } from "@/lib/elements";
import PeriodicTable from "@/components/periodic/PeriodicTable";
import ElementDialog from "@/components/periodic/ElementDialog";

export const Route = createFileRoute("/_site/uklad-okresowy")({
  component: PeriodicTablePage,
  head: () => ({
    meta: [
      { title: "Układ okresowy pierwiastków — interaktywna tablica" },
      {
        name: "description",
        content:
          "Pełny układ okresowy 118 pierwiastków: kliknij pierwiastek, aby zobaczyć liczbę atomową, grupę, okres, rodzinę i zastosowania.",
      },
    ],
  }),
});

function PeriodicTablePage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Układ okresowy
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        118 pierwiastków w jednej tabeli
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Kliknij dowolny pierwiastek, aby zobaczyć jego liczbę atomową, grupę, okres, rodzinę i
        praktyczne zastosowanie. Kolumny to grupy, wiersze — okresy; lantanowce i aktynowce leżą
        osobno pod tabelą.
      </p>

      <div className="mt-6 rounded-[1.75rem] border border-border bg-card p-4 shadow-panel sm:p-6">
        <PeriodicTable selected={selected?.symbol} onSelect={setSelected} />
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {Object.entries(ELEMENT_CATEGORIES).map(([key, category]) => (
          <li key={key} className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded-sm ring-1 ring-white/15"
              style={{ backgroundColor: category.bg, borderColor: category.ink }}
            />
            {category.label}
          </li>
        ))}
        <li className="text-muted-foreground/80">{ELEMENTS_TABLE.length} pierwiastków</li>
      </ul>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Jak czytać tabelę</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Grupa</strong> (kolumna) — pierwiastki o podobnych
              właściwościach, np. grupa 17 to halogeny.
            </li>
            <li>
              <strong className="text-foreground">Okres</strong> (wiersz) — liczba powłok
              elektronowych.
            </li>
            <li>
              <strong className="text-foreground">Liczba atomowa</strong> — liczba protonów w jądrze.
            </li>
          </ul>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Pierwiastki w naszych modelach</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            W cząsteczkach z katalogu spotkasz wodór, tlen, chlor, siarkę, fosfor, azot, węgiel, sód,
            potas i wapń — wszystkie są zaznaczone w tabeli.
          </p>
          <Link
            to="/zwiazki"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-sm text-primary-foreground"
          >
            Zobacz związki
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ElementDialog element={selected} onClose={() => setSelected(null)} />
    </div>
  );
}