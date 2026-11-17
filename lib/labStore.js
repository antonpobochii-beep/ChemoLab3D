import { useSyncExternalStore } from "react";

// Lokalny magazyn laboratorium: motyw, jasność, ulubione, własne układy, archiwum i quizy.
const STORAGE_KEY = "chem-lab-state-v1";
const EVENT = "chem-lab-store-change";

export const DEFAULT_SETTINGS = { theme: "neon", brightness: 100, detail: "medium" };
export const EMPTY_STORE = {
  settings: DEFAULT_SETTINGS,
  favorites: [],
  molecules: [],
  history: [],
  quizzes: [],
  flashcards: [],
  viewed: [],
};

export const THEMES = [
  { id: "neon", label: "Neonowa zieleń", hint: "Domyślny motyw laboratorium", swatch: "hsl(165 100% 45%)" },
  { id: "granat", label: "Głęboki granat", hint: "Chłodny błękit i stal", swatch: "hsl(210 100% 58%)" },
  { id: "fiolet", label: "Fiolet kwantowy", hint: "Fiolet z różowym akcentem", swatch: "hsl(265 92% 66%)" },
];

export const DETAIL_LEVELS = [
  { id: "low", label: "Niska", hint: "Szybsze rysowanie, mniej wielokątów" },
  { id: "medium", label: "Średnia", hint: "Zalecana dla większości komputerów" },
  { id: "high", label: "Wysoka", hint: "Najgładsze kule, więcej światła" },
];

let cache = EMPTY_STORE;
let loaded = false;
let accountUserId = null;
let remoteRecordId = null;
let saveTimer = null;

function readStorage() {
  if (typeof window === "undefined") return EMPTY_STORE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STORE;
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY_STORE,
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
    };
  } catch {
    return EMPTY_STORE;
  }
}

function load() {
  if (typeof window === "undefined") return EMPTY_STORE;
  if (!loaded) {
    cache = readStorage();
    loaded = true;
  }
  return cache;
}

function persist(next) {
  if (typeof window === "undefined") return;
  cache = next;
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* brak miejsca — zostajemy z wersją w pamięci */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
  queueRemoteSave(next);
}

export function getStore() {
  return load();
}

export function updateStore(updater) {
  if (typeof window === "undefined") return;
  persist(updater(load()));
}

