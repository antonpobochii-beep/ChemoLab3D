// Dane chemiczne i geometria cząsteczek — wspólne dla modeli 3D, wzorów i trybu układania.

export const ELEMENTS = {
  H: { symbol: "H", name: "wodór", color: "#FFFFFF", ink: "#8B9099", radius: 0.3 },
  C: { symbol: "C", name: "węgiel", color: "#4B5563", ink: "#FFFFFF", radius: 0.44 },
  N: { symbol: "N", name: "azot", color: "#3B82F6", ink: "#FFFFFF", radius: 0.44 },
  O: { symbol: "O", name: "tlen", color: "#E74C3C", ink: "#A93226", radius: 0.42 },
  Na: { symbol: "Na", name: "sód", color: "#A78BFA", ink: "#4C3A8C", radius: 0.56 },
  K: { symbol: "K", name: "potas", color: "#8E7CC3", ink: "#3E3363", radius: 0.62 },
  Ca: { symbol: "Ca", name: "wapń", color: "#7FA650", ink: "#2F4418", radius: 0.6 },
  P: { symbol: "P", name: "fosfor", color: "#9B59B6", ink: "#6C3483", radius: 0.54 },
  S: { symbol: "S", name: "siarka", color: "#F4D03F", ink: "#7A5E0E", radius: 0.56 },
  Cl: { symbol: "Cl", name: "chlor", color: "#2ECC71", ink: "#1E8449", radius: 0.6 },
  Mg: { symbol: "Mg", name: "magnez", color: "#9BE15D", ink: "#3A6112", radius: 0.58 },
  Fe: { symbol: "Fe", name: "żelazo", color: "#D97757", ink: "#6B2E17", radius: 0.62 },
};

export const ELEMENT_ORDER = [
  "H",
  "O",
  "Cl",
  "S",
  "P",
  "N",
  "C",
  "Na",
  "K",
  "Ca",
  "Mg",
  "Fe",
];

/* ---------- geometria 3D ---------- */

const unit = (v) => {
  const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const mul = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

// Cztery kierunki tetraedryczne (kąt ok. 109,5°) — geometria wokół S, P i C.
const TETRA = [
  unit([1, 1, 1]),
  unit([1, -1, -1]),
  unit([-1, 1, -1]),
  unit([-1, -1, 1]),
];

// Trzy kierunki w jednej płaszczyźnie (kąt 120°) — geometria trygonalna.
const PLANAR = [unit([0, 1, 0]), unit([0.866, -0.5, 0]), unit([-0.866, -0.5, 0])];

// Położenie wodoru grupy –O–H: kąt mostkowy ok. 108°.
function hydroxylH(center, oxygen, length = 0.97) {
  const dir = unit(sub(oxygen, center));
  let perp = cross(dir, [0, 0, 1]);
  if (Math.sqrt(perp[0] * perp[0] + perp[1] * perp[1] + perp[2] * perp[2]) < 1e-6) {
    perp = cross(dir, [0, 1, 0]);
  }
  perp = unit(perp);
  const hDir = unit(add(mul(dir, 0.309), mul(perp, 0.951)));
  return add(oxygen, mul(hDir, length));
}

const CENTER = [0, 0, 0];

const HCL_MODEL = {
  atoms: [
    { el: "Cl", pos: [0, 0, 0] },
    { el: "H", pos: [1.28, 0, 0] },
  ],
  bonds: [{ a: 0, b: 1, order: 1 }],
};

const HNO3_MODEL = (() => {
  const o1 = mul(PLANAR[0], 1.22); // N=O
  const o2 = mul(PLANAR[1], 1.41); // N–O–H
  const o3 = mul(PLANAR[2], 1.41); // N–O
  return {
    atoms: [
      { el: "N", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "O", pos: o2 },
      { el: "H", pos: hydroxylH(CENTER, o2) },
      { el: "O", pos: o3 },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 1 },
      { a: 2, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
    ],
  };
})();

const H2SO4_MODEL = (() => {
  const o1 = mul(TETRA[0], 1.44); // S=O
  const o2 = mul(TETRA[1], 1.44); // S=O
  const o3 = mul(TETRA[2], 1.58); // S–O–H
  const o4 = mul(TETRA[3], 1.58); // S–O–H
  return {
    atoms: [
      { el: "S", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "O", pos: o2 },
      { el: "O", pos: o3 },
      { el: "O", pos: o4 },
      { el: "H", pos: hydroxylH(CENTER, o3) },
      { el: "H", pos: hydroxylH(CENTER, o4) },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 3, b: 5, order: 1 },
      { a: 4, b: 6, order: 1 },
    ],
  };
})();

const H3PO4_MODEL = (() => {
  const o1 = mul(TETRA[0], 1.48); // P=O
  const o2 = mul(TETRA[1], 1.62); // P–O–H
  const o3 = mul(TETRA[2], 1.62); // P–O–H
  const o4 = mul(TETRA[3], 1.62); // P–O–H
  return {
    atoms: [
      { el: "P", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "O", pos: o2 },
      { el: "O", pos: o3 },
      { el: "O", pos: o4 },
      { el: "H", pos: hydroxylH(CENTER, o2) },
      { el: "H", pos: hydroxylH(CENTER, o3) },
      { el: "H", pos: hydroxylH(CENTER, o4) },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 2, b: 5, order: 1 },
      { a: 3, b: 6, order: 1 },
      { a: 4, b: 7, order: 1 },
    ],
  };
})();

