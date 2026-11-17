import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, Sun } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import {
  DETAIL_LEVELS,
  THEMES,
  applyTheme,
  resetStore,
  saveSettings,
  useLabStore,
} from "@/lib/labStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/ustawienia")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Ustawienia laboratoryjne — motyw, jasność, jakość modeli 3D" },
      {
        name: "description",
        content:
          "Dostosuj Chemię 3D: wybierz motyw kolorystyczny, ustaw jasność interfejsu i szczegółowość renderowania modeli 3D.",
      },
    ],
  }),
});

function SettingsPage() {
  const { settings } = useLabStore();

  function handleReset() {
    resetStore();
    applyTheme("neon");
  }

  return (
    <PageShell
      eyebrow="Ustawienia laboratoryjne"
      title="Dopasuj laboratorium do siebie"
      lead="Zmiany działają od razu i zapisują się w tej przeglądarce. Nie musisz niczego zatwierdzać."
      actions={
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
        >
          <RotateCcw className="h-4 w-4" />
          Przywróć domyślne
        </button>
      }
    >
      <div className="space-y-5">
        <section className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-7">
          <h2 className="font-display text-xl font-semibold">Motyw interfejsu</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kolor akcentów zmienia przyciski, podkreślenia i poświatę modeli.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {THEMES.map((theme) => {
              const active = settings.theme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => saveSettings({ theme: theme.id })}
                  className={cn(
                    "flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                    active
                      ? "border-primary bg-primary/5 shadow-glow-sm"
                      : "border-border bg-background/60 hover:border-primary/30"
                  )}
                >
                  <span className="flex w-full items-center justify-between">
                    <span
                      className="h-8 w-8 rounded-full ring-1 ring-white/10"
                      style={{ backgroundColor: theme.swatch }}
                    />
                    {active ? <Check className="h-4 w-4 text-primary" /> : null}
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold">{theme.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {theme.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Sun className="h-4 w-4 text-primary" />
                Jasność interfejsu
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Przyciemnij treść wieczorem albo rozjaśnij ją do pracy w słońcu.
              </p>
            </div>
            <span className="rounded-full border border-border bg-background px-3 py-1.5 font-display text-sm">
              {settings.brightness}%
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="120"
            step="5"
            value={settings.brightness}
            onChange={(event) => saveSettings({ brightness: Number(event.target.value) })}
            className="mt-5 w-full accent-[hsl(var(--primary))]"
            aria-label="Jasność interfejsu"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>70% — przygaszone</span>
            <span>100% — domyślne</span>
            <span>120% — rozjaśnione</span>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-7">
          <h2 className="font-display text-xl font-semibold">Szczegółowość modeli 3D</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Wpływa na gładkość kul i liczbę wielokątów w modelach cząsteczek. Niższa jakość działa
            płynniej na słabszych komputerach i telefonach.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {DETAIL_LEVELS.map((level) => {
              const active = settings.detail === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => saveSettings({ detail: level.id })}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    active
                      ? "border-primary bg-primary/5 shadow-glow-sm"
                      : "border-border bg-background/60 hover:border-primary/30"
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-display text-sm font-semibold">{level.label}</span>
                    {active ? <Check className="h-4 w-4 text-primary" /> : null}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{level.hint}</span>
                </button>
              );
            })}
          </div>
        </section>

        <p className="text-xs text-muted-foreground">
          Ustawienia oraz polubienia zapisują się w pamięci tej przeglądarki. Po wyczyszczeniu danych
          witryny wrócą wartości domyślne.
        </p>
      </div>
    </PageShell>
  );
}