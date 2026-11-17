import { Link, createFileRoute, Outlet } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import LabThemeSync from "@/components/lab/LabThemeSync";
import LabAccountSync from "@/components/lab/LabAccountSync";
import SoundToggle from "@/components/lab/SoundToggle";
import { useLabStore } from "@/lib/labStore";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

const FOOTER_GROUPS = [
  {
    title: "Katalog",
    links: [
      { to: "/zwiazki", label: "Związki i modele" },
      { to: "/uklad-okresowy", label: "Układ okresowy" },
      { to: "/zjawiska", label: "Zjawiska chemiczne" },
      { to: "/baza-zastosowan", label: "Baza zastosowań" },
    ],
  },
  {
    title: "Nauka",
    links: [
      { to: "/centrum-wiedzy", label: "Centrum wiedzy" },
      { to: "/przewodnik-laboratoryjny", label: "Przewodnik laboratoryjny" },
      { to: "/slownik-pojec", label: "Słownik pojęć" },
      { to: "/centrum-pomocy", label: "Centrum pomocy" },
    ],
  },
  {
    title: "Ćwiczenia",
    links: [
      { to: "/quizy", label: "Laboratorium quizów" },
      { to: "/quiz-na-zywo", label: "Quiz na żywo (QR)" },
      { to: "/ukladanie", label: "Układanie cząsteczek" },
      { to: "/ukladanie-3d", label: "Tryb 3D" },
      { to: "/generator-wzorow", label: "Generator wzorów" },
      { to: "/kalkulator-wartosciowosci", label: "Kalkulator wartościowości" },
    ],
  },
  {
    title: "Twoje laboratorium",
    links: [
      { to: "/moje-ulubione", label: "Moje ulubione" },
      { to: "/archiwum-eksperymentow", label: "Archiwum eksperymentów" },
      { to: "/panel-statystyk", label: "Panel statystyk" },
      { to: "/ustawienia", label: "Ustawienia laboratoryjne" },
    ],
  },
];

function SiteLayout() {
  const { settings } = useLabStore();
  const brightness = settings?.brightness ?? 100;

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <LabThemeSync />
      <LabAccountSync />
      <SoundToggle />
      <div
        aria-hidden="true"
        className="mesh-grid pointer-events-none fixed inset-0 -z-20 opacity-70 [mask-image:radial-gradient(120%_100%_at_50%_0%,black,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(50%_40%_at_8%_-4%,hsl(165_100%_45%/0.18),transparent_65%),radial-gradient(42%_38%_at_94%_2%,hsl(265_90%_62%/0.20),transparent_62%),radial-gradient(55%_45%_at_56%_104%,hsl(192_95%_55%/0.14),transparent_68%)]"
      />
      <SiteHeader />
      <main
        className="flex-1"
        style={{ filter: brightness === 100 ? undefined : `brightness(${brightness / 100})` }}
      >
        <Outlet />
      </main>
      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {group.title}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-border/50 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-sm font-semibold text-foreground">
              Chemia <span className="text-primary text-glow">3D</span>
            </p>
            <p className="uppercase tracking-[0.18em]">
              Modele cząsteczek · układ okresowy · zjawiska
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}