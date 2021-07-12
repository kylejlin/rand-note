import { DEFAULT_SETTINGS, Sample, Settings } from "./businessLogic";
import {
  deserializeNoteHistory,
  deserializeSettings,
  serializeNoteHistory,
  serializeSettings,
} from "./serde";

enum LocalStorageKey {
  Settings = "RandNote.Settings",
  NoteHistory = "RandNote.NoteHistory",
}

export function loadSettings(): Settings {
  const s = localStorage.getItem(LocalStorageKey.Settings);
  if (s === null) {
    return DEFAULT_SETTINGS;
  }

  const possiblyUndefinedSettings = deserializeSettings(s);
  if (possiblyUndefinedSettings !== undefined) {
    return possiblyUndefinedSettings;
  } else {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(LocalStorageKey.Settings, serializeSettings(settings));
}

export function loadNoteHistory(): Sample[] {
  const s = localStorage.getItem(LocalStorageKey.NoteHistory);
  if (s === null) {
    return [];
  }

  const possiblyUndefinedNoteHistory = deserializeNoteHistory(s);
  if (possiblyUndefinedNoteHistory !== undefined) {
    return possiblyUndefinedNoteHistory;
  } else {
    return [];
  }
}

export function saveNoteHistory(history: Sample[]) {
  localStorage.setItem(
    LocalStorageKey.NoteHistory,
    serializeNoteHistory(history)
  );
}
