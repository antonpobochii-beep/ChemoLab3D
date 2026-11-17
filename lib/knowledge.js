// Treści edukacyjne: artykuły, słownik, reguły łączenia atomów, pomoc i grupy zastosowań.

export const KNOWLEDGE_ARTICLES = [
  {
    id: "wiazania",
    title: "Wiązania chemiczne",
    lead: "Atom dąży do trwałej konfiguracji elektronowej. Robi to na trzy sposoby — i od tego zależy, jak zbudowana jest cząsteczka.",
    sections: [
      {
        heading: "Wiązanie jonowe",
        body: "Powstaje między metalem a niemetalem o dużej różnicy elektroujemności. Elektron przechodzi z atomu metalu na atom niemetalu i powstają jony: kation i anion. Trzymają się razem dzięki przyciąganiu ładunków.",
        bullets: [
          "Przykład: Na⁺ + Cl⁻ → NaCl",
          "Wysoka temperatura topnienia i kruchość kryształów",
          "Roztwór wodny przewodzi prąd, bo jony są swobodne",
        ],
      },
      {
        heading: "Wiązanie kowalencyjne",
        body: "Dwa atomy niemetalowe współdzielą parę elektronów. Każda wspólna para to jedno wiązanie — dlatego oktety wymuszają konkretną liczbę wiązań wokół atomu.",
        bullets: [
          "Pojedyncze: H–Cl, O–H",
          "Podwójne: O=O, C=O w CO₂",
          "Potrójne: N≡N w cząsteczce azotu",
        ],
      },
      {
        heading: "Wiązanie metaliczne",
        body: "Kationy metalu tworzą sieć, a elektrony walencyjne poruszają się swobodnie między nimi. To dlatego metale przewodzą prąd i ciepło oraz są kowalne.",
      },
      {
        heading: "Jak to widać w modelu 3D",
        body: "W modelu kuleczkowo-prętowym kula to atom, a pałeczka to wiązanie. Dwie równoległe pałeczki oznaczają wiązanie podwójne, a brak pałeczki między dwoma jonami oznacza wiązanie jonowe.",
      },
    ],
  },
  {
    id: "wartosciowosc",
    title: "Wartościowość i wzory sumaryczne",
    lead: "Wartościowość mówi, ile wiązań może utworzyć atom albo ile ładunków ma jon. Reguła krzyżowa zamienia ją na wzór.",
    sections: [
      {
        heading: "Co to jest wartościowość",
        body: "To liczba wiązań, jakie pierwiastek tworzy w danym związku (dla jonów — wartość ładunku). Wodór jest jednowartościowy, tlen dwuwartościowy, a glin trójwartościowy.",
      },
      {
        heading: "Reguła krzyżowa",
        body: "Ładunek (wartościowość) jednego jonu staje się liczbą atomów drugiego. Potem skracamy, jeśli obie liczby mają wspólny dzielnik. Przykład: Al³⁺ i O²⁻ dają Al₂O₃.",
        bullets: [
          "Ca²⁺ + Cl⁻ → CaCl₂",
          "Fe³⁺ + O²⁻ → Fe₂O₃",
          "Ca²⁺ + SO₄²⁻ → CaSO₄ (dzielnik 2, więc bez indeksów)",
        ],
      },
      {
        heading: "Suma ładunków zawsze zero",
        body: "To najszybszy test poprawności wzoru: pomnóż liczbę kationów przez ich ładunek i dodaj iloczyn liczby anionów przez ich ładunek. Wynik musi być równy zeru.",
      },
      {
        heading: "Nawiasy w resztach",
        body: "Reszty wieloatomowe bierzemy w nawias, kiedy występują więcej niż raz: Ca(OH)₂, Fe₂(SO₄)₃. Bez nawiasu indeks liczyłby tylko ostatni atom.",
      },
    ],
  },
  {
    id: "grupy",
    title: "Kwasy, wodorotlenki, tlenki i sole",
    lead: "Cztery grupy związków nieorganicznych, które znajdziesz w katalogu — każda z inną budową i innym zachowaniem w wodzie.",
    sections: [
      {
        heading: "Kwasy",
        body: "Zaczynają się od wodoru, który w wodzie odczepia się jako jon H⁺. Im łatwiej to robią, tym mocniejszy kwas.",
        bullets: ["HCl, HNO₃ — mocne", "H₂SO₄ — mocny, dwuprotonowy", "H₃PO₄ — średniej mocy, trzyprotonowy"],
      },
      {
        heading: "Wodorotlenki",
        body: "Metal połączony z grupą –OH. W wodzie dysocjują na kation metalu i jony wodorotlenkowe, dając odczyn zasadowy.",
        bullets: ["NaOH, KOH — mocne zasady", "Ca(OH)₂ — wapno gaszone", "Mg(OH)₂ — zawiesina o łagodnym działaniu"],
      },
      {
        heading: "Tlenki",
        body: "Tlen z drugim pierwiastkiem. Tlenki metali są zasadowe, tlenki niemetali — kwasowe. Z wodą dają odpowiednio wodorotlenki i kwasy.",
        bullets: ["CaO + H₂O → Ca(OH)₂", "CO₂ + H₂O → H₂CO₃", "Fe₂O₃ — ruda żelaza, czerwony pigment"],
      },
      {
        heading: "Sole",
        body: "Kation metalu (lub jon amonowy) i anion reszty kwasowej. Powstają w reakcji zobojętnienia i w reakcjach strącania.",
        bullets: ["NaCl — sól kuchenna", "CaCO₃ — wapień i muszle", "KNO₃ — nawóz i składnik prochu"],
      },
    ],
  },
  {
    id: "reakcje",
    title: "Reakcje chemiczne w praktyce",
    lead: "Typ reakcji podpowiada, czego się spodziewać: nowych produktów, wydzielonego ciepła albo osadu.",
    sections: [
      {
        heading: "Synteza i analiza",
        body: "W syntezie kilka substratów łączy się w jeden produkt (2 H₂ + O₂ → 2 H₂O). W analizie jeden substrat rozpada się na prostsze (2 H₂O → 2 H₂ + O₂).",
      },
      {
        heading: "Wymiana pojedyncza i podwójna",
        body: "W wymianie pojedynczej metal wypiera inny metal z soli. W podwójnej dwa związki wymieniają się jonami — tak powstają osady, np. AgNO₃ + NaCl → AgCl↓ + NaNO₃.",
      },
      {
        heading: "Zobojętnianie",
        body: "Kwas + zasada → sól + woda. To podstawa regulacji pH: leczenia zgagi, uzdatniania wody i neutralizacji wycieków.",
      },
      {
        heading: "Energia reakcji",
        body: "Reakcje egzoenergetyczne oddają ciepło (spalanie, zobojętnianie), endoenergetyczne pobierają je z otoczenia (rozpuszczanie saletr, prażenie wapienia).",
      },
    ],
  },
];

