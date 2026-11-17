import { Link } from "@tanstack/react-router";
import { Move3d } from "lucide-react";
import ChemFormula from "@/components/ChemFormula";
import { getCompound } from "@/lib/chemistry";
import { logEvent } from "@/lib/labStore";

// Karta jednego zjawiska chemicznego: przebieg, zapis reakcji, zastosowania i układanka 3D.
export default function PhenomenonCard({ phenomenon }) {
  const compound = getCompound(phenomenon.compound);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow-sm">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug">{phenomenon.title}</h3>
        <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
          {phenomenon.tag}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{phenomenon.description}</p>

      <div className="mt-4 rounded-xl border border-primary/20 bg-background/70 px-4 py-3 font-display text-sm">
        <ChemFormula text={phenomenon.equation} />
      </div>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Zastosowanie w praktyce
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {phenomenon.applications.map((application) => (
            <li key={application} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-glow-sm" />
              <span>{application}</span>
            </li>
          ))}
        </ul>
      </div>

      {compound ? (
        <div className="mt-auto pt-5">
          <Link
            to="/ukladanie"
            search={{ zwiazek: compound.id }}
            onClick={() =>
              logEvent({
                type: "phenomenon",
                label: phenomenon.title,
                detail: phenomenon.equation,
              })
            }
            className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <span className="inline-flex items-center gap-2">
              <Move3d className="h-4 w-4" />
              Ułóż cząsteczkę 3D
            </span>
            <span className="font-display text-sm">
              <ChemFormula text={compound.formula} />
            </span>
          </Link>
        </div>
      ) : null}
    </article>
  );
}