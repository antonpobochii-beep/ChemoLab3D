// Zjawiska chemiczne: co się dzieje, jak zapisać reakcję i gdzie to wykorzystujemy.

export const PHENOMENA = [
  {
    id: "korozja",
    compound: "h2o",
    title: "Korozja metali (rdzewienie)",
    tag: "Utlenianie · redox",
    equation: "4 Fe + 3 O2 + 6 H2O → 4 Fe(OH)3",
    description:
      "Żelazo w obecności tlenu i wody utlenia się, a powstały wodorotlenek żelaza(III) przechodzi w brunatną rdzę. Rdza jest krucha i odsłania kolejne warstwy metalu.",
    applications: [
      "Stal nierdzewna i powłoki cynkowe chronią konstrukcje mostów",
      "Farba antykorozyjna na karoserie samochodów",
      "Galwanizacja blach ocynkowanych na dachy",
    ],
  },
  {
    id: "spalanie",
    compound: "co2",
    title: "Spalanie — reakcja egzotermiczna",
    tag: "Egzoenergetyczna",
    equation: "CH4 + 2 O2 → CO2 + 2 H2O + energia",
    description:
      "Substrat łączy się z tlenem i wydziela ciepło oraz światło. Spalanie całkowite daje CO₂ i wodę, niecałkowite — trujący tlenek węgla i sadzę.",
    applications: [
      "Ogrzewanie domów gazem ziemnym",
      "Silniki spalinowe i turbiny",
      "Piece hutnicze i energetyka",
    ],
  },
  {
    id: "neutralizacja",
    compound: "nacl",
    title: "Zobojętnianie (neutralizacja)",
    tag: "Kwas + zasada",
    equation: "HCl + NaOH → NaCl + H2O",
    description:
      "Kwas i zasada reagują, tworząc sól i wodę. Odczyn roztworu zmienia się w stronę obojętnego — to najprostszy sposób regulowania pH.",
    applications: [
      "Tabletki na zgagę neutralizują kwas żołądkowy",
      "Wapno gaszone odkwasza kwaśne gleby i jeziora",
      "Neutralizacja ścieków przemysłowych",
    ],
  },
  {
    id: "stracanie",
    compound: "nacl",
    title: "Strącanie osadu",
    tag: "Reakcja w roztworze",
    equation: "AgNO3 + NaCl → AgCl↓ + NaNO3",
    description:
      "Dwa rozpuszczalne związki wymieniają jony, a jeden z produktów jest nierozpuszczalny i wypada z roztworu jako osad. Strzałka w dół oznacza osad.",
    applications: [
      "Wykrywanie chlorków w wodzie",
      "Uzdatnianie wody — wytrącanie metali ciężkich",
      "Analiza chemiczna i produkcja pigmentów",
    ],
  },
  {
    id: "gaz",
    compound: "caco3",
    title: "Reakcja z wydzieleniem gazu",
    tag: "Burzenie węglanów",
    equation: "CaCO3 + 2 HCl → CaCl2 + CO2↑ + H2O",
    description:
      "Kwas reaguje z węglanem i wydziela dwutlenek węgla — widać bąbelki i pienienie. Ten sam mechanizm spulchnia ciasto w piekarniku.",
    applications: [
      "Proszek do pieczenia w cieście",
      "Usuwanie kamienia i rdzy domowymi sposobami",
      "Gaśnice pianowe",
    ],
  },
  {
    id: "fermentacja",
    compound: "co2",
    title: "Fermentacja alkoholowa",
    tag: "Biochemia · kataliza enzymatyczna",
    equation: "C6H12O6 → 2 C2H5OH + 2 CO2",
    description:
      "Drożdże rozkładają glukozę na alkohol etylowy i dwutlenek węgla. Reakcję przyspieszają enzymy — naturalne katalizatory.",
    applications: [
      "Wypiek chleba (bąble CO₂)",
      "Produkcja piwa i wina",
      "Biopaliwa — etanol dodawany do benzyny",
    ],
  },
  {
    id: "rozkład",
    compound: "cao",
    title: "Rozkład termiczny (reakcja endoenergetyczna)",
    tag: "Endoenergetyczna",
    equation: "CaCO3 → CaO + CO2 (temp. ok. 900 °C)",
    description:
      "Wysoka temperatura rozrywa węglan na tlenek wapnia i dwutlenek węgla. Reakcja pochłania energię, więc trzeba ją stale dostarczać.",
    applications: [
      "Wypalanie wapna palonego w piecach wapienniczych",
      "Produkcja cementu",
      "Otrzymywanie metali z rud",
    ],
  },
  {
    id: "dysocjacja",
    compound: "nacl",
    title: "Dysocjacja elektrolityczna",
    tag: "Elektrolity",
    equation: "NaCl (aq) → Na+ + Cl−",
    description:
      "W wodzie wiązanie jonowe pęka i powstają swobodne jony. To one przenoszą prąd — dlatego sól rozpuszczona w wodzie przewodzi elektryczność.",
    applications: [
      "Elektrolity w akumulatorach i bateriach",
      "Sole mineralne w organizmie (sód, potas)",
      "Elektroliza — produkcja chloru i aluminium",
    ],
  },
  {
    id: "kataliza",
    compound: "h2o",
    title: "Kataliza — rozkład wody utlenionej",
    tag: "Katalizator",
    equation: "2 H2O2 → 2 H2O + O2 (kat. MnO2)",
    description:
      "Katalizator obniża energię aktywacji, więc reakcja biegnie szybciej, choć sam nie zużywa się. Dosypanie dwutlenku manganu powoduje gwałtowne pienienie.",
    applications: [
      "Odkażanie ran wodą utlenioną",
      "Katalizatory w samochodowych filtrach spalin",
      "Przemysłowa synteza amoniaku (kataliza żelazowa)",
    ],
  },
  {
    id: "elektroliza",
    compound: "h2o",
    title: "Elektroliza wody",
    tag: "Prąd w chemii",
    equation: "2 H2O → 2 H2↑ + O2↑",
    description:
      "Prąd elektryczny wymusza reakcję chemiczną: na katodzie wydziela się wodór (dwa razy więcej objętości), na anodzie tlen.",
    applications: [
      "Produkcja wodoru jako paliwa",
      "Otrzymywanie czystych metali (miedź, glin)",
      "Chromowanie i złocenie powierzchni",
    ],
  },
  {
    id: "fotosynteza",
    compound: "co2",
    title: "Fotosynteza",
    tag: "Energia świetlna",
    equation: "6 CO2 + 6 H2O → C6H12O6 + 6 O2 (światło, chlorofil)",
    description:
      "Rośliny zamieniają dwutlenek węgla i wodę w glukozę, uwalniając tlen. To największa reakcja chemiczna na Ziemi — źródło tlenu i pokarmu.",
    applications: [
      "Produkcja żywności i tlenu w atmosferze",
      "Uprawy szklarniowe z doświetlaniem",
      "Pochłanianie CO₂ przez lasy i fitoplankton",
    ],
  },
  {
    id: "egzoendo",
    compound: "caoh2",
    title: "Efekt cieplny: gaszenie wapna",
    tag: "Egzoenergetyczna",
    equation: "CaO + H2O → Ca(OH)2 + ciepło",
    description:
      "Wapno palone zalane wodą mocno się nagrzewa, a nawet syczy. To klasyczny przykład reakcji egzoenergetycznej obok spalania i neutralizacji.",
    applications: [
      "Przygotowanie zaprawy wapiennej na budowie",
      "Ogrzewacze chemiczne i podgrzewacze żywności",
      "Bielenie pomieszczeń gospodarczych",
    ],
  },
];

// Które pierwiastki z układu okresowego biorą udział w danym zjawisku.
const PHENOMENON_ELEMENTS = {
  korozja: ["Fe", "O", "H"],
  spalanie: ["C", "H", "O"],
  neutralizacja: ["H", "Cl", "Na", "O"],
  stracanie: ["Na", "Cl", "N", "O"],
  gaz: ["Ca", "C", "O", "H", "Cl"],
  fermentacja: ["C", "H", "O"],
  rozkład: ["Ca", "C", "O"],
  dysocjacja: ["Na", "Cl"],
  kataliza: ["H", "O", "Mn"],
  elektroliza: ["H", "O"],
  fotosynteza: ["C", "H", "O"],
  egzoendo: ["Ca", "O", "H"],
};

export const phenomenaForElement = (symbol) =>
  PHENOMENA.filter((phenomenon) => (PHENOMENON_ELEMENTS[phenomenon.id] || []).includes(symbol));