export const GLOSSARY = [
  { term: "Atom", tag: "budowa", short: "Najmniejsza cząstka pierwiastka zachowująca jego właściwości.", long: "Atom składa się z jądra (protony i neutrony) oraz elektronów krążących po powłokach. Liczba protonów decyduje o tym, jaki to pierwiastek i gdzie leży w układzie okresowym." },
  { term: "Cząsteczka", tag: "budowa", short: "Grupa atomów połączonych wiązaniami, tworząca odrębną całość.", long: "Cząsteczka może być jednoatomowa (He), dwuatomowa (O₂) albo wieloatomowa (H₂SO₄). W modelu 3D każdej cząsteczce odpowiada zestaw kul i pałeczek." },
  { term: "Jon", tag: "budowa", short: "Atom lub grupa atomów mająca ładunek elektryczny.", long: "Jon powstaje, gdy atom oddaje albo przyjmuje elektrony. Jony dodatnie to kationy, ujemne — aniony. W roztworze poruszają się swobodnie i przewodzą prąd." },
  { term: "Kation", tag: "budowa", short: "Jon dodatni, najczęściej metal albo jon amonowy.", long: "Kationy zapisujemy ze znakiem plus: Na⁺, Ca²⁺, NH₄⁺. W solach zawsze stoją na pierwszym miejscu we wzorze." },
  { term: "Anion", tag: "budowa", short: "Jon ujemny — reszta kwasowa lub jon wodorotlenkowy.", long: "Aniony zapisujemy ze znakiem minus: Cl⁻, OH⁻, SO₄²⁻. Ładunek anionu to jednocześnie wartościowość reszty kwasowej." },
  { term: "Wartościowość", tag: "wiązania", short: "Liczba wiązań, które tworzy atom w związku.", long: "Dla jonów wartościowość równa się wielkości ładunku. Reguła krzyżowa pozwala ułożyć wzór sumaryczny: ładunki zamieniają się miejscami i skracają." },
  { term: "Reszta kwasowa", tag: "wiązania", short: "Anion powstały po odczepieniu wodoru od kwasu.", long: "Reszta kwasowa nie ma własnego wodoru, ale ma ładunek. Przykłady: Cl⁻ (chlorek), NO₃⁻ (azotan(V)), SO₄²⁻ (siarczan(VI)), PO₄³⁻ (fosforan(V))." },
  { term: "Wiązanie jonowe", tag: "wiązania", short: "Przyciąganie kationów i anionów w sieci krystalicznej.", long: "Powstaje przy dużej różnicy elektroujemności, najczęściej metal + niemetal. Substancje jonowe mają wysoką temperaturę topnienia i przewodzą prąd w roztworze." },
  { term: "Wiązanie kowalencyjne", tag: "wiązania", short: "Wspólna para elektronowa między dwoma atomami.", long: "Tworzą je niemetale. Jedna para to jedno wiązanie, dwie — podwójne, trzy — potrójne. Długość wiązania maleje wraz z krotnością." },
  { term: "Wiązanie metaliczne", tag: "wiązania", short: "Swobodne elektrony w sieci kationów metalu.", long: "To dzięki nim metale przewodzą prąd i ciepło, są kowalne oraz mają połysk." },
  { term: "Elektroujemność", tag: "wiązania", short: "Zdolność atomu do przyciągania elektronów w wiązaniu.", long: "Rośnie w prawo i w górę układu okresowego. Różnica elektroujemności powyżej około 1,7 oznacza wiązanie jonowe." },
  { term: "Masa atomowa", tag: "obliczenia", short: "Średnia masa atomu w jednostkach u.", long: "Masa atomowa to średnia ważona mas izotopów. W obliczeniach szkolnych podajemy ją w unitach (u), a masa cząsteczkowa to suma mas atomów w cząsteczce." },
  { term: "Mol", tag: "obliczenia", short: "Ilość substancji zawierająca 6,02·10²³ drobin.", long: "Liczba Avogadra to 6,02·10²³. Jeden mol gazu w warunkach normalnych zajmuje 22,4 dm³ — to wystarcza do większości obliczeń stechiometrycznych." },
  { term: "Indeks stechiometryczny", tag: "obliczenia", short: "Mała cyfra po symbolu mówiąca, ile atomów wchodzi do wzoru.", long: "W H₂SO₄ indeksy to 2, 1 i 4. Współczynnik przed wzorem (np. 2 H₂O) liczy całe cząsteczki — to inna rola niż indeks." },
  { term: "Dysocjacja jonowa", tag: "roztwory", short: "Rozpad związku na jony pod wpływem wody.", long: "Kwasy oddają H⁺, zasady OH⁻, a sole rozpadają się na kation metalu i anion reszty kwasowej. Stopień dysocjacji decyduje o mocy elektrolitu." },
  { term: "pH", tag: "roztwory", short: "Miara kwasowości roztworu w skali 0–14.", long: "pH poniżej 7 to odczyn kwasowy, 7 — obojętny, powyżej 7 — zasadowy. Skala jest logarytmiczna: spadek o jedną jednostkę to dziesięciokrotny wzrost stężenia jonów H⁺." },
  { term: "Zobojętnianie", tag: "reakcje", short: "Reakcja kwasu z zasadą, dająca sól i wodę.", long: "To szczególny przypadek wymiany podwójnej. Stosuje się je do regulacji pH gleby, leczenia zgagi i neutralizacji ścieków." },
  { term: "Strącanie", tag: "reakcje", short: "Wydzielenie z roztworu trudno rozpuszczalnego osadu.", long: "Osad pojawia się, gdy iloczyn stężeń jonów przekroczy rozpuszczalność. Klasyczny przykład: AgNO₃ + NaCl → AgCl↓ + NaNO₃." },
  { term: "Reakcja egzoenergetyczna", tag: "reakcje", short: "Reakcja wydzielająca energię do otoczenia.", long: "Spalanie, zobojętnianie i utlenianie metali ogrzewają otoczenie. Energia wydziela się, bo produkty mają niższą energię niż substraty." },
  { term: "Tlenek", tag: "grupy", short: "Związek tlenu z innym pierwiastkiem.", long: "Tlenki metali są zasadowe (CaO), tlenki niemetali kwasowe (CO₂, SO₂). Tlenek wodoru to po prostu woda." },
  { term: "Wodorotlenek", tag: "grupy", short: "Związek metalu z grupą –OH.", long: "W wodzie daje odczyn zasadowy. Mocne wodorotlenki (NaOH, KOH) są żrące, słabsze (Mg(OH)₂) stosuje się w zawiesinach leczniczych." },
  { term: "Sól", tag: "grupy", short: "Związek kationu metalu z anionem reszty kwasowej.", long: "Sole otrzymujemy w reakcji zobojętnienia, metal + kwas oraz w reakcjach strącania. Wiele z nich to minerały i surowce przemysłowe." },
  { term: "Model kuleczkowo-prętowy", tag: "modele", short: "Trójwymiarowe przedstawienie cząsteczki: kule i pałeczki.", long: "Kula to atom w skali promieni jonowych, pałeczka — wiązanie. Model nie pokazuje elektronów, ale dobrze oddaje geometrię i krotność wiązań." },
];

