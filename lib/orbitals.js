import { ELEMENTS } from "@/lib/chemistry";

// Plan orbitali wg VSEPR: hybrydyzacja atomu centralnego i wolne pary elektronowe.
// Liczba domen = liczba sąsiadów + wolne pary; pary odpychają wiązania i zmniejszają kąt.

const norm = (v) => {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
};
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

const HYBRID = {
  2: { name: "sp", angle: 180, color: "#f472b6" },
  3: { name: "sp²", angle: 120, color: "#fbbf24" },
  4: { name: "sp³", angle: 109.5, color: "#38bdf8" },
};

const OCTET = { C: true, N: true, O: true, F: true, Si: true, P: true, S: true, Cl: true, Br: true, I: true };

function geometryName(domains, pairs) {
  if (domains <= 2) return "liniowa";
  if (domains === 3) return pairs === 0 ? "trygonalna płaska" : "kątowa";
  if (pairs === 0) return "tetraedryczna";
  if (pairs === 1) return "piramidalna";
  return "kątowa (zgięta)";
}

function lonePairDirections(directions) {
  if (!directions.length) return [];
  const sum = directions.reduce((acc, dir) => add(acc, dir), [0, 0, 0]);
  const base = norm(mul(sum, -1));
  if (directions.length < 2) return [base];
  const axis = norm(cross(directions[0], directions[1])) || [0, 1, 0];
  const axisCross = cross(axis, base);
  return [
    norm(add(mul(base, 0.85), mul(axisCross, 0.5))),
    norm(add(mul(base, 0.85), mul(axisCross, -0.5))),
  ];
}

export function orbitalPlan(model) {
  const atoms = model?.atoms || [];
  const bonds = model?.bonds || [];
  const neighbors = atoms.map(() => []);
  const sharedPairs = atoms.map(() => 0);

  bonds.forEach((bond) => {
    const order = bond.order || 1;
    neighbors[bond.a].push(bond.b);
    neighbors[bond.b].push(bond.a);
    sharedPairs[bond.a] += order;
    sharedPairs[bond.b] += order;
  });

  // Atom centralny: najwięcej sąsiadów. Wodór nigdy nie jest centralny.
  let centralIndex = -1;
  atoms.forEach((atom, index) => {
    if (atom.el === "H") return;
    if (centralIndex < 0 || neighbors[index].length > neighbors[centralIndex].length) {
      centralIndex = index;
    }
  });

  const lobes = [];
  let info = null;
  let geometry = null;

  // Cząsteczka dwuatomowa: tylko jedno wiązanie, bez hybrydyzacji.
  if (atoms.length === 2 && bonds.length) {
    const [a, b] = [0, 1];
    const dir = norm(sub(atoms[b].pos, atoms[a].pos));
    lobes.push({
      position: add(atoms[a].pos, mul(dir, 0.5)),
      dir,
      length: 0.6,
      width: 0.18,
      color: "#38bdf8",
      kind: "bond",
    });
    return {
      lobes,
      hybridization: null,
      geometry: "liniowa (dwuatomowa)",
      angle: null,
      lonePairs: 0,
      centralSymbol: atoms[a].el,
      centralName: ELEMENTS[atoms[a].el]?.name,
    };
  }

  if (centralIndex >= 0) {
    const centralAtom = atoms[centralIndex];
    const around = neighbors[centralIndex];
    // Siarka w SO2 jest hiperwalentna: dwa wiązania podwójne i jedna wolna para.
    const sulfurException =
      centralAtom.el === "S" && around.length === 2 && sharedPairs[centralIndex] === 4;
    const pairs = OCTET[centralAtom.el]
      ? sulfurException
        ? 1
        : Math.max(0, 4 - sharedPairs[centralIndex])
      : 0;
    const domains = Math.min(4, Math.max(2, around.length + pairs));
    const base = HYBRID[domains];
    const angle = Math.round((base.angle - pairs * 2.5) * 10) / 10;
    info = { ...base, angle, pairs };
    geometry = geometryName(domains, pairs);

    // Płatki wiązań wokół atomu centralnego.
    around.forEach((neighborIndex) => {
      const dir = norm(sub(atoms[neighborIndex].pos, centralAtom.pos));
      lobes.push({
        position: add(centralAtom.pos, mul(dir, 0.5)),
        dir,
        length: Math.max(0.4, angle / 230),
        width: 0.19,
        color: info.color,
        kind: "bond",
      });
    });

    // Wolne pary elektronowe — fioletowe płatki odpychające wiązania.
    const directions = around.map((neighborIndex) =>
      norm(sub(atoms[neighborIndex].pos, centralAtom.pos))
    );
    if (pairs > 0 && directions.length) {
      lonePairDirections(directions)
        .slice(0, pairs)
        .forEach((dir) => {
          lobes.push({
            position: add(centralAtom.pos, mul(dir, 0.48)),
            dir,
            length: 0.46,
            width: 0.16,
            color: "#a78bfa",
            kind: "pair",
          });
        });
    }
  }

  // Wiązania pozostałych atomów (poza centralnym) — cienkie płatki styczne.
  atoms.forEach((atom, index) => {
    if (index === centralIndex) return;
    neighbors[index].forEach((neighborIndex) => {
      const dir = norm(sub(atoms[neighborIndex].pos, atom.pos));
      lobes.push({
        position: add(atom.pos, mul(dir, 0.45)),
        dir,
        length: 0.34,
        width: 0.13,
        color: info?.color || "#62ffd8",
        kind: "bond",
      });
    });
  });

  return {
    lobes,
    hybridization: info?.name ?? null,
    geometry,
    angle: info?.angle ?? null,
    lonePairs: info?.pairs ?? 0,
    centralSymbol: centralIndex >= 0 ? atoms[centralIndex].el : null,
    centralName: centralIndex >= 0 ? ELEMENTS[atoms[centralIndex].el]?.name : null,
  };
}