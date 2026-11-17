import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import { APPLICATION_GROUPS } from "@/lib/knowledge";
import { getCompound } from "@/lib/chemistry";

export const Route = createFileRoute("/_site/baza-zastosowan")({
  component: ApplicationsPage,
  head: () => ({
    meta: [
      { title: "Baza zastosowań — związki chemiczne w przemyśle i życiu codziennym" },
      {
        name: "description",
        content:
          "Wszystkie związki z katalogu pogrupowane według zastosowań: dom i kuchnia, przemysł, rolnictwo, zdrowie, energia i transport oraz budownictwo.",
      },
    ],
  }),
});

function ApplicationsPage() {
  const total = APPLICATION_GROUPS.reduce((sum, group) => sum + group.ids.length, 0);

  return (
    <PageShell
      eyebrow="Baza zastosowań"
      title="Do czego naprawdę służą te związki"
      lead={`${total} przypisań w sześciu obszarach życia i przemysłu. Każdy związek ma wzór, typ reszty oraz konkretne zastosowania.`}
      actions={
        <Link
          to="/zjawiska"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-display text-sm transition-colors hover:border-primary/40 hover:text-primary"
        >
          Zjawiska chemiczne
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="space-y-5">
        {APPLICATION_GROUPS.map((group) => {
          const compounds = group.ids.map((id) => getCompound(id)).filter(Boolean);
          return (
            <section
              key={group.id}
              className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">{group.label}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
                  {compounds.length} {compounds.length === 1 ? "związek" : "związki"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {compounds.map((compound) => (
                  <Link
                    key={`${group.id}-${compound.id}`}
                    to="/zwiazki/$compoundId"
                    params={{ compoundId: compound.id }}
                    className="group rounded-2xl border border-border/70 bg-background/60 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-base font-semibold">{compound.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          <ChemFormula text={compound.formula} /> · {compound.tag}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <ul className="mt-3 space-y-1">
                      {compound.uses.map((use) => (
                        <li key={use} className="flex gap-2 text-xs text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}