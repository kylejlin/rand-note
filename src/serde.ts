import {
  NoteEquivalenceRelation,
  NoteName,
  Note,
  Pitch,
  Settings,
  NoteDisplayStyle,
  NoteNameEquivalenceRelation,
} from "./businessLogic";

export function deserializeSettings(s: string): undefined | Settings {
  try {
    const parsed = JSON.parse(s);
    if (isValidSettings(parsed)) {
      return parsed;
    }
  } catch {}

  return undefined;
}

function isValidSettings(x: unknown): x is Settings {
  return (
    "object" === typeof x &&
    x !== null &&
    "boolean" === typeof (x as Settings).naturalsOnly &&
    "boolean" === typeof (x as Settings).allowRepeats &&
    isValidEquivalenceRelation((x as Settings).equivalenceRelation) &&
    "boolean" === typeof (x as Settings).displayEquivalentNoteNames &&
    "boolean" === typeof (x as Settings).displayOctave &&
    "number" === typeof (x as Settings).sampleDisplayStyle &&
    (x as Settings).sampleDisplayStyle in NoteDisplayStyle &&
    "number" === typeof (x as Settings).minPitch &&
    (x as Settings).minPitch in Pitch &&
    "number" === typeof (x as Settings).maxPitch &&
    (x as Settings).maxPitch in Pitch
  );
}

function isValidEquivalenceRelation(x: unknown): x is NoteEquivalenceRelation {
  return (
    "object" === typeof x &&
    x !== null &&
    "boolean" === typeof (x as NoteEquivalenceRelation).isOctaveSensitive &&
    "number" === typeof (x as NoteEquivalenceRelation).nameEqRel &&
    (x as NoteEquivalenceRelation).nameEqRel in NoteNameEquivalenceRelation
  );
}

export function serializeSettings(settings: Settings): string {
  return JSON.stringify(settings);
}

export function deserializeNoteHistory(s: string): undefined | Note[] {
  try {
    const parsed = JSON.parse(s);
    if (isValidSampleList(parsed)) {
      return parsed;
    }
  } catch {}

  return undefined;
}

function isValidSampleList(x: unknown): x is Note[] {
  return Array.isArray(x) && x.every(isSample);
}

function isSample(x: unknown): x is Note {
  return (
    "object" === typeof x &&
    x !== null &&
    isNote((x as Note).name) &&
    isPitch((x as Note).pitch)
  );
}

function isNote(x: unknown): x is NoteName {
  return "string" === typeof NoteName[x as NoteName];
}

function isPitch(x: unknown): x is Pitch {
  return "string" === typeof Pitch[x as Pitch];
}

export function serializeNoteHistory(notes: Note[]): string {
  return JSON.stringify(notes);
}