export const LAB_RULES = [
  { id: "oktet", title: "Reguła oktetu", rule: "Atom dąży do ośmiu elektronów walencyjnych (wodór — dwóch).", example: "H2O", why: "Tlen ma 6 elektronów walencyjnych, więc potrzebuje dwóch wspólnych par. Wodór ma 1 i potrzebuje jednej.", tip: "Policz kreski wokół atomu w modelu — dla większości pierwiastków powinno ich być tyle, ile brakuje do oktetu." },
  { id: "wartosciowosc", title: "Wartościowość = liczba wiązań", rule: "Wodór tworzy jedno wiązanie, tlen dwa, azot trzy, węgiel cztery.", example: "CO2", why: "Węgiel(IV) łączy się z dwoma tlenami dwuwartościowymi: 1·4 = 2·2.", tip: "Jeśli atom ma za dużo wiązań, sprawdź indeksy — model od razu pokaże nadmiar pałeczek." },
  { id: "krzyzowa", title: "Reguła krzyżowa", rule: "Ładunek jednego jonu staje się liczbą atomów drugiego — potem skracamy.", example: "Fe2O3", why: "Fe³⁺ i O²⁻ dają 2 atomy żelaza i 3 atomy tlenu: 2·3 + 3·(−2) = 0.", tip: "Zawsze sprawdź sumę ładunków. Zero = wzór poprawny." },
  { id: "reszty", title: "Reszty wieloatomowe w nawiasie", rule: "Grupa powtarzająca się więcej niż raz idzie w nawias.", example: "Ca(OH)2", why: "Bez nawiasu indeks 2 dotyczyłby tylko wodoru, a potrzebujemy dwóch całych grup OH.", tip: "Nawias stosuj do reszt: OH, NO3, SO4, PO4, CO3, HCO3." },
  { id: "jony", title: "Kation pierwszy, anion drugi", rule: "W solach i wodorotlenkach najpierw zapisujemy metal, potem resztę.", example: "NaCl", why: "Kationy metali mają dodatni ładunek i stoją na początku wzoru — to umowna kolejność zapisu.", tip: "W tlenkach pierwiastek bardziej elektrododatni też stoi pierwszy: CaO, Fe2O3." },
  { id: "nazwy", title: "Jak czytać nazwę", rule: "Sól to nazwa anionu w mianowniku i kationu w dopełniaczu.", example: "CaCO3", why: "Węglan + wapnia = węglan wapnia. Przy kilku wartościowościach metalu dodajemy rzymską cyfrę: żelaza(III).", tip: "Aniony tlenowe kończą się na -an: azotan, siarczan, węglan, fosforan." },
  { id: "rownowaga", title: "Równanie reakcji musi się bilansować", rule: "Liczba atomów każdego pierwiastka po obu stronach jest taka sama.", example: "2 H2 + O2 = 2 H2O", why: "Atomy nie znikają — zmieniają tylko połączenia. Współczynniki wyrównują liczby atomów.", tip: "Zacznij od najrzadszego pierwiastka, a tlen i wodór zostaw na koniec." },
];

