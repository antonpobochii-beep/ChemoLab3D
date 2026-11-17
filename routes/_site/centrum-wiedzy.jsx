import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import FlashcardDeck from "@/components/flashcards/FlashcardDeck";
import MoleculeNameQuiz from "@/components/flashcards/MoleculeNameQuiz";
import { KNOWLEDGE_ARTICLES } from "@/lib/knowledge";

export const Route = createFileRoute("/_site/centrum-wiedzy")({
  component: KnowledgePage,
  head: () => ({
    meta: [
      { title: "Centrum wiedzy — teoria chemiczna i zastosowania" },
      {
        name: "description",
        content:
          "Baza wiedzy chemicznej: wiązania, wartościowość i reguła krzyżowa, kwasy, wodorotlenki, tlenki, sole oraz reakcje chemiczne w codziennym życiu.",
      },
    ],
  }),
});

const TOOLS = [
  { to: "/slownik-pojec", label: "Słownik pojęć", hint: "Wiązania, wartościowość, masa atomowa" },
  { to: "/przewodnik-laboratoryjny", label: "Przewodnik laboratoryjny", hint: "Reguły łączenia atomów" },
  { to: "/baza-zastosowan", label: "Baza zastosowań", hint: "Związki według zastosowań" },
];

function KnowledgePage() {
  return (
    <PageShell
      eyebrow="Centrum wiedzy"
      title="Teoria chemiczna w jednym miejscu"
      lead="Wiązania, wartościowość, grupy związków i reakcje — krótko, po polsku i zawsze z przykładem. Każdy artykuł łączy się z modelem 3D i zadaniami."
      actions={
        <Link
          to="/przewodnik-laboratoryjny"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          Przewodnik laboratoryjny
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <FlashcardDeck />
        <MoleculeNameQuiz />
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.28fr_0.72fr]">
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Spis treści
          </p>
          <ul className="mt-3 space-y-1.5">
            {KNOWLEDGE_ARTICLES.map((article) => (
              <li key={article.id}>
                <a
                  href={`#${article.id}`}
                  className="block rounded-xl border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground"
                >
                  {article.title}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Idź dalej
            </p>
            <ul className="mt-2 space-y-2">
              {TOOLS.map((tool) => (
                <li key={tool.to}>
                  <Link
                    to={tool.to}
                    className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {tool.label}
                    <span className="block text-[11px] text-muted-foreground/80">{tool.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="space-y-6">
          {KNOWLEDGE_ARTICLES.map((article, index) => (
            <article
              key={article.id}
              id={article.id}
              className="scroll-mt-24 rounded-[1.75rem] border border-border bg-card p-6 sm:p-8"
            >
              <span className="font-display text-xs uppercase tracking-[0.22em] text-primary/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.lead}</p>

              <div className="mt-5 space-y-5">
                {article.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="font-display text-base font-semibold">{section.heading}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                    {section.bullets ? (
                      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>
            </article>
          ))}

          <div className="rounded-[1.75rem] border border-primary/30 bg-primary/5 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Sprawdź teorię w praktyce</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Obejrzyj model cząsteczki, ułóż ją sam albo rozwiąż quiz — wiedza zostaje wtedy na dłużej.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/quizy"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Rozwiąż quiz
              </Link>
              <Link
                to="/zwiazki"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm"
              >
                Katalog związków
              </Link>
              <Link
                to="/generator-wzorow"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm"
              >
                Generator wzorów
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}