export function subscribe(listener) {
  if (typeof window === "undefined") return () => {};
  const onStorage = () => {
    loaded = false;
    load();
    window.dispatchEvent(new CustomEvent(EVENT));
  };
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLabStore() {
  return useSyncExternalStore(subscribe, getStore, () => EMPTY_STORE);
}

export function getSettings() {
  return load().settings;
}

export function saveSettings(patch) {
  updateStore((state) => ({ ...state, settings: { ...state.settings, ...patch } }));
}

export function resetStore() {
  persist({ ...EMPTY_STORE, settings: DEFAULT_SETTINGS });
}

export function isFavorite(id) {
  return load().favorites.includes(id);
}

export function toggleFavorite(id) {
  updateStore((state) => ({
    ...state,
    favorites: state.favorites.includes(id)
      ? state.favorites.filter((item) => item !== id)
      : [id, ...state.favorites],
  }));
}

export function addMolecule({ name, atoms, bonds }) {
  updateStore((state) => ({
    ...state,
    molecules: [
      {
        id: `m${Date.now()}`,
        name: name || "Własny układ",
        atoms,
        bonds,
        date: new Date().toISOString(),
      },
      ...state.molecules,
    ].slice(0, 40),
  }));
}

export function removeMolecule(id) {
  updateStore((state) => ({ ...state, molecules: state.molecules.filter((item) => item.id !== id) }));
}

export function logEvent({ type, label, detail }) {
  updateStore((state) => {
    const previous = state.history[0];
    if (previous && previous.label === label && previous.type === type) return state;
    return {
      ...state,
      history: [
        {
          id: `h${Date.now()}`,
          type,
          label,
          detail: detail || "",
          date: new Date().toISOString(),
        },
        ...state.history,
      ].slice(0, 80),
    };
  });
}

export function addQuizResult({ score, total, topics = [] }) {
  updateStore((state) => ({
    ...state,
    quizzes: [
      { id: `q${Date.now()}`, score, total, topics, date: new Date().toISOString() },
      ...state.quizzes,
    ].slice(0, 30),
    history: [
      {
        id: `h${Date.now()}`,
        type: "quiz",
        label: `Quiz: ${score}/${total} punktów`,
        detail: `${Math.round((score / total) * 100)}% poprawnych odpowiedzi`,
        date: new Date().toISOString(),
      },
      ...state.history,
    ].slice(0, 80),
  }));
}

// Wynik pojedynczej fiszki — zasila statystyki zagadnień.
export function addFlashcardResult({ compoundId, category, correct }) {
  updateStore((state) => ({
    ...state,
    flashcards: [
      {
        id: `f${Date.now()}${Math.round(Math.random() * 1000)}`,
        compoundId,
        category,
        correct: Boolean(correct),
        date: new Date().toISOString(),
      },
      ...(state.flashcards || []),
    ].slice(0, 200),
  }));
}

export function markViewed(id) {
  updateStore((state) =>
    state.viewed.some((entry) => entry.id === id)
      ? state
      : { ...state, viewed: [{ id, date: new Date().toISOString() }, ...state.viewed].slice(0, 200) }
  );
}

export function clearHistory() {
  updateStore((state) => ({ ...state, history: [] }));
}

/* ---------- synchronizacja z kontem użytkownika ---------- */

const cloudPayload = (state) => ({
  favorites: state.favorites,
  molecules: state.molecules,
  history: state.history,
  quizzes: state.quizzes,
  flashcards: state.flashcards,
  viewed: state.viewed,
  settings: state.settings,
});

function mergeById(first, second, limit) {
  const map = new Map();
  [...first, ...second].forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });
  return [...map.values()]
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .slice(0, limit);
}

function mergeStates(local, remote) {
  const settings =
    remote.settings && Object.keys(remote.settings).length
      ? { ...DEFAULT_SETTINGS, ...remote.settings }
      : { ...DEFAULT_SETTINGS, ...local.settings };

  return {
    settings,
    favorites: [...new Set([...(remote.favorites || []), ...(local.favorites || [])])],
    molecules: mergeById(remote.molecules || [], local.molecules || [], 40),
    history: mergeById(remote.history || [], local.history || [], 80),
    quizzes: mergeById(remote.quizzes || [], local.quizzes || [], 30),
    flashcards: mergeById(remote.flashcards || [], local.flashcards || [], 200),
    viewed: mergeById(remote.viewed || [], local.viewed || [], 200),
  };
}

function queueRemoteSave(state) {
  if (typeof window === "undefined" || !accountUserId || !remoteRecordId) return;
  const recordId = remoteRecordId;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    import("@/api/base44Client")
      .then(({ base44 }) => base44.entities.LabProfile.update(recordId, cloudPayload(state)))
      .catch(() => {});
  }, 800);
}

// Wywoływane po zalogowaniu: pobiera profil z konta i scala go z danymi z tej przeglądarki.
export async function connectLabAccount(user) {
  if (typeof window === "undefined") return;

  const userId = user?.id ?? null;
  if (userId === accountUserId) return;

  accountUserId = userId;
  remoteRecordId = null;
  if (!userId) return;

  const { base44 } = await import("@/api/base44Client");
  const page = await base44.entities.LabProfile.filter({}, { sort: "-updated_date", limit: 1 });
  const record = page?.items?.[0];
  const local = load();

  if (!record) {
    const created = await base44.entities.LabProfile.create(cloudPayload(local));
    remoteRecordId = created.id;
    return;
  }

  remoteRecordId = record.id;
  persist(mergeStates(local, record));
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!theme || theme === "neon") root.removeAttribute("data-lab-theme");
  else root.setAttribute("data-lab-theme", theme);
}

export function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}