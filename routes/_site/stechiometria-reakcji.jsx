import { createFileRoute } from "@tanstack/react-router";
import PageShell from "@/components/lab/PageShell";
import ReactionCalculator from "@/components/stoichiometry/ReactionCalculator";

export const Route = createFileRoute("/_site/stechiometria-reakcji")({
  component: ReactionStoichiometryPage,
  head: () => ({
    meta: [
      { title: "Stechiometria reakcji — masa substratów i produktów | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Kalkulator stechiometryczny: wybierz reakcję, podaj masę lub liczbę moli jednej substancji i od razu zobacz masę produktów oraz ilość każdego substratu.",
      },
    ],
  }),
});

function ReactionStoichiometryPage() {
  return (
    <PageShell
      eyebrow="Laboratorium obliczeń"
      title="Stechiometria reakcji"
      lead="Wybierz reakcję z probówki, podaj ilość jednej substancji, a kalkulator przeliczy wszystkie substraty i poda masę produktów."
    >
      <ReactionCalculator />

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            step: "1",
            title: "Równanie",
            text: "Współczynniki równania mówią, w jakim stosunku molowym reagują substancje.",
          },
          {
            step: "2",
            title: "Masa molowa",
            text: "M liczymy z mas atomowych: M = Σ (liczba atomów × masa atomowa).",
          },
          {
            step: "3",
            title: "Proporcja",
            text: "n drugiej substancji = n znanej × jej współczynnik / współczynnik znanej.",
          },
        ].map((item) => (
          <div key={item.step} className="rounded-2xl border border-border bg-card/60 p-4">
            <span className="font-display text-xs text-primary">Krok {item.step}</span>
            <p className="mt-1 font-display text-sm">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}