// Wodorotlenki i sole mają budowę jonową — model pokazuje jony obok siebie.
const NAOH_MODEL = {
  atoms: [
    { el: "O", pos: [0, 0, 0] },
    { el: "Na", pos: [2.05, 0.25, 0] },
    { el: "H", pos: [-0.485, 0.84, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const KOH_MODEL = {
  atoms: [
    { el: "O", pos: [0, 0, 0] },
    { el: "K", pos: [2.3, 0.3, 0] },
    { el: "H", pos: [-0.485, 0.84, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const CAOH2_MODEL = (() => {
  const o1 = [1.95, 0.55, 0];
  const o2 = [-1.95, -0.55, 0];
  return {
    atoms: [
      { el: "Ca", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "H", pos: hydroxylH(CENTER, o1) },
      { el: "O", pos: o2 },
      { el: "H", pos: hydroxylH(CENTER, o2) },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 1, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 3, b: 4, order: 1 },
    ],
  };
})();

const H2O_MODEL = {
  atoms: [
    { el: "O", pos: CENTER },
    { el: "H", pos: [0.758, 0.587, 0] },
    { el: "H", pos: [-0.758, 0.587, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const CO2_MODEL = {
  atoms: [
    { el: "C", pos: CENTER },
    { el: "O", pos: [1.16, 0, 0] },
    { el: "O", pos: [-1.16, 0, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 2 },
  ],
};

const SO2_MODEL = {
  atoms: [
    { el: "S", pos: CENTER },
    { el: "O", pos: [1.232, 0.726, 0] },
    { el: "O", pos: [-1.232, 0.726, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 2 },
  ],
};

const CAO_MODEL = {
  atoms: [
    { el: "Ca", pos: CENTER },
    { el: "O", pos: [1.95, 0, 0] },
  ],
  bonds: [{ a: 0, b: 1, order: 1 }],
};

const NACL_MODEL = {
  atoms: [
    { el: "Na", pos: CENTER },
    { el: "Cl", pos: [2.2, 0, 0] },
  ],
  bonds: [{ a: 0, b: 1, order: 1 }],
};

const CACO3_MODEL = {
  atoms: [
    { el: "C", pos: CENTER },
    { el: "O", pos: [0, 1.29, 0] },
    { el: "O", pos: [1.117, -0.645, 0] },
    { el: "O", pos: [-1.117, -0.645, 0] },
    { el: "Ca", pos: [0, 3.05, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 1, b: 4, order: 1 },
  ],
};

const NAHCO3_MODEL = (() => {
  const o2 = [1.07, -0.62, 0];
  const o3 = [-1.07, -0.62, 0];
  return {
    atoms: [
      { el: "C", pos: CENTER },
      { el: "O", pos: [0, 1.24, 0] },
      { el: "O", pos: o2 },
      { el: "H", pos: hydroxylH(CENTER, o2) },
      { el: "O", pos: o3 },
      { el: "Na", pos: [-2.8, -1.62, 0] },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 1 },
      { a: 2, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 4, b: 5, order: 1 },
    ],
  };
})();

const MGOH2_MODEL = (() => {
  const o1 = [1.75, 0.5, 0];
  const o2 = [-1.75, -0.5, 0];
  return {
    atoms: [
      { el: "Mg", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "H", pos: hydroxylH(CENTER, o1) },
      { el: "O", pos: o2 },
      { el: "H", pos: hydroxylH(CENTER, o2) },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 1, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 3, b: 4, order: 1 },
    ],
  };
})();

const FE2O3_MODEL = {
  atoms: [
    { el: "Fe", pos: [-1.8, 0, 0] },
    { el: "Fe", pos: [1.8, 0, 0] },
    { el: "O", pos: [0, 0.45, 0] },
    { el: "O", pos: [-2.65, 1.35, 0] },
    { el: "O", pos: [2.65, 1.35, 0] },
  ],
  bonds: [
    { a: 0, b: 2, order: 1 },
    { a: 1, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 1, b: 4, order: 1 },
  ],
};

const KNO3_MODEL = {
  atoms: [
    { el: "N", pos: CENTER },
    { el: "O", pos: [1.26, 0.46, 0] },
    { el: "O", pos: [-1.26, 0.46, 0] },
    { el: "O", pos: [0, -1.34, 0] },
    { el: "K", pos: [-2.95, -1.95, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 2 },
    { a: 0, b: 3, order: 1 },
    { a: 3, b: 4, order: 1 },
  ],
};

const CASO4_MODEL = (() => {
  const o1 = mul(TETRA[0], 1.48);
  const o2 = mul(TETRA[1], 1.48);
  const o3 = mul(TETRA[2], 1.58);
  const o4 = mul(TETRA[3], 1.58);
  return {
    atoms: [
      { el: "S", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "O", pos: o2 },
      { el: "O", pos: o3 },
      { el: "O", pos: o4 },
      { el: "Ca", pos: mul(TETRA[2], 3.35) },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 3, b: 5, order: 1 },
    ],
  };
})();

/* ---------- wzory strukturalne (płaszczyzna) ---------- */

const HCl_2D = {
  atoms: [
    { el: "H", x: 82, y: 104 },
    { el: "Cl", x: 166, y: 104 },
  ],
  bonds: [{ a: 0, b: 1, order: 1 }],
};

const HNO3_2D = {
  atoms: [
    { el: "N", x: 120, y: 108 },
    { el: "O", x: 120, y: 48 },
    { el: "O", x: 58, y: 128 },
    { el: "H", x: 26, y: 156 },
    { el: "O", x: 182, y: 128 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 2, b: 3, order: 1 },
    { a: 0, b: 4, order: 1 },
  ],
};

const H2SO4_2D = {
  atoms: [
    { el: "S", x: 120, y: 104 },
    { el: "O", x: 120, y: 44 },
    { el: "O", x: 120, y: 164 },
    { el: "O", x: 56, y: 104 },
    { el: "H", x: 20, y: 104 },
    { el: "O", x: 184, y: 104 },
    { el: "H", x: 220, y: 104 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 2 },
    { a: 0, b: 3, order: 1 },
    { a: 3, b: 4, order: 1 },
    { a: 0, b: 5, order: 1 },
    { a: 5, b: 6, order: 1 },
  ],
};

const H3PO4_2D = {
  atoms: [
    { el: "P", x: 120, y: 112 },
    { el: "O", x: 120, y: 46 },
    { el: "O", x: 58, y: 104 },
    { el: "H", x: 24, y: 68 },
    { el: "O", x: 182, y: 104 },
    { el: "H", x: 216, y: 68 },
    { el: "O", x: 120, y: 178 },
    { el: "H", x: 86, y: 204 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 2, b: 3, order: 1 },
    { a: 0, b: 4, order: 1 },
    { a: 4, b: 5, order: 1 },
    { a: 0, b: 6, order: 1 },
    { a: 6, b: 7, order: 1 },
  ],
};

const NaOH_2D = {
  atoms: [
    { el: "Na", x: 52, y: 120 },
    { el: "O", x: 118, y: 120 },
    { el: "H", x: 172, y: 80 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 1, b: 2, order: 1 },
  ],
};

const KOH_2D = {
  atoms: [
    { el: "K", x: 48, y: 120 },
    { el: "O", x: 118, y: 120 },
    { el: "H", x: 172, y: 80 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 1, b: 2, order: 1 },
  ],
};

const CaOH2_2D = {
  atoms: [
    { el: "Ca", x: 120, y: 130 },
    { el: "O", x: 58, y: 100 },
    { el: "H", x: 26, y: 68 },
    { el: "O", x: 182, y: 100 },
    { el: "H", x: 214, y: 68 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 1, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 3, b: 4, order: 1 },
  ],
};

const H2O_2D = {
  atoms: [
    { el: "O", x: 120, y: 100 },
    { el: "H", x: 74, y: 142 },
    { el: "H", x: 166, y: 142 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const CO2_2D = {
  atoms: [
    { el: "O", x: 48, y: 104 },
    { el: "C", x: 120, y: 104 },
    { el: "O", x: 192, y: 104 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 1, b: 2, order: 2 },
  ],
};

const SO2_2D = {
  atoms: [
    { el: "S", x: 120, y: 80 },
    { el: "O", x: 56, y: 136 },
    { el: "O", x: 184, y: 136 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 2 },
  ],
};

const CaO_2D = {
  atoms: [
    { el: "Ca", x: 70, y: 104 },
    { el: "O", x: 170, y: 104 },
  ],
  bonds: [{ a: 0, b: 1, order: 1 }],
};

const NaCl_2D = {
  atoms: [
    { el: "Na", x: 70, y: 104 },
    { el: "Cl", x: 170, y: 104 },
  ],
  bonds: [{ a: 0, b: 1, order: 1 }],
};

const CaCO3_2D = {
  atoms: [
    { el: "C", x: 120, y: 96 },
    { el: "O", x: 120, y: 158 },
    { el: "O", x: 64, y: 60 },
    { el: "O", x: 176, y: 60 },
    { el: "Ca", x: 120, y: 214 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 1, b: 4, order: 1 },
  ],
};

const NaHCO3_2D = {
  atoms: [
    { el: "C", x: 112, y: 104 },
    { el: "O", x: 112, y: 44 },
    { el: "O", x: 54, y: 104 },
    { el: "H", x: 22, y: 74 },
    { el: "O", x: 170, y: 104 },
    { el: "Na", x: 216, y: 140 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 2, b: 3, order: 1 },
    { a: 0, b: 4, order: 1 },
    { a: 4, b: 5, order: 1 },
  ],
};

const MgOH2_2D = {
  atoms: [
    { el: "Mg", x: 120, y: 130 },
    { el: "O", x: 58, y: 100 },
    { el: "H", x: 26, y: 68 },
    { el: "O", x: 182, y: 100 },
    { el: "H", x: 214, y: 68 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 1, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 3, b: 4, order: 1 },
  ],
};

const Fe2O3_2D = {
  atoms: [
    { el: "Fe", x: 62, y: 124 },
    { el: "O", x: 120, y: 124 },
    { el: "Fe", x: 178, y: 124 },
    { el: "O", x: 26, y: 62 },
    { el: "O", x: 214, y: 62 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 1, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 2, b: 4, order: 1 },
  ],
};

const KNO3_2D = {
  atoms: [
    { el: "K", x: 34, y: 152 },
    { el: "N", x: 126, y: 96 },
    { el: "O", x: 126, y: 34 },
    { el: "O", x: 190, y: 122 },
    { el: "O", x: 62, y: 122 },
  ],
  bonds: [
    { a: 1, b: 2, order: 2 },
    { a: 1, b: 3, order: 1 },
    { a: 1, b: 4, order: 1 },
    { a: 0, b: 4, order: 1 },
  ],
};

const CaSO4_2D = {
  atoms: [
    { el: "S", x: 132, y: 108 },
    { el: "O", x: 132, y: 46 },
    { el: "O", x: 196, y: 112 },
    { el: "O", x: 132, y: 172 },
    { el: "O", x: 70, y: 112 },
    { el: "Ca", x: 68, y: 214 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 3, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 0, b: 4, order: 1 },
    { a: 4, b: 5, order: 1 },
  ],
};

/* ---------- grupy związków ---------- */

export const CATEGORIES = [
  {
    id: "kwas",
    label: "Kwasy",
    single: "kwas",
    blurb: "Zawierają wodór i resztę kwasową. W wodzie odczepiają jon H⁺.",
    residueLabel: "Reszta kwasowa",
    valenceLabel: "Wartościowość reszty",
    accent: "#2ECC71",
    ink: "#6EE7B7",
  },
  {
    id: "wodorotlenek",
    label: "Wodorotlenki",
    single: "wodorotlenek",
    blurb: "Metal połączony z grupą –OH. W wodzie dają odczyn zasadowy.",
    residueLabel: "Grupa wodorotlenkowa",
    valenceLabel: "Liczba grup –OH",
    accent: "#3B82F6",
    ink: "#93C5FD",
  },
  {
    id: "tlenek",
    label: "Tlenki",
    single: "tlenek",
    blurb: "Tlen połączony z innym pierwiastkiem. Kwasowe, zasadowe i obojętne.",
    residueLabel: "Drugi atom",
    valenceLabel: "Wartościowość tlenu",
    accent: "#E74C3C",
    ink: "#FCA5A5",
  },
  {
    id: "sol",
    label: "Sole",
    single: "sól",
    blurb: "Metal i reszta kwasowa połączone wiązaniem jonowym.",
    residueLabel: "Anion (reszta kwasowa)",
    valenceLabel: "Wartościowość anionu",
    accent: "#F4D03F",
    ink: "#FDE68A",
  },
];

export const getCategory = (id) => CATEGORIES.find((category) => category.id === id);

/* ---------- produkty reakcji z probówki ---------- */

const NA2SO4_MODEL = (() => {
  const o1 = mul(TETRA[0], 1.48);
  const o2 = mul(TETRA[1], 1.48);
  const o3 = mul(TETRA[2], 1.58);
  const o4 = mul(TETRA[3], 1.58);
  return {
    atoms: [
      { el: "S", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "O", pos: o2 },
      { el: "O", pos: o3 },
      { el: "O", pos: o4 },
      { el: "Na", pos: mul(TETRA[2], 3.55) },
      { el: "Na", pos: mul(TETRA[3], 3.55) },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 3, b: 5, order: 1 },
      { a: 4, b: 6, order: 1 },
    ],
  };
})();

const NA3PO4_MODEL = (() => {
  const o1 = mul(TETRA[0], 1.54);
  const o2 = mul(TETRA[1], 1.63);
  const o3 = mul(TETRA[2], 1.63);
  const o4 = mul(TETRA[3], 1.63);
  return {
    atoms: [
      { el: "P", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "O", pos: o2 },
      { el: "O", pos: o3 },
      { el: "O", pos: o4 },
      { el: "Na", pos: mul(TETRA[1], 3.7) },
      { el: "Na", pos: mul(TETRA[2], 3.7) },
      { el: "Na", pos: mul(TETRA[3], 3.7) },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 2, b: 5, order: 1 },
      { a: 3, b: 6, order: 1 },
      { a: 4, b: 7, order: 1 },
    ],
  };
})();

const CACL2_MODEL = {
  atoms: [
    { el: "Ca", pos: CENTER },
    { el: "Cl", pos: [2.55, 0, 0] },
    { el: "Cl", pos: [-2.55, 0, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const MGCL2_MODEL = {
  atoms: [
    { el: "Mg", pos: CENTER },
    { el: "Cl", pos: [2.4, 0.15, 0] },
    { el: "Cl", pos: [-2.4, -0.15, 0] },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const FECL3_MODEL = {
  atoms: [
    { el: "Fe", pos: CENTER },
    { el: "Cl", pos: mul(PLANAR[0], 2.45) },
    { el: "Cl", pos: mul(PLANAR[1], 2.45) },
    { el: "Cl", pos: mul(PLANAR[2], 2.45) },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
  ],
};

const CANO32_MODEL = (() => {
  const nitrate = (origin) => [
    { el: "N", pos: origin },
    { el: "O", pos: add(origin, [1.26, 0.46, 0]) },
    { el: "O", pos: add(origin, [-1.26, 0.46, 0]) },
    { el: "O", pos: add(origin, [0, -1.34, 0]) },
  ];
  return {
    atoms: [
      { el: "Ca", pos: [0.6, -0.9, 0] },
      ...nitrate([-3.0, 0.2, 0]),
      ...nitrate([1.0, 2.7, 0]),
    ],
    bonds: [
      { a: 0, b: 4, order: 1 },
      { a: 1, b: 2, order: 2 },
      { a: 1, b: 3, order: 1 },
      { a: 1, b: 4, order: 1 },
      { a: 0, b: 8, order: 1 },
      { a: 5, b: 6, order: 2 },
      { a: 5, b: 7, order: 1 },
      { a: 5, b: 8, order: 1 },
    ],
  };
})();

const H2SO3_MODEL = (() => {
  const o1 = mul(TETRA[0], 1.45);
  const o2 = mul(TETRA[1], 1.62);
  const o3 = mul(TETRA[2], 1.62);
  return {
    atoms: [
      { el: "S", pos: CENTER },
      { el: "O", pos: o1 },
      { el: "O", pos: o2 },
      { el: "O", pos: o3 },
      { el: "H", pos: hydroxylH(CENTER, o2) },
      { el: "H", pos: hydroxylH(CENTER, o3) },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 2, b: 4, order: 1 },
      { a: 3, b: 5, order: 1 },
    ],
  };
})();

const Na2SO4_2D = {
  atoms: [
    { el: "S", x: 128, y: 104 },
    { el: "O", x: 128, y: 42 },
    { el: "O", x: 194, y: 138 },
    { el: "O", x: 62, y: 138 },
    { el: "O", x: 128, y: 166 },
    { el: "Na", x: 34, y: 196 },
    { el: "Na", x: 224, y: 196 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 0, b: 4, order: 1 },
    { a: 3, b: 5, order: 1 },
    { a: 2, b: 6, order: 1 },
  ],
};

const Na3PO4_2D = {
  atoms: [
    { el: "P", x: 134, y: 100 },
    { el: "O", x: 134, y: 38 },
    { el: "O", x: 200, y: 138 },
    { el: "O", x: 68, y: 138 },
    { el: "O", x: 134, y: 162 },
    { el: "Na", x: 240, y: 176 },
    { el: "Na", x: 28, y: 176 },
    { el: "Na", x: 134, y: 216 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 0, b: 4, order: 1 },
    { a: 2, b: 5, order: 1 },
    { a: 3, b: 6, order: 1 },
    { a: 4, b: 7, order: 1 },
  ],
};

const CaCl2_2D = {
  atoms: [
    { el: "Ca", x: 120, y: 104 },
    { el: "Cl", x: 46, y: 104 },
    { el: "Cl", x: 194, y: 104 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const MgCl2_2D = {
  atoms: [
    { el: "Mg", x: 120, y: 104 },
    { el: "Cl", x: 46, y: 104 },
    { el: "Cl", x: 194, y: 104 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
  ],
};

const FeCl3_2D = {
  atoms: [
    { el: "Fe", x: 128, y: 112 },
    { el: "Cl", x: 128, y: 44 },
    { el: "Cl", x: 198, y: 152 },
    { el: "Cl", x: 58, y: 152 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 0, b: 2, order: 1 },
    { a: 0, b: 3, order: 1 },
  ],
};

const CaNO32_2D = {
  atoms: [
    { el: "Ca", x: 122, y: 112 },
    { el: "N", x: 60, y: 48 },
    { el: "O", x: 60, y: 6 },
    { el: "O", x: 106, y: 70 },
    { el: "O", x: 16, y: 70 },
    { el: "N", x: 186, y: 176 },
    { el: "O", x: 186, y: 218 },
    { el: "O", x: 232, y: 154 },
    { el: "O", x: 142, y: 154 },
  ],
  bonds: [
    { a: 1, b: 2, order: 2 },
    { a: 1, b: 3, order: 1 },
    { a: 1, b: 4, order: 1 },
    { a: 0, b: 3, order: 1 },
    { a: 5, b: 6, order: 2 },
    { a: 5, b: 7, order: 1 },
    { a: 5, b: 8, order: 1 },
    { a: 0, b: 8, order: 1 },
  ],
};

const H2SO3_2D = {
  atoms: [
    { el: "S", x: 124, y: 104 },
    { el: "O", x: 124, y: 44 },
    { el: "O", x: 184, y: 140 },
    { el: "H", x: 218, y: 168 },
    { el: "O", x: 64, y: 140 },
    { el: "H", x: 30, y: 168 },
  ],
  bonds: [
    { a: 0, b: 1, order: 2 },
    { a: 0, b: 2, order: 1 },
    { a: 2, b: 3, order: 1 },
    { a: 0, b: 4, order: 1 },
    { a: 4, b: 5, order: 1 },
  ],
};

/* ---------- związki ---------- */

export const COMPOUNDS = [
  {
    id: "hcl",
    name: "kwas chlorowodorowy",
    aka: "chlorowodór",
    category: "kwas",
    tag: "Kwas beztlenowy · mocny",
    formula: "HCl",
    accent: "#2ECC71",
    description:
      "Najprostszy kwas: jeden atom wodoru połączony z jednym atomem chloru wiązaniem pojedynczym. W wodzie rozpada się na H⁺ i Cl⁻.",
    residue: { symbol: "Cl", charge: "−", name: "reszta kwasowa chlorkowa (jon chlorkowy)" },
    valence: { roman: "I", word: "jednowartościowa" },
    uses: ["Kwas solny w żołądku trawi pokarm", "Produkcja PVC i leków", "Usuwanie kamienia i rdzy"],
    model: HCL_MODEL,
    structural: HCl_2D,
  },
  {
    id: "hno3",
    name: "kwas azotowy(V)",
    aka: "kwas azotowy",
    category: "kwas",
    tag: "Kwas tlenowy · mocny",
    formula: "HNO3",
    accent: "#3B82F6",
    description:
      "Azot w środku, jedno wiązanie podwójne N=O, jedna grupa –O–H i jeden atom tlenu połączony pojedynczo.",
    residue: { symbol: "NO3", charge: "−", name: "reszta kwasowa azotanowa(V) (jon azotanowy)" },
    valence: { roman: "I", word: "jednowartościowa" },
    uses: ["Nawozy azotowe (saletry)", "Trawienie metali w laboratorium", "Produkcja barwników"],
    model: HNO3_MODEL,
    structural: HNO3_2D,
  },
  {
    id: "h2so4",
    name: "kwas siarkowy(VI)",
    aka: "kwas siarkowy",
    category: "kwas",
    tag: "Kwas tlenowy · mocny",
    formula: "H2SO4",
    accent: "#E5B93C",
    description:
      "Siarka w środku cząsteczki, dwa wiązania podwójne z tlenem i dwie grupy –O–H. Silnie żrący i higroskopijny.",
    residue: { symbol: "SO4", charge: "2−", name: "reszta kwasowa siarczanowa(VI) (jon siarczanowy)" },
    valence: { roman: "II", word: "dwuwartościowa" },
    uses: ["Elektrolit w akumulatorze samochodowym", "Produkcja nawozów i farb", "Osuszanie gazów"],
    model: H2SO4_MODEL,
    structural: H2SO4_2D,
  },
  {
    id: "h3po4",
    name: "kwas fosforowy(V)",
    aka: "kwas ortofosforowy",
    category: "kwas",
    tag: "Kwas tlenowy · średniej mocy",
    formula: "H3PO4",
    accent: "#9B59B6",
    description:
      "Fosfor w środku, jedno wiązanie podwójne P=O i trzy grupy –O–H — dlatego reszta jest trójwartościowa.",
    residue: { symbol: "PO4", charge: "3−", name: "reszta kwasowa fosforanowa(V) (jon fosforanowy)" },
    valence: { roman: "III", word: "trójwartościowa" },
    uses: ["Regulator kwasowości w napojach", "Nawozy fosforowe", "Odrdzewiacze"],
    model: H3PO4_MODEL,
    structural: H3PO4_2D,
  },
  {
    id: "naoh",
    name: "wodorotlenek sodu",
    aka: "soda kaustyczna",
    category: "wodorotlenek",
    tag: "Wodorotlenek · mocna zasada",
    formula: "NaOH",
    accent: "#3B82F6",
    description:
      "Kation sodu Na⁺ i grupa wodorotlenkowa OH⁻. W wodzie daje silnie zasadowy odczyn i przewodzi prąd.",
    residue: { symbol: "OH", charge: "−", name: "grupa wodorotlenkowa (jon wodorotlenkowy)" },
    valence: { roman: "I", word: "jedna grupa –OH" },
    uses: ["Produkcja mydła", "Udrażnianie rur i czyszczenie pieców", "Przemysł papierniczy"],
    model: NAOH_MODEL,
    structural: NaOH_2D,
  },
  {
    id: "koh",
    name: "wodorotlenek potasu",
    aka: "potas żrący",
    category: "wodorotlenek",
    tag: "Wodorotlenek · mocna zasada",
    formula: "KOH",
    accent: "#8E7CC3",
    description:
      "Kation potasu K⁺ połączony z grupą –OH. Jeszcze silniejsza zasada niż wodorotlenek sodu.",
    residue: { symbol: "OH", charge: "−", name: "grupa wodorotlenkowa (jon wodorotlenkowy)" },
    valence: { roman: "I", word: "jedna grupa –OH" },
    uses: ["Mydła potasowe (płynne)", "Elektrolit baterii alkalicznych", "Pochłanianie dwutlenku węgla"],
    model: KOH_MODEL,
    structural: KOH_2D,
  },
  {
    id: "caoh2",
    name: "wodorotlenek wapnia",
    aka: "wapno gaszone",
    category: "wodorotlenek",
    tag: "Wodorotlenek · zasada",
    formula: "Ca(OH)2",
    accent: "#7FA650",
    description:
      "Wapń i dwie grupy –OH. Powstaje, gdy wapno palone zalejemy wodą — reakcji towarzyszy wydzielanie ciepła.",
    residue: { symbol: "OH", charge: "−", name: "grupa wodorotlenkowa (jon wodorotlenkowy)" },
    valence: { roman: "II", word: "dwie grupy –OH" },
    uses: ["Zaprawa wapienna i tynki", "Bielenie ścian i pni drzew", "Uzdatnianie wody i gleby"],
    model: CAOH2_MODEL,
    structural: CaOH2_2D,
  },
  {
    id: "mgoh2",
    name: "wodorotlenek magnezu",
    aka: "mleko magnezowe",
    category: "wodorotlenek",
    tag: "Wodorotlenek · łagodna zasada",
    formula: "Mg(OH)2",
    accent: "#9BE15D",
    description:
      "Magnez i dwie grupy –OH. Zawiesina tego wodorotlenku w wodzie to mleko magnezowe — łagodna zasada, która nie drażni tkanek.",
    residue: { symbol: "OH", charge: "−", name: "grupa wodorotlenkowa (jon wodorotlenkowy)" },
    valence: { roman: "II", word: "dwie grupy –OH" },
    uses: [
      "Lek zobojętniający kwas żołądkowy",
      "Ochrona metali przed korozją",
      "Wypełniacz w przemyśle papierniczym",
    ],
    model: MGOH2_MODEL,
    structural: MgOH2_2D,
  },
  {
    id: "h2o",
    name: "tlenek wodoru",
    aka: "woda",
    category: "tlenek",
    tag: "Tlenek wodoru",
    formula: "H2O",
    accent: "#3B82F6",
    description:
      "Dwa atomy wodoru przy tlenie pod kątem ok. 104,5°. Cząsteczka polarna, dlatego woda rozpuszcza tak wiele substancji.",
    residue: { symbol: "O", charge: "2−", name: "atom tlenu (w wodzie połączony z wodorem)" },
    valence: { roman: "II", word: "tlen jest dwuwartościowy" },
    uses: ["Uniwersalny rozpuszczalnik", "Para technologiczna i chłodzenie", "Środowisko życia"],
    model: H2O_MODEL,
    structural: H2O_2D,
  },
  {
    id: "co2",
    name: "tlenek węgla(IV)",
    aka: "dwutlenek węgla",
    category: "tlenek",
    tag: "Tlenek kwasowy",
    formula: "CO2",
    accent: "#4B5563",
    description:
      "Liniowa cząsteczka O=C=O. W wodzie tworzy kwas węglowy, dlatego zaliczamy go do tlenków kwasowych.",
    residue: { symbol: "O", charge: "2−", name: "atom tlenu" },
    valence: { roman: "II", word: "tlen jest dwuwartościowy" },
    uses: ["Bąbelki w napojach gazowanych", "Suchy lód do chłodzenia", "Gaśnice śniegowe"],
    model: CO2_MODEL,
    structural: CO2_2D,
  },
  {
    id: "so2",
    name: "tlenek siarki(IV)",
    aka: "dwutlenek siarki",
    category: "tlenek",
    tag: "Tlenek kwasowy · drażniący",
    formula: "SO2",
    accent: "#F4D03F",
    description:
      "Kątowa cząsteczka z dwoma wiązaniami podwójnymi S=O. Tlenek siarki(IV) powstaje przy spalaniu węgla i jest składnikiem kwaśnych deszczy.",
    residue: { symbol: "O", charge: "2−", name: "atom tlenu" },
    valence: { roman: "II", word: "tlen jest dwuwartościowy" },
    uses: ["Konserwacja wina i suszonych owoców", "Wybielanie papieru", "Wykrywanie wycieków w instalacjach"],
    model: SO2_MODEL,
    structural: SO2_2D,
  },
  {
    id: "cao",
    name: "tlenek wapnia",
    aka: "wapno palone",
    category: "tlenek",
    tag: "Tlenek zasadowy",
    formula: "CaO",
    accent: "#7FA650",
    description:
      "Wapń i tlen połączone wiązaniem jonowym. Z wodą reaguje gwałtownie, tworząc wapno gaszone i wydzielając ciepło.",
    residue: { symbol: "O", charge: "2−", name: "atom tlenu" },
    valence: { roman: "II", word: "tlen jest dwuwartościowy" },
    uses: ["Cement i zaprawy murarskie", "Odsiarczanie spalin", "Osuszanie pomieszczeń"],
    model: CAO_MODEL,
    structural: CaO_2D,
  },
  {
    id: "fe2o3",
    name: "tlenek żelaza(III)",
    aka: "rdza, hematyt",
    category: "tlenek",
    tag: "Tlenek zasadowy · ruda",
    formula: "Fe2O3",
    accent: "#D97757",
    description:
      "Dwa atomy żelaza i trzy atomy tlenu. To dokładnie ten związek, który widzisz jako brunatną rdzę na starych konstrukcjach — i główny składnik rudy hematytu.",
    residue: { symbol: "O", charge: "2−", name: "atom tlenu" },
    valence: { roman: "II", word: "tlen jest dwuwartościowy" },
    uses: [
      "Składnik rdzy i produkt korozji",
      "Ruda żelaza w hutnictwie",
      "Brązowy pigment i pasta polerska",
    ],
    model: FE2O3_MODEL,
    structural: Fe2O3_2D,
  },
  {
    id: "nacl",
    name: "chlorek sodu",
    aka: "sól kuchenna",
    category: "sol",
    tag: "Sól · chlorek",
    formula: "NaCl",
    accent: "#2ECC71",
    description:
      "Kation Na⁺ i anion Cl⁻ związane wiązaniem jonowym. W krysztale jony układają się w regularną sieć; w wodzie ulegają dysocjacji.",
    residue: { symbol: "Cl", charge: "−", name: "anion chlorkowy" },
    valence: { roman: "I", word: "jednowartościowy anion" },
    uses: ["Przyprawa i konserwant", "Posypywanie dróg zimą", "Surowiec do produkcji chloru i sody"],
    model: NACL_MODEL,
    structural: NaCl_2D,
  },
  {
    id: "caco3",
    name: "węglan wapnia",
    aka: "wapień, kalcyt, marmur",
    category: "sol",
    tag: "Sól · węglan",
    formula: "CaCO3",
    accent: "#C9A227",
    description:
      "Wapń i reszta węglanowa CO₃²⁻. Pod wpływem kwasu burzy się, wydzielając dwutlenek węgla — tak powstają jaskinie krasowe.",
    residue: { symbol: "CO3", charge: "2−", name: "anion węglanowy" },
    valence: { roman: "II", word: "dwuwartościowy anion" },
    uses: ["Wapień i marmur w budownictwie", "Surowiec do produkcji wapna", "Tabletki wapnia i pasta do zębów"],
    model: CACO3_MODEL,
    structural: CaCO3_2D,
  },
  {
    id: "nahco3",
    name: "wodorowęglan sodu",
    aka: "soda oczyszczona",
    category: "sol",
    tag: "Sól · wodorowęglan",
    formula: "NaHCO3",
    accent: "#8AB6D6",
    description:
      "Sód i reszta wodorowęglanowa HCO₃⁻. Z kwasem reaguje burzliwie, dlatego spulchnia ciasto i neutralizuje nadmiar kwasu.",
    residue: { symbol: "HCO3", charge: "−", name: "anion wodorowęglanowy" },
    valence: { roman: "I", word: "jednowartościowy anion" },
    uses: ["Proszek do pieczenia", "Lek na zgagę", "Domowe środki czyszczące"],
    model: NAHCO3_MODEL,
    structural: NaHCO3_2D,
  },
  {
    id: "kno3",
    name: "azotan(V) potasu",
    aka: "saletra potasowa",
    category: "sol",
    tag: "Sól · azotan",
    formula: "KNO3",
    accent: "#C084FC",
    description:
      "Kation potasu K⁺ i anion azotanowy(V) NO₃⁻. Dawniej główny składnik prochu czarnego, dziś nawóz i konserwant — dobrze rozpuszcza się w wodzie.",
    residue: { symbol: "NO3", charge: "−", name: "anion azotanowy(V)" },
    valence: { roman: "I", word: "jednowartościowy anion" },
    uses: [
      "Nawóz azotowo-potasowy",
      "Konserwant wędlin i serów",
      "Pirotechnika i sztuczne ognie",
    ],
    model: KNO3_MODEL,
    structural: KNO3_2D,
  },
  {
    id: "caso4",
    name: "siarczan(VI) wapnia",
    aka: "gips, anhydryt",
    category: "sol",
    tag: "Sól · siarczan",
    formula: "CaSO4",
    accent: "#67E8F9",
    description:
      "Kation wapnia Ca²⁺ i anion siarczanowy(VI) SO₄²⁻. Z wodą tworzy gips — dlatego po zmieszaniu z wodą twardnieje w formę.",
    residue: { symbol: "SO4", charge: "2−", name: "anion siarczanowy(VI)" },
    valence: { roman: "II", word: "dwuwartościowy anion" },
    uses: [
      "Gips budowlany i opatrunki",
      "Regulator wiązania cementu",
      "Formy odlewnicze i modele stomatologiczne",
    ],
    model: CASO4_MODEL,
    structural: CaSO4_2D,
  },
  {
    id: "na2so4",
    name: "siarczan(VI) sodu",
    aka: "sól glauberska",
    category: "sol",
    tag: "Sól · siarczan",
    formula: "Na2SO4",
    accent: "#60A5FA",
    description:
      "Dwa kationy sodu Na⁺ i anion siarczanowy(VI) SO₄²⁻. Powstaje w reakcji zobojętniania kwasu siarkowego(VI) zasadą sodową.",
    residue: { symbol: "SO4", charge: "2−", name: "anion siarczanowy(VI)" },
    valence: { roman: "II", word: "dwuwartościowy anion" },
    uses: [
      "Środek suszący w laboratorium",
      "Produkcja szkła i detergentów",
      "Lek przeczyszczający (sól glauberska)",
    ],
    model: NA2SO4_MODEL,
    structural: Na2SO4_2D,
  },
  {
    id: "na3po4",
    name: "fosforan(V) sodu",
    aka: "ortofosforan sodu",
    category: "sol",
    tag: "Sól · fosforan",
    formula: "Na3PO4",
    accent: "#C084FC",
    description:
      "Trzy kationy sodu Na⁺ i anion fosforanowy(V) PO₄³⁻. Trójprotonowy kwas fosforowy(V) potrzebuje aż trzech cząsteczek wodorotlenku sodu.",
    residue: { symbol: "PO4", charge: "3−", name: "anion fosforanowy(V)" },
    valence: { roman: "III", word: "trójwartościowy anion" },
    uses: [
      "Budulec detergentów i zmiękczacz wody",
      "Nawóz fosforowy",
      "Dodatek do żywności (E339)",
    ],
    model: NA3PO4_MODEL,
    structural: Na3PO4_2D,
  },
  {
    id: "cacl2",
    name: "chlorek wapnia",
    aka: "chlorek wapniowy",
    category: "sol",
    tag: "Sól · chlorek",
    formula: "CaCl2",
    accent: "#34D399",
    description:
      "Kation wapnia Ca²⁺ i dwa aniony chlorkowe Cl⁻. Bardzo dobrze rozpuszczalny w wodzie i silnie higroskopijny.",
    residue: { symbol: "Cl", charge: "1−", name: "anion chlorkowy" },
    valence: { roman: "I", word: "jednowartościowy anion" },
    uses: [
      "Odsalanie i osuszanie pomieszczeń",
      "Posypywanie dróg zimą",
      "Wapń w wodzie pitnej i przemyśle spożywczym",
    ],
    model: CACL2_MODEL,
    structural: CaCl2_2D,
  },
  {
    id: "cano32",
    name: "azotan(V) wapnia",
    aka: "saletra wapniowa",
    category: "sol",
    tag: "Sól · azotan",
    formula: "Ca(NO3)2",
    accent: "#93C5FD",
    description:
      "Kation wapnia Ca²⁺ i dwa aniony azotanowe(V) NO₃⁻. Powstaje, gdy wapień rozpuszcza się w kwasie azotowym(V).",
    residue: { symbol: "NO3", charge: "1−", name: "anion azotanowy(V)" },
    valence: { roman: "I", word: "jednowartościowy anion" },
    uses: [
      "Nawóz wapniowo-azotowy",
      "Składnik mieszanin chłodzących",
      "Produkcja materiałów wybuchowych",
    ],
    model: CANO32_MODEL,
    structural: CaNO32_2D,
  },
  {
    id: "mgcl2",
    name: "chlorek magnezu",
    category: "sol",
    tag: "Sól · chlorek",
    formula: "MgCl2",
    accent: "#A3E635",
    description:
      "Kation magnezu Mg²⁺ i dwa aniony chlorkowe Cl⁻. Powstaje po rozpuszczeniu wodorotlenku magnezu w kwasie solnym.",
    residue: { symbol: "Cl", charge: "1−", name: "anion chlorkowy" },
    valence: { roman: "I", word: "jednowartościowy anion" },
    uses: [
      "Surowiec do produkcji magnezu",
      "Topnik w metalurgii",
      "Odsalanie dróg i solanka spożywcza",
    ],
    model: MGCL2_MODEL,
    structural: MgCl2_2D,
  },
  {
    id: "fecl3",
    name: "chlorek żelaza(III)",
    aka: "chlorek żelazowy",
    category: "sol",
    tag: "Sól · chlorek",
    formula: "FeCl3",
    accent: "#FB923C",
    description:
      "Kation żelaza(III) Fe³⁺ i trzy aniony chlorkowe Cl⁻. Żółtopomarańczowy roztwór powstaje podczas odrdzewiania metalu kwasem.",
    residue: { symbol: "Cl", charge: "1−", name: "anion chlorkowy" },
    valence: { roman: "I", word: "jednowartościowy anion" },
    uses: [
      "Trawienie płytek obwodów drukowanych",
      "Koagulant w oczyszczaniu wody",
      "Barwnik i katalizator w syntezie organicznej",
    ],
    model: FECL3_MODEL,
    structural: FeCl3_2D,
  },
  {
    id: "h2so3",
    name: "kwas siarkowy(IV)",
    aka: "kwas siarkawy",
    category: "kwas",
    tag: "Kwas tlenowy · słaby",
    formula: "H2SO3",
    accent: "#67E8F9",
    description:
      "Tlenek siarki(IV) rozpuszczony w wodzie. Szybko się rozkłada, a jego sole — siarczany(IV) — powstają w reakcjach z zasadami.",
    residue: { symbol: "SO3", charge: "2−", name: "reszta kwasowa siarczanowa(IV) (jon siarczanowy(IV))" },
    valence: { roman: "II", word: "dwuwartościowa" },
    uses: [
      "Powstaje w kwaśnych deszczach",
      "Konserwant wina (siarczyny)",
      "Pośrednik w produkcji kwasu siarkowego(VI)",
    ],
    model: H2SO3_MODEL,
    structural: H2SO3_2D,
  },
];

export const getCompound = (id) => COMPOUNDS.find((compound) => compound.id === id);

export const compoundsByCategory = (categoryId) =>
  COMPOUNDS.filter((compound) => compound.category === categoryId);

export function atomCounts(model) {
  const counts = {};
  model.atoms.forEach((atom) => {
    counts[atom.el] = (counts[atom.el] || 0) + 1;
  });
  return counts;
}

// Pierwiastki występujące w danej cząsteczce — do legend przy modelu.
export function elementsOf(compound) {
  const counts = atomCounts(compound.model);
  return ELEMENT_ORDER.filter((symbol) => counts[symbol]);
}

// Związki zawierające dany pierwiastek — używane w karcie pierwiastka.
export const compoundsWithElement = (symbol) =>
  COMPOUNDS.filter((compound) => compound.model.atoms.some((atom) => atom.el === symbol));

// Wzór sumaryczny z policzonych atomów (kolejność Hilla: C, H, reszta alfabetycznie).
export function formulaFromCounts(counts) {
  const present = Object.keys(counts || {}).filter((symbol) => counts[symbol] > 0);
  const head = ["C", "H"].filter((symbol) => present.includes(symbol));
  const rest = present.filter((symbol) => !["C", "H"].includes(symbol)).sort();
  return [...head, ...rest]
    .map((symbol) => `${symbol}${counts[symbol] > 1 ? counts[symbol] : ""}`)
    .join("");
}