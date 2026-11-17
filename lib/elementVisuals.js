import { ELEMENTS } from "@/lib/chemistry";
import { ELEMENTS_TABLE } from "@/lib/elements";

// Wizualne parametry wszystkich 118 pierwiastków. Kolory i promienie są
// reprezentacją graficzną (nie danymi fizycznymi); 12 pierwiastków z katalogu
// zachowuje dotychczasowe kolory, reszta dostaje kolor według grupy.

const CATEGORY_COLORS = {
  niemetal: "#F08A7E",
  halogen: "#34D399",
  gaz: "#C4B5FD",
  alkali: "#FDBA74",
  alkaline: "#FDE68A",
  metalloid: "#D9F99D",
  metal: "#93C5FD",
  lanthanide: "#F9A8D4",
  actinide: "#E9A8E9",
};

const PERIOD_RADIUS = { 1: 0.32, 2: 0.42, 3: 0.5, 4: 0.54, 5: 0.56, 6: 0.58, 7: 0.6 };

const GENERATED = Object.fromEntries(
  ELEMENTS_TABLE.map((element) => [
    element.symbol,
    {
      symbol: element.symbol,
      name: element.name.toLowerCase(),
      color: CATEGORY_COLORS[element.category] || "#9CA3AF",
      ink: "#0B1220",
      radius: PERIOD_RADIUS[element.period] || 0.5,
      z: element.z,
      category: element.category,
    },
  ])
);

export const ELEMENT_SPECS = { ...GENERATED, ...ELEMENTS };

export const ALL_ELEMENT_SYMBOLS = ELEMENTS_TABLE.map((element) => element.symbol);

export const elementSpec = (symbol) =>
  ELEMENT_SPECS[symbol] || {
    symbol,
    name: String(symbol || "?").toLowerCase(),
    color: "#9CA3AF",
    ink: "#0B1220",
    radius: 0.5,
  };