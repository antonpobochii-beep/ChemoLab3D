// Sprawdzanie poprawności cząsteczki ułożonej przez użytkownika.

export function bondKey(a, b, order) {
  return `${Math.min(a, b)}-${Math.max(a, b)}-${order}`;
}

export function checkBuild(acid, placed, bonds) {
  const wrongAtoms = [];
  acid.structural.atoms.forEach((atom, index) => {
    if ((placed[index] ?? null) !== atom.el) wrongAtoms.push(index);
  });

  const targetKeys = new Set(
    acid.structural.bonds.map((bond) => bondKey(bond.a, bond.b, bond.order))
  );
  const userKeys = bonds.map((bond) => bondKey(bond.a, bond.b, bond.order));
  const userSet = new Set(userKeys);

  const missingBondKeys = [...targetKeys].filter((key) => !userSet.has(key));
  const extraBondKeys = userKeys.filter((key) => !targetKeys.has(key));

  return {
    ok: wrongAtoms.length === 0 && missingBondKeys.length === 0 && extraBondKeys.length === 0,
    wrongAtoms,
    missingBondKeys,
    extraBondKeys,
  };
}