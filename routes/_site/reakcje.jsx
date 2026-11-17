import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Beaker,
  Droplets,
  FlaskConical,
  RotateCcw,
  ScanEye,
  Sparkles,
  ThermometerSun,
  TestTubes,
  Wind,
} from "lucide-react";
import PageShell from "@/components/lab/PageShell";
import ChemFormula from "@/components/ChemFormula";
import TestTube from "@/components/reactions/TestTube";
import SubstrateSlot from "@/components/reactions/SubstrateSlot";
import ProductCard from "@/components/reactions/ProductCard";
import { getCompound } from "@/lib/chemistry";
import { findReaction, noReactionHint } from "@/lib/reactions";

export const Route = createFileRoute("/_site/reakcje")({
  component: ReactionsPage,
  head: () => ({
    meta: [
      { title: "Reakcje 3D — probówka, dwa substraty i modele produktów | ChemoLab 3D" },
      {
        name: "description",
        content:
          "Wirtualna probówka 3D: wybierz dwa substraty, zobacz równanie, objawy reakcji (gaz, osad, ciepło) i model 3D produktu, a potem obejrzyj go w trybie AR.",
      },
    ],
  }),
});

const EFFECTS = [
  { key: "gas", label: "Wydziela się gaz", icon: Wind },
  { key: "precipitate", label: "Wypada osad", icon: Droplets },
  { key: "heat", label: "Reakcja egzotermiczna", icon: ThermometerSun },
];

function ReactionsPage() {
  const [first, setFirst] = useState("hcl");
  const [second, setSecond] = useState("naoh");
  const [poured, setPoured] = useState(false);

  const reaction = findReaction(first, second);
  const pouredReaction = poured && reaction ? reaction : null;
  const a = getCompound(first);
  const b = getCompound(second);
  const products = (reaction?.products ?? []).map((id) => getCompound(id)).filter(Boolean);

  function pick(setter) {
    return (value) => {
      setter(value);
      setPoured(false);
    };
  }

  return (
    <PageShell
      eyebrow="Reakcje 3D"
      title="Dwie substancje, jedna probówka"
      lead="Wybierz substraty, wlej je do probówki i zobacz, co powstaje — z równaniem, objawami reakcji i modelem 3D produktu."
      actions={
        <button
          type="button"
          onClick={() => setPoured(true)}
          disabled={!reaction || poured}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          <FlaskConical className="h-4 w-4" />
          Wlej do probówki
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="rounded-3xl border border-border bg-card p-5 panel-glass">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Probówka reakcyjna
            </p>
            <button
              type="button"
              onClick={() => setPoured(false)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Wyczyść
            </button>
          </div>

          <div className="mt-4 flex items-start justify-center gap-1">
            <div className="flex flex-col items-center gap-2 pt-16 text-center">
              <span className="rounded-lg border border-border bg-background px-2 py-1 font-display text-xs">
                <ChemFormula text={a?.formula ?? "?"} />
              </span>
              <span className="text-[10px] text-muted-foreground">{a?.name}</span>
            </div>

            <TestTube reaction={reaction} active={poured} />

            <div className="flex flex-col items-center gap-2 pt-16 text-center">
              <span className="rounded-lg border border-border bg-background px-2 py-1 font-display text-xs">
                <ChemFormula text={b?.formula ?? "?"} />
              </span>
              <span className="text-[10px] text-muted-foreground">{b?.name}</span>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            {pouredReaction
              ? "Substraty zmieszane — obserwuj zmiany w probówce."
              : "Obie substancje czekają w osobnych naczyniach."}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <SubstrateSlot label="Substrat A" value={first} onChange={pick(setFirst)} />
            <SubstrateSlot label="Substrat B" value={second} onChange={pick(setSecond)} />
          </div>

          {reaction ? (
            <div className="rounded-3xl border border-primary/30 bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
                  {reaction.type}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  {reaction.observations.length} obserwacje
                </span>
              </div>

              <p className="mt-3 font-display text-xl leading-snug">
                {reaction.equation}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {EFFECTS.filter((effect) => reaction[effect.key]).map((effect) => (
                  <span
                    key={effect.key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    <effect.icon className="h-3.5 w-3.5 text-primary" />
                    {effect.label}
                  </span>
                ))}
              </div>

              <ul className="mt-3 space-y-1.5">
                {reaction.observations.map((observation) => (
                  <li
                    key={observation}
                    className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {observation}
                  </li>
                ))}
              </ul>

              {products.length ? (
                <div className="mt-4 rounded-2xl border border-border bg-background/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Produkty · modele 3D ({products.length})
                    </p>
                    <Link
                      to="/zwiazki/$compoundId"
                      params={{ compoundId: products[0].id }}
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                    >
                      Karta głównego produktu
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {products.map((compound) => (
                      <ProductCard key={compound.id} compound={compound} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-border px-3 py-2 text-[11px] text-muted-foreground">
                  Produkt tej reakcji nie ma jeszcze gotowego modelu w katalogu — obejrzyj
                  substraty, które go tworzą.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-5">
              <p className="flex items-center gap-2 font-display text-sm">
                <Beaker className="h-4 w-4 text-muted-foreground" />
                Ta para nie reaguje w probówce
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {noReactionHint(first, second)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFirst("hcl");
                    setSecond("naoh");
                    setPoured(false);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <TestTubes className="h-3.5 w-3.5" />
                  Kwas + zasada
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFirst("hcl");
                    setSecond("caco3");
                    setPoured(false);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Wind className="h-3.5 w-3.5" />
                  Kwas + węglan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFirst("cao");
                    setSecond("h2o");
                    setPoured(false);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <ThermometerSun className="h-3.5 w-3.5" />
                  Tlenek + woda
                </button>
              </div>
            </div>
          )}

          <Link
            to="/ar"
            search={{ model: products[0]?.id ?? first }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span className="inline-flex items-center gap-2">
              <ScanEye className="h-4 w-4" />
              Przenieś model do trybu AR — na kamerze, z wyciąganiem z modułu
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}