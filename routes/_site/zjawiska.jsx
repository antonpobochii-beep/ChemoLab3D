import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PHENOMENA } from "@/lib/phenomena";
import PhenomenonCard from "@/components/PhenomenonCard";

export const Route = createFileRoute("/_site/zjawiska")({
  component: PhenomenaPage,
  head: () => ({
    meta: [
      { title: "Zjawiska chemiczne i ich zastosowanie w praktyce" },
      {
        name: "description",
        content:
          "Korozja, spalanie, neutralizacja, strącanie osadów, fermentacja, elektroliza i inne zjawiska chemiczne: zapis reakcji i zastosowania w życiu codziennym.",
      },
    ],
  }),
});

function PhenomenaPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Zjawiska chemiczne
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Co się dzieje i po co nam to
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Dwanaście zjawisk, które widać w kuchni, w ogrodzie i w przemyśle. Przy każdym znajdziesz
        zapis reakcji oraz miejsca, w których wykorzystujemy ją w praktyce.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {PHENOMENA.map((phenomenon) => (
          <PhenomenonCard key={phenomenon.id} phenomenon={phenomenon} />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 rounded-[1.75rem] bg-primary px-6 py-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="font-display text-xl font-semibold">Te reakcje to nasi znajomi</p>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Wszystkie wymienione związki — kwasy, wodorotlenki, tlenki i sole — znajdziesz w katalogu
            z modelami 3D.
          </p>
        </div>
        <Link
          to="/zwiazki"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-foreground px-5 py-3 font-display text-sm text-primary transition-transform hover:-translate-y-0.5"
        >
          Przejdź do związków
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}