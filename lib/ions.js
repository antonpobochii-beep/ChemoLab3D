// Jony, wartościowości i nazewnictwo — wspólne dla kalkulatora oraz generatora wzorów.

export const CATIONS = [
  { id: "H", symbol: "H", charge: 1, label: "H⁺ — wodór", genitive: "wodoru" },
  { id: "Na", symbol: "Na", charge: 1, label: "Na⁺ — sód", genitive: "sodu" },
  { id: "K", symbol: "K", charge: 1, label: "K⁺ — potas", genitive: "potasu" },
  { id: "Ca", symbol: "Ca", charge: 2, label: "Ca²⁺ — wapń", genitive: "wapnia" },
  { id: "Mg", symbol: "Mg", charge: 2, label: "Mg²⁺ — magnez", genitive: "magnezu" },
  { id: "Fe", symbol: "Fe", charge: 3, label: "Fe³⁺ — żelazo(III)", genitive: "żelaza(III)" },
  { id: "Al", symbol: "Al", charge: 3, label: "Al³⁺ — glin", genitive: "glinu" },
  { id: "NH4", symbol: "NH4", charge: 1, label: "NH₄⁺ — jon amonowy", genitive: "amonu", polyatomic: true },
  { id: "C", symbol: "C", charge: 4, label: "C⁴⁺ — węgiel(IV)", genitive: "węgla(IV)" },
  { id: "S", symbol: "S", charge: 4, label: "S⁴⁺ — siarka(IV)", genitive: "siarki(IV)" },
];

export const ANIONS = [
  {
    id: "Cl",
    symbol: "Cl",
    charge: 1,
    label: "Cl⁻ — chlorek",
    saltName: "chlorek",
    acidName: "kwas chlorowodorowy",
  },
  {
    id: "NO3",
    symbol: "NO3",
    charge: 1,
    label: "NO₃⁻ — azotan(V)",
    saltName: "azotan(V)",
    acidName: "kwas azotowy(V)",
    polyatomic: true,
  },
  {
    id: "SO4",
    symbol: "SO4",
    charge: 2,
    label: "SO₄²⁻ — siarczan(VI)",
    saltName: "siarczan(VI)",
    acidName: "kwas siarkowy(VI)",
    polyatomic: true,
  },
  {
    id: "SO3",
    symbol: "SO3",
    charge: 2,
    label: "SO₃²⁻ — siarczan(IV)",
    saltName: "siarczan(IV)",
    acidName: "kwas siarkowy(IV)",
    polyatomic: true,
  },
  {
    id: "PO4",
    symbol: "PO4",
    charge: 3,
    label: "PO₄³⁻ — fosforan(V)",
    saltName: "fosforan(V)",
    acidName: "kwas fosforowy(V)",
    polyatomic: true,
  },
  {
    id: "OH",
    symbol: "OH",
    charge: 1,
    label: "OH⁻ — grupa wodorotlenkowa",
    saltName: "wodorotlenek",
    acidName: "woda",
    polyatomic: true,
  },
  {
    id: "CO3",
    symbol: "CO3",
    charge: 2,
    label: "CO₃²⁻ — węglan",
    saltName: "węglan",
    acidName: "kwas węglowy",
    polyatomic: true,
  },
  {
    id: "HCO3",
    symbol: "HCO3",
    charge: 1,
    label: "HCO₃⁻ — wodorowęglan",
    saltName: "wodorowęglan",
    acidName: "kwas węglowy",
    polyatomic: true,
  },
  {
    id: "O",
    symbol: "O",
    charge: 2,
    label: "O²⁻ — jon tlenkowy",
    saltName: "tlenek",
    acidName: "woda",
  },
];

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

export const findCation = (id) => CATIONS.find((item) => item.id === id) || null;
export const findAnion = (id) => ANIONS.find((item) => item.id === id) || null;

// Wzór sumaryczny z reguły krzyżowej: liczba kationów = ładunek anionu, liczba anionów = ładunek kationu.
export function buildFormula(cation, anion) {
  if (!cation || !anion) return "";
  if (cation.id === "H" && anion.id === "OH") return "H2O";
  const divisor = gcd(cation.charge, anion.charge);
  const cationCount = anion.charge / divisor;
  const anionCount = cation.charge / divisor;

  const withCount = (symbol, count, needsParens) => {
    const base = needsParens ? `(${symbol})` : symbol;
    return count > 1 ? `${base}${count}` : base;
  };

  return `${withCount(cation.symbol, cationCount, cation.polyatomic)}${withCount(
    anion.symbol,
    anionCount,
    anion.polyatomic
  )}`;
}

export function buildName(cation, anion) {
  if (!cation || !anion) return "";
  if (cation.id === "H" && anion.id === "OH") return "woda";
  if (anion.id === "OH") return `wodorotlenek ${cation.genitive}`;
  if (anion.id === "O") return `tlenek ${cation.genitive}`;
  if (cation.id === "H") return anion.acidName;
  return `${anion.saltName} ${cation.genitive}`;
}

// Bilans ładunków — pokazujemy uczniowi, skąd bierze się liczba atomów.
export function chargeBalance(cation, anion) {
  if (!cation || !anion) return null;
  const divisor = gcd(cation.charge, anion.charge);
  const cationCount = anion.charge / divisor;
  const anionCount = cation.charge / divisor;
  return {
    cationCount,
    anionCount,
    equation: `${cationCount} · (+${cation.charge}) + ${anionCount} · (−${anion.charge}) = 0`,
    cationValence: cation.charge,
    anionValence: anion.charge,
  };
}

// Przypisanie jonów do związków z katalogu — dane dobrane ręcznie, żeby bilans zawsze się zgadzał.
export const COMPOUND_IONS = {
  hcl: { cation: "H", anion: "Cl" },
  hno3: { cation: "H", anion: "NO3" },
  h2so4: { cation: "H", anion: "SO4" },
  h3po4: { cation: "H", anion: "PO4" },
  naoh: { cation: "Na", anion: "OH" },
  koh: { cation: "K", anion: "OH" },
  caoh2: { cation: "Ca", anion: "OH" },
  mgoh2: { cation: "Mg", anion: "OH" },
  h2o: { cation: "H", anion: "O" },
  co2: { cation: "C", anion: "O" },
  so2: { cation: "S", anion: "O" },
  cao: { cation: "Ca", anion: "O" },
  fe2o3: { cation: "Fe", anion: "O" },
  nacl: { cation: "Na", anion: "Cl" },
  caco3: { cation: "Ca", anion: "CO3" },
  nahco3: { cation: "Na", anion: "HCO3" },
  kno3: { cation: "K", anion: "NO3" },
  caso4: { cation: "Ca", anion: "SO4" },
  na2so4: { cation: "Na", anion: "SO4" },
  na3po4: { cation: "Na", anion: "PO4" },
  cacl2: { cation: "Ca", anion: "Cl" },
  cano32: { cation: "Ca", anion: "NO3" },
  mgcl2: { cation: "Mg", anion: "Cl" },
  fecl3: { cation: "Fe", anion: "Cl" },
};

export function analysisForCompound(compoundId) {
  const entry = COMPOUND_IONS[compoundId];
  if (!entry) return null;
  const cation = findCation(entry.cation);
  const anion = findAnion(entry.anion);
  if (!cation || !anion) return null;
  return { cation, anion, ...chargeBalance(cation, anion) };
}