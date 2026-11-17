import { Link, createFileRoute } from "@tanstack/react-router";
import PageShell from "@/components/lab/PageShell";
import { HELP_FAQ, HELP_SECTIONS } from "@/lib/knowledge";

export const Route = createFileRoute("/_site/centrum-pomocy")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Centrum pomocy — jak sterować modelami 3D i układać cząsteczki" },
      {
        name: "description",
        content:
          "Instrukcja obsługi Chemii 3D: obrót i zoom modeli, tryb układania na planszy, edytor 3D, quizy, ulubione i archiwum. Najczęstsze pytania i skróty.",
      },
    ],
  }),
});

const START_LINKS = [
  { to: "/zwiazki", label: "Obejrzyj model 3D" },
  { to: "/ukladanie-3d", label: "Zbuduj cząsteczkę" },
  { to: "/quizy", label: "Rozwiąż quiz" },
];

function HelpPage() {
  return (
    <PageShell
      eyebrow="Centrum pomocy"
      title="Wszystko działa po dwóch kliknięciach"
      lead="Krótka instrukcja dla nowych użytkowników: jak obracać modele, jak układać cząsteczki i gdzie zapisują się Twoje postępy."
      actions={
        <div className="flex flex-wrap gap-2">
          {START_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {HELP_SECTIONS.map((section, index) => (
          <section
            key={section.id}
            className="rounded-[1.5rem] border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 font-display text-xs font-semibold text-primary ring-1 ring-primary/30">
                {index + 1}
              </span>
              <h2 className="font-display text-lg font-semibold">{section.title}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{section.intro}</p>
            <ol className="mt-3 space-y-2">
              {section.steps.map((step, stepIndex) => (
                <li key={step} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-[11px] text-foreground">
                    {stepIndex + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-[1.75rem] border border-border bg-card p-6 sm:p-7">
        <h2 className="font-display text-xl font-semibold">Najczęstsze pytania</h2>
        <div className="mt-4 divide-y divide-border/60">
          {HELP_FAQ.map((item) => (
            <details key={item.q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                {item.q}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}