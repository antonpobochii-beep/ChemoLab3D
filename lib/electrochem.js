// Elektroujemność Paulinga — podstawa kolorowania chmury elektronowej i analizy dipola.

export const ELECTRONEGATIVITY = {
  H: 2.2,
  C: 2.55,
  N: 3.04,
  O: 3.44,
  F: 3.98,
  P: 2.19,
  S: 2.58,
  Cl: 3.16,
  Br: 2.96,
  I: 2.66,
  Na: 0.93,
  Mg: 1.31,
  K: 0.82,
  Ca: 1.0,
  Fe: 1.83,
  Zn: 1.65,
  Li: 0.98,
  Al: 1.61,
  Si: 1.9,
  Ba: 0.89,
};

const en = (symbol) => ELECTRONEGATIVITY[symbol] ?? 2.2;

// Czerwony: atom przyciąga elektrony (δ−). Niebieski: oddaje je (δ+ na wodór, kationy).
export function cloudTint(symbol) {
  const value = en(symbol);
  if (value >= 3) return "#ff5f6d";
  if (value <= 1.5) return "#5b8cff";
  return "#b388ff";
}

export function electronegativityGap(model) {
  const gaps = (model?.bonds ?? []).map((bond) =>
    Math.abs(
      en(model.atoms[bond.b]?.el) - en(model.atoms[bond.a]?.el)
    )
  );
  return gaps.length ? Math.max(...gaps) : 0;
}

// Dipol = suma wektorów wiązań skierowanych od atomu δ+ do atomu δ−.
export function analyzeDipole(model) {
  if (!model?.atoms?.length) return { polar: false, magnitude: 0 };

  let x = 0;
  let y = 0;
  let z = 0;

  (model.bonds ?? []).forEach((bond) => {
    const a = model.atoms[bond.a];
    const b = model.atoms[bond.b];
    if (!a || !b) return;
    const dx = b.pos[0] - a.pos[0];
    const dy = b.pos[1] - a.pos[1];
    const dz = b.pos[2] - a.pos[2];
    const length = Math.hypot(dx, dy, dz) || 1;
    const delta = en(b.el) - en(a.el);
    x += (dx / length) * delta;
    y += (dy / length) * delta;
    z += (dz / length) * delta;
  });

  const magnitude = Math.hypot(x, y, z);
  return { polar: magnitude > 0.35, magnitude: Number(magnitude.toFixed(2)) };
}

// Długości wiązań w pikometrach (pozycje modelu są w ångstremach) i kąty między wiązaniami.
export function bondGeometry(model) {
  if (!model?.atoms?.length) return { lengths: [], angles: [] };

  const lengths = (model.bonds ?? []).map((bond, index) => {
    const a = model.atoms[bond.a];
    const b = model.atoms[bond.b];
    const distance = Math.hypot(
      b.pos[0] - a.pos[0],
      b.pos[1] - a.pos[1],
      b.pos[2] - a.pos[2]
    );
    return { index, pm: Math.round(distance * 100) };
  });

  const angles = [];
  model.atoms.forEach((atom, index) => {
    const neighbours = [
      ...new Set(
        (model.bonds ?? [])
          .filter((bond) => bond.a === index || bond.b === index)
          .map((bond) => (bond.a === index ? bond.b : bond.a))
      ),
    ];

    if (neighbours.length < 2) return;

    const directions = neighbours.map((neighbour) => {
      const other = model.atoms[neighbour];
      const dx = other.pos[0] - atom.pos[0];
      const dy = other.pos[1] - atom.pos[1];
      const dz = other.pos[2] - atom.pos[2];
      const length = Math.hypot(dx, dy, dz) || 1;
      return [dx / length, dy / length, dz / length];
    });

    let sum = 0;
    let pairs = 0;
    for (let i = 0; i < directions.length; i += 1) {
      for (let j = i + 1; j < directions.length; j += 1) {
        const dot =
          directions[i][0] * directions[j][0] +
          directions[i][1] * directions[j][1] +
          directions[i][2] * directions[j][2];
        sum += (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
        pairs += 1;
      }
    }

    if (pairs) {
      angles.push({ index, degrees: Math.round((sum / pairs) * 10) / 10 });
    }
  });

  return { lengths, angles };
}

export function polarityLabel(model) {
  const dipole = analyzeDipole(model);
  const gap = electronegativityGap(model);
  if (dipole.polar) {
    return {
      polar: true,
      title: "Cząsteczka polarna — dipole się nie znoszą",
      detail: `Suma wektorów dipolowych wynosi ${dipole.magnitude.toFixed(2)} (próg polarności 0,35). Maksymalna różnica elektroujemności w wiązaniu: ${gap.toFixed(2)}.`,
    };
  }
  return {
    polar: false,
    title: "Cząsteczka niepolarna — dipole się znoszą",
    detail: `Suma wektorów dipolowych wynosi ${dipole.magnitude.toFixed(2)} (próg polarności 0,35). Maksymalna różnica elektroujemności w wiązaniu: ${gap.toFixed(2)}.`,
  };
}