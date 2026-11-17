import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ChemFormula from "@/components/ChemFormula";
import { ELEMENT_CATEGORIES } from "@/lib/elements";
import { phenomenaForElement } from "@/lib/phenomena";
import { compoundsWithElement } from "@/lib/chemistry";

// Karta pierwiastka: właściwości, zastosowania, zjawiska z jego udziałem i związki z bazy.
export default function ElementDialog({ element, onClose }) {
  const category = element ? ELEMENT_CATEGORIES[element.category] : null;
  const phenomena = element ? phenomenaForElement(element.symbol) : [];
  const compounds = element ? compoundsWithElement(element.symbol) : [];

  return (
    <Dialog open={Boolean(element)} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="max-h-[86vh] max-w-lg overflow-y-auto">
        {element ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 font-display text-xl">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-semibold"
                  style={{ backgroundColor: category.bg, color: category.ink }}
                >
                  {element.symbol}
                </span>
                {element.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl bg-secondary/70 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Liczba atomowa
                </p>
                <p className="font-display text-lg font-semibold">{element.z}</p>
              </div>
              <div className="rounded-xl bg-secondary/70 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Grupa</p>
                <p className="font-display text-lg font-semibold">{element.group}</p>
              </div>
              <div className="rounded-xl bg-secondary/70 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Okres</p>
                <p className="font-display text-lg font-semibold">{element.period}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Rodzina pierwiastków
              </p>
              <p className="mt-0.5 font-display text-sm font-semibold" style={{ color: category.ink }}>
                {category.label}
              </p>
            </div>

            <section className="rounded-xl border border-border bg-secondary/40 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-primary">
                Zastosowania w praktyce
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {element.fact ||
                  "Pierwiastek bardzo rzadki — otrzymywany sztucznie, wykorzystywany głównie w badaniach naukowych."}
              </p>
            </section>

            {phenomena.length ? (
              <section>
                <p className="text-[10px] uppercase tracking-[0.16em] text-primary">
                  Zjawiska z tym pierwiastkiem
                </p>
                <ul className="mt-2 space-y-2">
                  {phenomena.slice(0, 3).map((phenomenon) => (
                    <li
                      key={phenomenon.id}
                      className="rounded-xl border border-border bg-secondary/40 p-3"
                    >
                      <p className="font-display text-sm font-semibold">{phenomenon.title}</p>
                      <p className="mt-1 font-display text-xs text-primary">
                        <ChemFormula text={phenomenon.equation} />
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {phenomenon.description}
                      </p>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/zjawiska"
                  className="mt-2 inline-flex text-xs text-primary underline-offset-4 hover:underline"
                >
                  Wszystkie zjawiska →
                </Link>
              </section>
            ) : null}

            {compounds.length ? (
              <section>
                <p className="text-[10px] uppercase tracking-[0.16em] text-primary">
                  Związki w bazie z tym pierwiastkiem
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {compounds.map((compound) => (
                    <li key={compound.id}>
                      <Link
                        to="/zwiazki/$compoundId"
                        params={{ compoundId: compound.id }}
                        className="inline-flex rounded-full border border-border bg-card px-3 py-1 font-display text-xs transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <ChemFormula text={compound.formula} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}