export const APPLICATION_GROUPS = [
  {
    id: "dom",
    label: "Dom i kuchnia",
    blurb: "Substancje z szafki, z czajnika i ze spiżarni.",
    ids: ["nacl", "nahco3", "h2o", "co2", "cao"],
  },
  {
    id: "przemysl",
    label: "Przemysł i produkcja",
    blurb: "Surowce, kwasy techniczne i półprodukty wielkiej syntezy.",
    ids: ["h2so4", "naoh", "koh", "fe2o3", "caco3"],
  },
  {
    id: "rolnictwo",
    label: "Rolnictwo i ogród",
    blurb: "Nawozy, odkwaszanie gleby i ochrona roślin.",
    ids: ["h3po4", "kno3", "cao", "mgoh2", "caso4"],
  },
  {
    id: "zdrowie",
    label: "Zdrowie i farmacja",
    blurb: "Leki, płyny fizjologiczne i środki opatrunkowe.",
    ids: ["nahco3", "mgoh2", "nacl", "caoh2"],
  },
  {
    id: "energia",
    label: "Energia i transport",
    blurb: "Akumulatory, spalanie i oczyszczanie spalin.",
    ids: ["h2so4", "co2", "so2", "h2o"],
  },
  {
    id: "budownictwo",
    label: "Budownictwo i materiały",
    blurb: "Zaprawy, gips, wapno i pigmenty.",
    ids: ["caso4", "caoh2", "caco3", "fe2o3"],
  },
];

