export interface State {
  isSettingsOpen: boolean;
  settings: Settings;
  history: Note[];
}

export interface Settings {
  naturalsOnly: boolean;
  allowRepeats: boolean;
  equivalenceRelation: EquivalenceRelation;
}

export enum EquivalenceRelation {
  /** `ASharp !== BFlat`, `A !== ASharp` */
  ReflexiveOnly = 0,
  /** `ASharp === BFlat`, `A !== ASharp` */
  ByPitch = 1,
  /** `ASharp !== BFlat`, `A === ASharp === AFlat` */
  ByLetter = 2,
}

export const DEFAULT_SETTINGS: Settings = {
  naturalsOnly: true,
  allowRepeats: false,
  equivalenceRelation: EquivalenceRelation.ReflexiveOnly,
};

export enum Note {
  A,
  ASharp,
  BFlat,
  B,
  C,
  CSharp,
  DFlat,
  D,
  DSharp,
  EFlat,
  E,
  F,
  FSharp,
  GFlat,
  G,
  GSharp,
  AFlat,
}

export const ALL_NOTES: readonly Note[] = [
  Note.A,
  Note.ASharp,
  Note.BFlat,
  Note.B,
  Note.C,
  Note.CSharp,
  Note.DFlat,
  Note.D,
  Note.DSharp,
  Note.EFlat,
  Note.E,
  Note.F,
  Note.FSharp,
  Note.GFlat,
  Note.G,
  Note.GSharp,
  Note.AFlat,
];

export enum Natural {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
}

export const ALL_NATURALS: readonly Natural[] = [
  Natural.A,
  Natural.B,
  Natural.C,
  Natural.D,
  Natural.E,
  Natural.F,
  Natural.G,
];

export enum Modification {
  None,
  Sharp,
  Flat,
}

export function natural(note: Note): Natural {
  switch (note) {
    case Note.A:
      return Natural.A;
    case Note.ASharp:
      return Natural.A;
    case Note.AFlat:
      return Natural.A;

    case Note.B:
      return Natural.B;
    case Note.BFlat:
      return Natural.B;

    case Note.C:
      return Natural.C;
    case Note.CSharp:
      return Natural.C;

    case Note.DFlat:
      return Natural.D;
    case Note.D:
      return Natural.D;
    case Note.DSharp:
      return Natural.D;

    case Note.EFlat:
      return Natural.E;
    case Note.E:
      return Natural.E;

    case Note.F:
      return Natural.F;
    case Note.FSharp:
      return Natural.F;

    case Note.GFlat:
      return Natural.G;
    case Note.G:
      return Natural.G;
    case Note.GSharp:
      return Natural.G;
  }
}

export function modification(note: Note): Modification {
  switch (note) {
    case Note.A:
    case Note.B:
    case Note.C:
    case Note.D:
    case Note.E:
    case Note.F:
    case Note.G:
      return Modification.None;

    case Note.ASharp:
    case Note.CSharp:
    case Note.DSharp:
    case Note.FSharp:
    case Note.GSharp:
      return Modification.Sharp;

    case Note.AFlat:
    case Note.BFlat:
    case Note.DFlat:
    case Note.EFlat:
    case Note.GFlat:
      return Modification.Flat;
  }
}

/**
    * Non-natural notes have two names (e.g., C sharp and D flat).
    * If the provided note is not natural, the other name will be returned.
    * If it is natural, the original note will be returned.
  
    * ## Example
    * ```typescript
    * assert(Note.DFlat === alternativeName(Note.CSharp));
    * assert(Note.C === alternativeName(Note.C));
    * ```
    */
export function alternativeName(note: Note): Note {
  switch (note) {
    case Note.AFlat:
      return Note.GSharp;
    case Note.ASharp:
      return Note.BFlat;

    case Note.BFlat:
      return Note.ASharp;

    case Note.CSharp:
      return Note.DFlat;

    case Note.DFlat:
      return Note.CSharp;
    case Note.DSharp:
      return Note.EFlat;

    case Note.EFlat:
      return Note.DSharp;

    case Note.FSharp:
      return Note.GFlat;

    case Note.GFlat:
      return Note.FSharp;
    case Note.GSharp:
      return Note.AFlat;

    case Note.A:
    case Note.B:
    case Note.C:
    case Note.D:
    case Note.E:
    case Note.F:
    case Note.G:
      return note;
  }
}

export function noteStrings(
  note: Note,
  equivalenceRelation: EquivalenceRelation
): string {
  switch (equivalenceRelation) {
    case EquivalenceRelation.ReflexiveOnly:
      return noteString(note);
    case EquivalenceRelation.ByPitch: {
      const alt = alternativeName(note);
      if (alt === note) {
        return noteString(note);
      } else {
        return noteString(note) + "/" + noteString(alt);
      }
    }
    case EquivalenceRelation.ByLetter: {
      const nat = natural(note);
      const sharp = sharpOfNatural(nat);
      const flat = flatOfNatural(nat);
      return (
        naturalString(nat) +
        (sharp === undefined ? "" : "/" + noteString(sharp)) +
        (flat === undefined ? "" : "/" + noteString(flat))
      );
    }
  }
}

export function noteString(note: Note): string {
  return naturalString(natural(note)) + modificationString(modification(note));
}

export function naturalString(nat: Natural): string {
  return Natural[nat];
}

export function modificationString(mod: Modification): string {
  switch (mod) {
    case Modification.None:
      return "";
    case Modification.Sharp:
      return "♯";
    case Modification.Flat:
      return "♭";
  }
}

export function sharpOfNatural(nat: Natural): undefined | Note {
  switch (nat) {
    case Natural.A:
      return Note.ASharp;
    case Natural.B:
      return undefined;
    case Natural.C:
      return Note.CSharp;
    case Natural.D:
      return Note.DSharp;
    case Natural.E:
      return undefined;
    case Natural.F:
      return Note.FSharp;
    case Natural.G:
      return Note.GSharp;
  }
}

export function flatOfNatural(nat: Natural): undefined | Note {
  switch (nat) {
    case Natural.A:
      return Note.AFlat;
    case Natural.B:
      return Note.BFlat;
    case Natural.C:
      return undefined;
    case Natural.D:
      return Note.DFlat;
    case Natural.E:
      return Note.EFlat;
    case Natural.F:
      return undefined;
    case Natural.G:
      return Note.GFlat;
  }
}

export function getRandomNextNote(
  prev: Note[],
  settings: Settings
): undefined | Note {
  const possibleNextNotes = getPossibleNextNotes(prev, settings);
  return randomElement(possibleNextNotes);
}

export function getPossibleNextNotes(prev: Note[], settings: Settings): Note[] {
  let possible = ALL_NOTES.slice();

  if (settings.naturalsOnly) {
    possible = possible.filter(
      (note) => modification(note) === Modification.None
    );
  }

  if (settings.allowRepeats) {
    return possible;
  }

  return possible.filter(
    (possibleNote) =>
      !prev.some((prevNote) =>
        areEqualAccordingTo(
          settings.equivalenceRelation,
          possibleNote,
          prevNote
        )
      )
  );
}

export function randomElement<T>(arr: T[]): undefined | T {
  if (arr.length === 0) {
    return undefined;
  } else {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export function areEqualAccordingTo(
  rel: EquivalenceRelation,
  a: Note,
  b: Note
): boolean {
  switch (rel) {
    case EquivalenceRelation.ReflexiveOnly:
      return a === b;
    case EquivalenceRelation.ByPitch:
      return a === b || a === alternativeName(b);
    case EquivalenceRelation.ByLetter:
      return natural(a) === natural(b);
  }
}
