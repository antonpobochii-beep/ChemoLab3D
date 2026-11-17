import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Droplets, FlaskConical, RotateCcw } from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import TitrationFlask from "@/components/titration/TitrationFlask";
import TitrationCurve from "@/components/titration/TitrationCurve";
import {
  ACIDS,
  BASE,
  INDICATORS,
  equivalenceVolume,
  indicatorColor,
  phAt,
  reactionOf,
  titrationCurve,
} from "@/lib/titration";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/miareczkowanie")({
  component: TitrationPage,
  head: () => ({
    meta: [
      { title: "Symulator miareczkowania kwas–zasada z krzywą pH | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Wirtualna kolba, kropla po kropli dodawana zasada, wskaźnik (fenoloftaleina, oranż metylowy) i krzywa pH rysowana na żywo. Nauka miareczkowania bez odczynników.",
      },
    ],
  }),
});

const STEPS = [0.05, 1, 5];

function TitrationPage() {
  const [acidId, setAcidId] = useState("hcl");
  const [indicatorId, setIndicatorId] = useState("fenoloftaleina");
  const [volume, setVolume] = useState(0);

  const acid = ACIDS.find((item) => item.id === acidId);
  const indicator = INDICATORS.find((item) => item.id === indicatorId);
  const ph = useMemo(() => phAt(acid, volume), [acid, volume]);
  const equivalence = equivalenceVolume(acid);
  const curve = useMemo(() => titrationCurve(acid), [acid]);
  const tone = indicatorColor(indicator, ph);
  const nearEquivalence = Math.abs(volume - equivalence) < 0.6;

  const add = (amount) => {
    setVolume((value) => Math.min(60, Math.round((value + amount) * 100) / 100));
    playSound("drop");
  };

  return (
    <PageShell
      eyebrow={
        <>
          <FlaskConical className="h-3.5 w-3.5 text-primary" /> Miareczkowanie
        </>
      }
      title="Miareczkowanie kwas–zasada"
      lead={`W kolbie jest ${BASE.volume} mL kwasu o stężeniu 0,1 mol/dm³. Dozuj 0,1 M roztwór ${BASE.label} i obserwuj zmianę pH oraz koloru wskaźnika.`}
      actions={
        <button
          type="button"
          onClick={() => {
            setVolume(0);
            playSound("click");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="grid gap-3">
          <TitrationFlask color={tone.color} level={Math.min(1, volume / 60)} baseVolume={volume} />

          <div className="rounded-[1.5rem] border border-border bg-card p-4">
            <div className="flex flex-wrap gap-2">
              {STEPS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => add(amount)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <Droplets className="h-3.5 w-3.5" /> +{amount < 1 ? "1 kropla" : `${amount} mL`}
                </button>
              ))}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Kwas w kolbie
                <select
                  value={acidId}
                  onChange={(event) => setAcidId(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                >
                  {ACIDS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted-foreground">
                Wskaźnik
                <select
                  value={indicatorId}
                  onChange={(event) => setIndicatorId(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                >
                  {INDICATORS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">pH roztworu</p>
              <p
                className={cn(
                  "mt-1 font-display text-3xl font-semibold",
                  ph < 7 ? "text-destructive" : ph > 7 ? "text-chart-2" : "text-primary"
                )}
              >
                {ph.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {ph < 6.9 ? "odczyn kwasowy" : ph > 7.1 ? "odczyn zasadowy" : "blisko obojętnego"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Barwa wskaźnika
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-7 w-7 rounded-full ring-1 ring-white/25"
                  style={{ backgroundColor: tone.color }}
                />
                <span className="font-display text-sm">{tone.ink}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{indicator.label}</p>
            </div>
          </div>

          <TitrationCurve
            points={curve}
            maxVolume={50}
            current={{ volume: Math.min(50, volume), pH: ph }}
            equivalence={equivalence}
          />

          <div className="rounded-[1.5rem] border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Zapis reakcji</p>
            <p className="mt-1 font-display text-sm">{reactionOf(acid)}</p>
            <p
              className={cn(
                "mt-3 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
                nearEquivalence ? "bg-primary/10 text-primary" : "bg-background text-muted-foreground"
              )}
            >
              {nearEquivalence
                ? "Punkt równoważnikowy: ilość dodanej zasady równa się ilości kwasu. Wskaźnik zmienia barwę gwałtownie — pH skacze o kilka jednostek."
                : "Dodawaj titrant porcjami. W pobliżu punktu równoważnikowego pH zmienia się skokowo, dlatego końcówkę miareczkowania prowadzi się kroplami."}
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}