export const HELP_SECTIONS = [
  {
    id: "modele",
    title: "Sterowanie modelami 3D",
    intro: "Każdy model cząsteczki jest interaktywny — działa myszką i dotykiem.",
    steps: [
      "Przytrzymaj lewy przycisk myszy (albo palec) na modelu i przesuń, aby obrócić cząsteczkę.",
      "Użyj kółka myszy lub gestu pinch, aby przybliżyć i oddalić widok.",
      "Zwolnij przycisk, aby zatrzymać obrót; model powoli wraca do delikatnej rotacji.",
      "Numery i kolory atomów sprawdzisz w legendzie pod modelem.",
    ],
  },
  {
    id: "plansza",
    title: "Tryb układania na planszy",
    intro: "Zadanie z oceną poprawności: budujesz cząsteczkę z gotowych miejsc.",
    steps: [
      "Wejdź w „Układanie” i wybierz związek — możesz też wejść z karty związku przyciskiem „Ułóż tę cząsteczkę sam”.",
      "Wybierz atom w palecie, potem kliknij miejsce na planszy; przytrzymaj wybór, aby zmienić pierwiastek.",
      "Klikaj wiązania, aby ustawić krotność: pojedyncze lub podwójne.",
      "Naciśnij „Sprawdź”, aby zobaczyć, które atomy i wiązania są błędne, i popraw je.",
    ],
  },
  {
    id: "tryb3d",
    title: "Tryb 3D — własne cząsteczki",
    intro: "Pełna swoboda: sam decydujesz o położeniu atomów w przestrzeni.",
    steps: [
      "Kliknij pierwiastek w palecie — nowa kula pojawi się w scenie.",
      "Przeciągnij kulę, aby przesunąć atom; przeciągnięcie tła obraca kamerę.",
      "Wybierz narzędzie „Połącz” i kliknij dwa atomy, aby dodać wiązanie (także podwójne).",
      "Narzędzie „Usuń” czyści atom lub wiązanie, a „Cofnij” przywraca poprzedni stan.",
      "Wczytaj gotowy model z listy, aby zacząć od istniejącej cząsteczki.",
      "Kliknij „Zapisz układ”, aby własna cząsteczka trafiła do „Moich ulubionych”.",
    ],
  },
  {
    id: "quizy",
    title: "Laboratorium quizów",
    intro: "Dopasuj wzór do modelu 3D albo rozpoznaj związek po opisie.",
    steps: [
      "Kliknij „Rozpocznij quiz” — przygotujemy osiem pytań z całego katalogu.",
      "W pytaniu modelowym wybierz wzór pasujący do obracającej się cząsteczki.",
      "W pytaniu opisowym wskaż nazwę związku na podstawie właściwości i zastosowań.",
      "Po każdej odpowiedzi zobaczysz wyjaśnienie; na końcu zapisujemy wynik w archiwum.",
    ],
  },
  {
    id: "narzedzia",
    title: "Kalkulator i generator",
    intro: "Dwa narzędzia do wartościowości i wzorów.",
    steps: [
      "Kalkulator wartościowości: wybierz związek i odgadnij wartościowość reszty kwasowej, a potem zobacz bilans ładunków.",
      "Generator wzorów: wskaż kation i anion — wzór oraz nazwa powstaną według reguły krzyżowej.",
      "„Losuj” podsuwa trudniejsze zestawienie jonów; wynik możesz zapisać w archiwum.",
    ],
  },
  {
    id: "konto",
    title: "Ulubione, archiwum i ustawienia",
    intro: "Twoje laboratorium zapamiętuje to, co robisz.",
    steps: [
      "Serce na karcie związku dodaje go do „Moich ulubionych”.",
      "Własne cząsteczki z trybu 3D zapisujesz przyciskiem „Zapisz układ”.",
      "Archiwum zbiera ostatnie układy, zjawiska i quizy — możesz je wyczyścić.",
      "W ustawieniach zmienisz motyw, jasność interfejsu i szczegółowość modeli 3D.",
    ],
  },
];

export const HELP_FAQ = [
  { q: "Czy modele działają na telefonie?", a: "Tak. Obrót i zoom działają gestami, a plansza trybu układania jest dotykowa. Tryb 3D najlepiej sprawdza się na większym ekranie." },
  { q: "Czy potrzebuję konta, żeby korzystać z aplikacji?", a: "Nie. Katalog, zjawiska, słownik i quizy są otwarte. Możesz założyć konto, aby korzystać z logowania Google i mieć swoje ustawienia pod ręką." },
  { q: "Gdzie zapisują się moje ulubione?", a: "W pamięci tej przeglądarki — dlatego nie znikają po odświeżeniu strony, ale nie przeniosą się na inne urządzenie." },
  { q: "Dlaczego model czasem ładuje się dłużej?", a: "Każdy model to osobna scena 3D. Pierwsze wczytanie pobiera bibliotekę renderującą, kolejne są natychmiastowe." },
  { q: "Czy mogę poprawić wzór w trybie układania?", a: "Tak — kliknij atom, aby zmienić pierwiastek, albo wiązanie, aby ustawić krotność. Potem ponownie naciśnij „Sprawdź”." },
];