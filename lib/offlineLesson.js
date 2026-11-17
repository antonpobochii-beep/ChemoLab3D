import { COMPOUNDS } from "@/lib/chemistry";
import { analyzeCompound } from "@/lib/structure";

// Samodzielny plik HTML do pobrania — działa offline, bez internetu i bez Base44.
// Zawiera komplet notatek, wykaz związków i szybki quiz z odpowiedziami.

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const subscript = (formula) =>
  escapeHtml(formula).replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>");

function compoundRows() {
  return COMPOUNDS.map((compound) => {
    const ionic = analyzeCompound(compound).ionic;
    const kind = ionic ? "sieć jonowa (jednostka formalna)" : "cząsteczka kowalencyjna";
    return `<tr>
      <td><strong>${subscript(compound.formula)}</strong></td>
      <td>${escapeHtml(compound.name)}${compound.aka ? ` <span class="muted">(${escapeHtml(compound.aka)})</span>` : ""}</td>
      <td>${kind}</td>
      <td>${escapeHtml(compound.description || "")}</td>
      <td>${(compound.uses || []).map((use) => escapeHtml(use)).join(", ")}</td>
    </tr>`;
  }).join("");
}

function quizItems() {
  return COMPOUNDS.slice(0, 8)
    .map((compound, index) => {
      const ionic = analyzeCompound(compound).ionic;
      const question = ionic
        ? `Czy ${compound.name} tworzy cząsteczki?`
        : `Jaki typ wiązania występuje w ${compound.name}?`;
      const answer = ionic
        ? "Nie — to związek jonowy, tworzy sieć krystaliczną (jednostki formalne)."
        : "Wiązanie kowalencyjne — model kulkowo-patyczkowy pokazuje wspólne pary elektronowe.";
      return `<details>
        <summary>${index + 1}. ${escapeHtml(question)}</summary>
        <p>${escapeHtml(answer)}</p>
      </details>`;
    })
    .join("");
}

export function buildOfflineLesson() {
  const date = new Date().toLocaleDateString("pl-PL");
  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>ChemoLab 3D — zestaw offline na lekcję</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 32px 20px 64px; background: #070d19; color: #e8fbf5;
         font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif; line-height: 1.55; }
  main { max-width: 940px; margin: 0 auto; }
  header { border: 1px solid #12303a; border-radius: 24px; padding: 26px 24px;
           background: linear-gradient(150deg, #0b1626, #070d19); }
  h1 { margin: 0 0 6px; font-size: 28px; letter-spacing: -0.02em; }
  .brand { color: #00e6ac; }
  .muted { color: #9fb4bc; }
  h2 { margin: 34px 0 12px; font-size: 18px; letter-spacing: 0.02em; }
  h2::before { content: ""; display: inline-block; width: 8px; height: 8px; margin-right: 10px;
               border-radius: 999px; background: #00e6ac; vertical-align: middle; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border-bottom: 1px solid #16303c; padding: 10px 8px; text-align: left; vertical-align: top; }
  th { color: #00e6ac; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; }
  sub { font-size: 0.7em; }
  details { border: 1px solid #16303c; border-radius: 14px; padding: 12px 14px; margin-bottom: 8px; background: #0a1421; }
  summary { cursor: pointer; font-weight: 600; }
  details p { margin: 8px 0 0; color: #9fb4bc; }
  ul { padding-left: 20px; }
  li { margin-bottom: 6px; color: #c9e6df; }
  footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #16303c; font-size: 12px; color: #7d949c; }
  @media print { body { background: #fff; color: #111; } header, details { background: #fff; border-color: #ccc; }
    .muted, details p, li, footer { color: #333; } h2::before { background: #0a7; } th { color: #0a7; } }
</style>
</head>
<body>
<main>
  <header>
    <p class="muted" style="margin:0;font-size:11px;letter-spacing:.2em;text-transform:uppercase">Zestaw offline · ${escapeHtml(date)}</p>
    <h1>ChemoLab <span class="brand">3D</span> — notatki na lekcję</h1>
    <p class="muted" style="margin:0">Plik działa bez internetu. Otwórz go w przeglądarce lub wydrukuj (Ctrl/Cmd + P).</p>
  </header>

  <h2>Jak czytać modele</h2>
  <ul>
    <li><strong>Związki jonowe</strong> (sole, wodorotlenki, tlenki metali) nie tworzą cząsteczek — opisujemy je jako sieć krystaliczną i jednostki formalne, bez patyczków między jonami.</li>
    <li><strong>Związki kowalencyjne</strong> tworzą cząsteczki: liczba walców odpowiada rządowi wiązania (1, 2 lub 3).</li>
    <li>Wzory zapisujemy kanonicznie: kation przed anionem (NaCl, nie ClNa), wodór w kwasach na początku (H<sub>2</sub>SO<sub>4</sub>).</li>
    <li>Nazwy systematyczne podajemy zgodnie z IUPAC; nazwa zwyczajowa jest tylko dodatkiem.</li>
  </ul>

  <h2>Wykaz substancji (${COMPOUNDS.length})</h2>
  <table>
    <thead><tr><th>Wzór</th><th>Nazwa</th><th>Struktura</th><th>Opis</th><th>Zastosowania</th></tr></thead>
    <tbody>${compoundRows()}</tbody>
  </table>

  <h2>Karty pracy z odpowiedziami</h2>
  ${quizItems()}

  <footer>© ChemoLab 3D — materiał edukacyjny. Model 2D/3D w pełnej wersji online: otwórz aplikację ChemoLab 3D.</footer>
</main>
</body>
</html>`;
}

export function downloadOfflineLesson() {
  const html = buildOfflineLesson();
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chemolab-3d-lekcja-offline.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}