import { classifyFormula, parseFormula } from "@/lib/structure";

// Kanoniczny zapis wzoru: kation przed anionem, wodór na początku kwasów.
// PubChem podaje wzory w notacji Hilla ("ClNa", "H2O4S") — nie używamy ich w interfejsie.

// Wieloatomowe aniony rozpoznawane po dokładnym bilansie atomów (nie po kolejności liter).
export const POLY_ANIONS = [
  { symbol: "SO4", charge: 2 },
  { symbol: "HSO4", charge: 1 },
  { symbol: "SO3", charge: 2 },
  { symbol: "CO3", charge: 2 },
  { symbol: "HCO3", charge: 1 },
  { symbol: "PO4", charge: 3 },
  { symbol: "HPO4", charge: 2 },
  { symbol: "NO3", charge: 1 },
  { symbol: "NO2", charge: 1 },
  { symbol: "MnO4", charge: 1 },
  { symbol: "CrO4", charge: 2 },
  { symbol: "Cr2O7", charge: 2 },
  { symbol: "ClO3", charge: 1 },
  { symbol: "ClO4", charge: 1 },
  { symbol: "OH", charge: 1 },
  { symbol: "CN", charge: 1 },
];

const ELEMENT_ANION_CHARGE = {
  F: 1, Cl: 1, Br: 1, I: 1,
  O: 2, S: 2, Se: 2, Te: 2,
  N: 3, P: 3, C: 4, Si: 4, B: 3,
};

const groupMatches = (rest, groupCounts, factor) =>
  Object.keys(rest).every((element) => rest[element] === (groupCounts[element] || 0) * factor) &&
  Object.keys(groupCounts).every((element) => rest[element] === groupCounts[element] * factor);

function matchAnion(rest) {
  if (!Object.keys(rest).length) return null;

  for (const group of POLY_ANIONS) {
    const groupCounts = parseFormula(group.symbol);
    for (let factor = 1; factor <= 6; factor += 1) {
      if (groupMatches(rest, groupCounts, factor)) {
        return { ...group, count: factor, polyatomic: true };
      }
    }
  }

  const elements = Object.keys(rest);
  if (elements.length !== 1) return null;
  const symbol = elements[0];
  if (symbol === "H") return null;
  return {
    symbol,
    charge: ELEMENT_ANION_CHARGE[symbol] ?? 1,
    count: rest[symbol],
    polyatomic: false,
  };
}

// Rozbija wzór jonowy na kation i anion wraz z liczbą jednostek.
export function ionParts(formula = "") {
  const raw = String(formula || "").replace(/\s+/g, "");
  if (!raw) return null;

  const analysis = classifyFormula(raw);
  const counts = analysis.counts;
  const elements = Object.keys(counts);
  if (!elements.length) return null;

  // Jon amonowy — jedyny kation nieorganiczny bez metalu.
  if (counts.H === 4 * (counts.N || 0) && counts.N > 0 && elements.length > 2) {
    const rest = { ...counts };
    delete rest.N;
    delete rest.H;
    const anion = matchAnion(rest);
    const cationCount = counts.N;
    if (anion && anion.charge * anion.count === cationCount) {
      return {
        cation: { symbol: "NH4", charge: 1, count: cationCount, polyatomic: true },
        anion,
      };
    }
  }

  if (!analysis.ionic || !analysis.metals.length) return null;

  const metal = analysis.metals[0];
  const cationCount = counts[metal] || 1;
  const rest = { ...counts };
  delete rest[metal];

  const anion = matchAnion(rest);
  if (!anion) return null;

  const cationCharge =
    [1, 2, 3, 4].find((charge) => charge * cationCount === anion.charge * anion.count) ?? null;
  if (!cationCharge) return null;

  return {
    cation: { symbol: metal, charge: cationCharge, count: cationCount, polyatomic: false },
    anion,
  };
}

const ORDER = ["H", "B", "Si", "C", "N", "P", "S", "O", "Cl", "Br", "I", "F"];

const rank = (element) => {
  const position = ORDER.indexOf(element);
  return position === -1 ? ORDER.length : position;
};

function hillFromCounts(counts) {
  const keys = Object.keys(counts);
  const ordered = [
    "C",
    ...(counts.H ? ["H"] : []),
    ...keys.filter((key) => key !== "C" && key !== "H").sort(),
  ];
  return ordered
    .filter((element) => counts[element])
    .map((element) => (counts[element] > 1 ? `${element}${counts[element]}` : element))
    .join("");
}

export function isFormulaLike(text = "") {
  const raw = String(text || "").replace(/\s+/g, "");
  if (!raw) return false;
  return /^(?:\(?[A-Z][a-z]?\d*\)?\d*)+$/.test(raw) && /[A-Z]/.test(raw);
}

export function canonicalFormula(formula = "") {
  const raw = String(formula || "").replace(/\s+/g, "");
  if (!raw) return "";

  const parts = ionParts(raw);
  if (parts) {
    const render = (ion) => {
      if (ion.count <= 1) return ion.symbol;
      return ion.polyatomic ? `(${ion.symbol})${ion.count}` : `${ion.symbol}${ion.count}`;
    };
    return `${render(parts.cation)}${render(parts.anion)}`;
  }

  const counts = parseFormula(raw);
  const elements = Object.keys(counts);
  if (!elements.length) return raw;
  if (counts.C) return hillFromCounts(counts);

  const ordered = [...elements].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  return ordered.map((element) => (counts[element] > 1 ? `${element}${counts[element]}` : element)).join("");
}