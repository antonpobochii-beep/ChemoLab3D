import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FlaskConical } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { LAB_RULES } from "@/lib/knowledge";

export const Route = createFileRoute("/_site/przewodnik-laboratoryjny")({
  component: LabGuidePage,
  head: () => ({
    meta: [
      { title: "Przewodnik laboratoryjny — reguły łączenia atomów" },
      {
        name: "description",
        content:
          "Siedem reguł łączenia atomów w wiązania: oktet, wartościowość, reguła krzyżowa, nawiasy w resztach, kolejność zapisu, nazewnictwo i bilansowanie równań.",
      },
    ],
  }),
});

function LabGuidePage() {
  return (
    <PageShell
      eyebrow="Przewodnik laboratoryjny"
      title="Jak atomy łączą się w cząsteczki"
      lead="Krótkie poradniki, z których zbudujesz każdy wzór — od NaCl po Fe₂(SO₄)₃. Przy każdej regule znajdziesz przykład i wskazówkę do sprawdzenia w modelu 3D."
      actions={
        <Link
          to="/generator-wzorow"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          Sprawdź w generatorze
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {LAB_RULES.map((rule, index) => (
          <article
            key={rule.id}
            className="flex flex-col rounded-[1.5rem] border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 font-display text-sm font-semibold text-primary ring-1 ring-primary/30">
                {index + 1}
              </span>
              <h2 className="font-display text-lg font-semibold">{rule.title}</h2>
            </div>

            <p className="mt-3 text-sm font-medium text-foreground/90">{rule.rule}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.why}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-background/70 px-4 py-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Przykład
              </span>
              <span className="font-display text-lg">
                <ChemFormula text={rule.example} />
              </span>
            </div>

            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {rule.tip}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-[1.75rem] bg-primary px-6 py-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="font-display text-xl font-semibold">Zbuduj cząsteczkę według reguł</p>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Wybierz atomy i wartościowości, a generator ułoży wzór i nazwę. Potem zobacz ten sam związek w 3D.
          </p>
        </div>
        <Link
          to="/generator-wzorow"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-foreground px-5 py-3 font-display text-sm text-primary transition-transform hover:-translate-y-0.5"
        >
          Generator wzorów
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </PageShell>
  );
}