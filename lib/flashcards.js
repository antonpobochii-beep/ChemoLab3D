const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const POLISH = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (character) => POLISH[character])
    .replace(/[\s\-–—().,]/g, "");

// Sprawdzenie wpisanej nazwy: akceptujemy nazwę, nazwę potoczną i wzór.
export function checkCompoundAnswer(compound, answer) {
  const typed = normalize(answer);
  if (!typed) return false;
  const accepted = [compound.name, compound.aka, compound.formula];
  return accepted.some((value) => normalize(value) === typed);
}

export function pickRandomCompound(compounds = [], excludeId = null) {
  const pool = compounds.filter((compound) => compound.id !== excludeId);
  if (!pool.length) return compounds[0] ?? null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Talia fiszek: losowo wybrane związki, na przemian pytanie o nazwę i o właściwość.
export function buildFlashcardDeck(compounds = [], size = 12) {
  return shuffle(compounds)
    .slice(0, size)
    .map((compound, index) => {
      const kind = index % 2 === 0 ? "nazwa" : "wlasciwosc";
      // Rozpraszacze nie mogą powtarzać tej samej właściwości co poprawna odpowiedź.
      const others = shuffle(
        compounds.filter(
          (item) => item.id !== compound.id && item.uses[0] !== compound.uses[0]
        )
      ).slice(0, 2);

      if (kind === "nazwa") {
        return {
          id: `${compound.id}-nazwa`,
          compoundId: compound.id,
          kind,
          question: "Jak nazywa się substancja o tej strukturze?",
          options: shuffle([compound, ...others]).map((item) => ({
            id: item.id,
            label: item.name,
          })),
          answerId: compound.id,
        };
      }

      const correctUse = compound.uses[0];
      const pool = shuffle([correctUse, ...others.map((item) => item.uses[0])]);
      return {
        id: `${compound.id}-wlasciwosc`,
        compoundId: compound.id,
        kind,
        question: "Które zastosowanie dotyczy tego związku?",
        options: pool.map((label, position) => ({ id: `o${position}`, label })),
        answerId: `o${pool.indexOf(correctUse)}`,
      };
    });
}