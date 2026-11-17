import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ArrowRight,
  Atom,
  BarChart3,
  Beaker,
  BookOpen,
  Boxes,
  Calculator,
  Compass,
  Droplets,
  FlaskConical,
  Gauge,
  Grid3x3,
  Gamepad2,
  Heart,
  HelpCircle,
  Layers,
  ListChecks,
  Scale,
  ScanEye,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import PageShell from "@/components/lab/PageShell";

export const Route = createFileRoute("/_site/narzedzia")({
  component: ToolsPage,
  head: () => ({
    meta: [
      { title: "Wszystkie narzędzia ChemoLab 3D — jeden start do każdej funkcji" },
      {
        name: "description",
        content:
          "Pełny spis funkcji ChemoLab 3D: modele 3D, układ okresowy, reakcje, quizy, fiszki, kalkulatory, porównywarka i statystyki postępów — wszystko w jednym miejscu.",
      },
    ],
  }),
});

const GROUPS = [
  {
    title: "Modele i struktury 3D",
    items: [
      { to: "/zwiazki", label: "Katalog związków", hint: "Modele 3D, wzory, chmura elektronowa, kalkulator", icon: Beaker },
      { to: "/uklad-okresowy", label: "Układ okresowy", hint: "118 pierwiastków z danymi", icon: Grid3x3 },
      { to: "/reakcje", label: "Reakcje 3D", hint: "Probówka, dwa substraty i model produktu", icon: FlaskConical },
      { to: "/ar", label: "Tryb AR", hint: "Model 3D na kamerze, pełny ekran", icon: ScanEye },
      { to: "/ukladanie-3d", label: "Kreator 3D", hint: "Zbuduj cząsteczkę lub sieć jonową", icon: Boxes },
      { to: "/ukladanie", label: "Układanka 2D", hint: "Atomy i wiązania z walidacją", icon: Layers },
      { to: "/porownanie", label: "Porównanie związków", hint: "Dwa modele obok siebie", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Nauka i powtórki",
    items: [
      { to: "/centrum-wiedzy", label: "Centrum wiedzy", hint: "Teoria, fiszki i rozpoznawanie modeli", icon: BookOpen },
      { to: "/quizy", label: "Laboratorium quizów", hint: "Modele, opisy i typy wiązań", icon: ListChecks },
      { to: "/quiz-na-zywo", label: "Quiz na żywo (Quizizz)", hint: "Pokój z kodem QR, punkty za czas i podium", icon: Gamepad2 },
      { to: "/panel-statystyk", label: "Panel statystyk", hint: "Wykres postępów i co powtórzyć", icon: BarChart3 },
      { to: "/slownik-pojec", label: "Słownik pojęć", hint: "Definicje bez lania wody", icon: Search },
      { to: "/przewodnik-laboratoryjny", label: "Przewodnik laboratoryjny", hint: "Reguły łączenia atomów", icon: Compass },
    ],
  },
  {
    title: "Laboratorium reakcji",
    items: [
      { to: "/bilansowanie", label: "Bilansowanie redox", hint: "Dowolne równanie → współczynniki, utleniacz, reduktor", icon: Scale },
      { to: "/rozpuszczalnosc", label: "Tabela rozpuszczalności", hint: "Kation + anion, kolory osadów, szereg aktywności", icon: Grid3x3 },
      { to: "/miareczkowanie", label: "Miareczkowanie", hint: "Kolba, wskaźnik i krzywa pH na żywo", icon: Droplets },
      { to: "/speedrun", label: "Speedrun 60 s", hint: "Gra na czas: rozpoznaj wzór i nazwę", icon: Gauge },
    ],
  },
  {
    title: "Kalkulatory",
    items: [
      { to: "/kalkulator-wartosciowosci", label: "Kalkulator wartościowości", hint: "Wzory z ładunków jonów", icon: Calculator },
      { to: "/generator-wzorow", label: "Generator wzorów", hint: "Kation + anion → wzór", icon: Sparkles },
      { to: "/stechiometria-reakcji", label: "Stechiometria reakcji", hint: "Ilość substratu → masa produktów", icon: Calculator },
      { to: "/zjawiska", label: "Zjawiska chemiczne", hint: "Efekty i wyjaśnienia", icon: FlaskConical },
      { to: "/baza-zastosowan", label: "Baza zastosowań", hint: "Związki według przemysłu", icon: Atom },
      { to: "/porownanie", label: "Zestawienie właściwości", hint: "Masa molowa, pH, rozpuszczalność", icon: Scale },
    ],
  },
  {
    title: "Twoje laboratorium",
    items: [
      { to: "/moje-ulubione", label: "Moje ulubione", hint: "Zapisane związki", icon: Heart },
      { to: "/archiwum-eksperymentow", label: "Archiwum", hint: "Historia aktywności", icon: ListChecks },
      { to: "/ustawienia", label: "Ustawienia", hint: "Motyw i jakość modeli", icon: Settings },
      { to: "/centrum-pomocy", label: "Centrum pomocy", hint: "Jak korzystać z aplikacji", icon: HelpCircle },
    ],
  },
];

function ToolsPage() {
  return (
    <PageShell
      eyebrow="Wszystkie narzędzia"
      title="Każda funkcja w jednym miejscu"
      lead="Jeden klik do modeli 3D, periodu, kalkulatorów, quizów i statystyk. Bez szukania w menu."
      actions={
        <Link
          to="/zwiazki"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          Otwórz katalog
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="space-y-8">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {group.title}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={`${group.title}-${item.label}`}
                  to={item.to}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-semibold">{item.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {item.hint}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}