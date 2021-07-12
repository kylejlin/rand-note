import {
  SampleEquivalenceRelation,
  Note,
  Sample,
  Pitch,
  Settings,
  NoteDisplayStyle as SampleDisplayStyle,
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
    "number" === typeof (x as Settings).equivalenceRelation &&
    (x as Settings).equivalenceRelation in SampleEquivalenceRelation &&
    "boolean" === typeof (x as Settings).displayEquivalentNotes &&
    "number" === typeof (x as Settings).sampleDisplayStyle &&
    (x as Settings).sampleDisplayStyle in SampleDisplayStyle &&
    "number" === typeof (x as Settings).maxPitch &&
    (x as Settings).maxPitch in Pitch
  );
}

export function serializeSettings(settings: Settings): string {
  return JSON.stringify(settings);
}

export function deserializeNoteHistory(s: string): undefined | Sample[] {
  try {
    const parsed = JSON.parse(s);
    if (isValidSampleList(parsed)) {
      return parsed;
    }
  } catch {}

  return undefined;
}

function isValidSampleList(x: unknown): x is Sample[] {
  return Array.isArray(x) && x.every(isSample);
}

function isSample(x: unknown): x is Sample {
  return (
    "object" === typeof x &&
    x !== null &&
    isNote((x as Sample).note) &&
    isPitch((x as Sample).pitch)
  );
}

function isNote(x: unknown): x is Note {
  return "string" === typeof Note[x as Note];
}

function isPitch(x: unknown): x is Pitch {
  return "string" === typeof Pitch[x as Pitch];
}

export function serializeNoteHistory(notes: Sample[]): string {
  return JSON.stringify(notes);
}
