import { DEFAULT_SETTINGS, Note, Settings } from "./businessLogic";

enum LocalStorageKey {
  Settings = "RandNote.Settings",
  NoteHistory = "RandNote.NoteHistory",
}

export function loadSettings(): Settings {
  const s = localStorage.getItem(LocalStorageKey.Settings);
  if (s === null) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(s);
    if (isValidSettings(parsed)) {
      return parsed;
    }
  } catch {}

  return DEFAULT_SETTINGS;
}

function isValidSettings(x: unknown): x is Settings {
  return (
    "object" === typeof x &&
    x !== null &&
    "boolean" === typeof (x as any).naturalsOnly &&
    "boolean" === typeof (x as any).allowRepeats &&
    "boolean" === typeof (x as any).distinctSharpsAndFlats
  );
}

export function saveSettings(settings: Settings) {
  const s = JSON.stringify(settings);
  localStorage.setItem(LocalStorageKey.Settings, s);
}

export function loadNoteHistory(): Note[] {
  const s = localStorage.getItem(LocalStorageKey.NoteHistory);
  if (s === null) {
    return [];
  }

  try {
    const parsed = JSON.parse(s);
    if (isValidNoteList(parsed)) {
      return parsed;
    }
  } catch {}

  return [];
}

function isValidNoteList(x: unknown): x is Note[] {
  return Array.isArray(x) && x.every(isNote);
}

function isNote(x: unknown): x is Note {
  return "number" === typeof Note[x as any];
}

export function saveNoteHistory(history: Note[]) {
  const s = JSON.stringify(history);
  localStorage.setItem(LocalStorageKey.NoteHistory, s);
}
