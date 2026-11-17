import { useMemo, useState } from "react";
import { ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import ChemFormula from "@/components/ChemFormula";
import {
  ACTIVITY_SERIES,
  ANIONS,
  CATIONS,
  displacement,
  reactsWithAcid,
  saltFormula,
} from "@/lib/solubility";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const METALS = ACTIVITY_SERIES.filter((item) => item.symbol !== "H");
const SALTS = CATIONS.filter((item) => !["Na", "K", "NH4"].includes(item.id));

export default function ActivitySimulator() {
  const [metal, setMetal] = useState("Zn");
  const [cationId, setCationId] = useState("Cu2");
  const [anionId, setAnionId] = useState("SO4");

  const cation = CATIONS.find((item) => item.id === cationId);
  const anion = ANIONS.find((item) => item.id === anionId);
  const verdict = useMemo(() => displacement(metal, cation), [metal, cation]);
  const acid = useMemo(() => reactsWithAcid(metal), [metal]);

  const metalOption = METALS.find((item) => item.symbol === metal);
  const salt = saltFormula(cation, anion);

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-panel sm:p-7">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Symulator wypierania metali
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted-foreground">
          Metal wrzucony do roztworu
          <select
            value={metal}
            onChange={(event) => {
              setMetal(event.target.value);
              playSound("click");
            }}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
          >
            {METALS.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.name} ({item.symbol})
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-muted-foreground">
          Kation w soli
          <select
            value={cationId}
            onChange={(event) => setCationId(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
          >
            {SALTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-muted-foreground">
          Anion w soli
          <select
            value={anionId}
            onChange={(event) => setAnionId(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
          >
            {ANIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-2xl bg-background px-4 py-3 text-sm">
        <span className="font-display font-semibold">{metalOption?.name}</span>
        <span className="mx-2 text-muted-foreground">+</span>
        <span className="font-display">
          <ChemFormula text={salt} />
        </span>
        <ArrowRight className="mx-2 inline h-3.5 w-3.5 text-primary" />
        <span
          className={cn(
            "font-display",
            verdict?.possible ? "text-primary" : "text-muted-foreground"
          )}
        >
          {verdict?.possible ? `reakcja zachodzi (${verdict.products})` : "brak reakcji"}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p
          className={cn(
            "flex gap-2 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
            verdict?.possible
              ? "bg-primary/10 text-primary"
              : "bg-secondary/60 text-muted-foreground"
          )}
        >
          {verdict?.possible ? (
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {verdict?.reason}
        </p>
        <p
          className={cn(
            "flex gap-2 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
            acid?.possible ? "bg-primary/10 text-primary" : "bg-secondary/60 text-muted-foreground"
          )}
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          W kwasie: {acid?.reason}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {ACTIVITY_SERIES.map((item, index) => (
          <span key={item.symbol} className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-display",
                item.symbol === metal
                  ? "bg-primary text-primary-foreground"
                  : item.symbol === "H"
                    ? "bg-secondary text-accent-foreground"
                    : "bg-background text-muted-foreground"
              )}
            >
              {item.symbol}
            </span>
            {index < ACTIVITY_SERIES.length - 1 ? (
              <span className="text-[10px] text-border">&gt;</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}