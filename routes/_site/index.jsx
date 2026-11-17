import { Suspense, lazy } from "react";
import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MousePointerClick, Sparkles } from "lucide-react";
import { CATEGORIES, COMPOUNDS, compoundsByCategory, elementsOf, getCompound } from "@/lib/chemistry";
import { PHENOMENA } from "@/lib/phenomena";
import { ELEMENTS_TABLE } from "@/lib/elements";
import CompoundCard from "@/components/CompoundCard";
import PubChemSearch from "@/components/pubchem/PubChemSearch";
import AtomLegend from "@/components/AtomLegend";
import ChemFormula from "@/components/ChemFormula";

const MoleculeViewer = lazy(() => import("@/components/MoleculeViewer"));

export const Route = createFileRoute("/_site/")({
  component: HomePage,
});

function HomePage() {
  const heroCompound = getCompound("h2so4");

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Chemia nieorganiczna · modele 3D
            </span>

            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl">
              Cztery grupy.
              <br />
              <span className="text-primary text-glow">Wszystko w 3D.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Kwasy, wodorotlenki, tlenki i sole — obracaj cząsteczki, poznaj wzory strukturalne,
              reszty kwasowe i zastosowania. Do każdego związku ułożysz też własną układankę.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/zwiazki"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-sm font-medium text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                Odkrywaj modele
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/uklad-okresowy"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 font-display text-sm font-medium transition-colors hover:border-primary/30 hover:text-primary"
              >
                Układ okresowy
              </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-border/80 bg-card/50 p-4 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Legenda kolorów atomów
              </p>
              <AtomLegend className="mt-3" dense />
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[radial-gradient(120%_95%_at_50%_0%,hsl(var(--secondary))_0%,hsl(var(--background))_72%)] shadow-glow">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: "#F4D03F", opacity: 0.28 }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full blur-3xl"
                style={{ backgroundColor: "#E74C3C", opacity: 0.16 }}
              />
              <Link
                to="/zwiazki/$compoundId"
                params={{ compoundId: heroCompound.id }}
                className="absolute left-5 top-5 z-10 flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/80 px-3 py-1.5 font-display text-xs font-medium tracking-wide backdrop-blur transition-colors hover:text-primary"
              >
                <ChemFormula text={heroCompound.formula} />
                <span className="font-normal text-muted-foreground">{heroCompound.name}</span>
              </Link>
              <div className="h-[320px] w-full sm:h-[420px] lg:h-[460px]">
                <ClientOnly fallback={<ViewerFallback />}>
                  <Suspense fallback={<ViewerFallback />}>
                    <MoleculeViewer
                      model={heroCompound.model}
                      className="h-full w-full cursor-grab active:cursor-grabbing"
                    />
                  </Suspense>
                </ClientOnly>
              </div>
              <div className="flex items-center gap-2 border-t border-border/60 bg-background/70 px-5 py-3 text-xs text-muted-foreground backdrop-blur">
                <MousePointerClick className="h-3.5 w-3.5" />
                Przeciągnij, aby obrócić · scroll, aby przybliżyć
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Cztery grupy związków
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {COMPOUNDS.length} cząsteczek — od kwasów po sole.
            </p>
          </div>
          <Link
            to="/zwiazki"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Wszystkie związki
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to="/zwiazki"
              search={{ grupa: category.id }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-sm"
            >
              <span
                className="absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-25 blur-2xl"
                style={{ backgroundColor: category.accent }}
              />
              <p className="relative text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {compoundsByCategory(category.id).length} związki
              </p>
              <h3 className="relative mt-1 font-display text-lg font-semibold">{category.label}</h3>
              <p className="relative mt-2 text-xs leading-relaxed text-muted-foreground">
                {category.blurb}
              </p>
              <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Przeglądaj
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        <PubChemSearch compact />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Wszystkie związki
          </h2>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            {COMPOUNDS.length} substancji · kliknij, aby obejrzeć model 3D
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COMPOUNDS.map((compound) => (
            <CompoundCard key={compound.id} compound={compound} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <Link
            to="/uklad-okresowy"
            className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/25 sm:p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Układ okresowy
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold">
              {ELEMENTS_TABLE.length} pierwiastków do odkrycia
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Kliknij dowolny pierwiastek i sprawdź jego grupę, okres, rodzinę oraz zastosowanie —
              od wodoru w ogniwach paliwowych po neodym w magnesach.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {["H", "C", "N", "O", "Na", "Ca", "Fe", "Cu", "Au"].map((symbol) => (
                <span
                  key={symbol}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary font-display text-xs font-semibold"
                >
                  {symbol}
                </span>
              ))}
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Otwórz tabelę
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            to="/zjawiska"
            className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/25 sm:p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Zjawiska chemiczne
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold">
              {PHENOMENA.length} reakcji wokół Ciebie
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Korozja, spalanie, neutralizacja, strącanie osadów, fermentacja i elektroliza — z
              zapisem reakcji i praktycznym zastosowaniem.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
              {PHENOMENA.slice(0, 4).map((phenomenon) => (
                <span key={phenomenon.id} className="rounded-full bg-secondary px-2.5 py-1">
                  {phenomenon.tag}
                </span>
              ))}
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Zobacz zjawiska
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70">
                Tryb układania
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Zbuduj cząsteczkę sam.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Wybierz związek, wstaw atomy w kolorach z legendy i połącz je wiązaniami
                pojedynczymi lub podwójnymi. Apka sprawdzi, czy Twoja cząsteczka jest poprawna.
              </p>
              <Link
                to="/ukladanie"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 font-display text-sm font-medium text-primary transition-transform hover:-translate-y-0.5"
              >
                Zacznij układać
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                `${COMPOUNDS.length} związków: kwasy, wodorotlenki, tlenki, sole`,
                "Wiązania pojedyncze i podwójne",
                "Natychmiastowa informacja zwrotna",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 backdrop-blur-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-pulse rounded-full border-2 border-primary/30 bg-primary/10" />
    </div>
  );
}