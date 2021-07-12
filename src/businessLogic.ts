export interface State {
  isSettingsOpen: boolean;
  settings: Settings;
  history: Note[];
}

export interface Settings {
  naturalsOnly: boolean;
  allowRepeats: boolean;
  equivalenceRelation: NoteEquivalenceRelation;
  displayEquivalentNoteNames: boolean;
  sampleDisplayStyle: NoteDisplayStyle;
  maxPitch: Pitch;
}

export enum NoteEquivalenceRelation {
  /** "modulo octave" means the octaves won't affect equality (e.g., E2 = E4) */
  ByNameModuloOctave = 0,
  /** "modulo octave" means the octaves won't affect equality (e.g., E2 = E4) */
  ByPitchModuloOctave = 1,

  /**
   * Definition: Two samples are equal iff they have the same letter.
   *
   * This means:
   * - `ASharp`, `AFlat`, and `A` are all equal
   * - Octave doesn't matter, since we only care about the letter
   *
   * This usually isn't very useful for playing actual music, but
   * it can come in handy for certain drills (e.g., https://www.youtube.com/watch?v=PJddQ6Q0UDo&t=556s)
   */
  ByLetter = 2,

  ByPitch = 3,
  ByNameAndPitch = 4,
}

export function isOctaveSensitive(er: NoteEquivalenceRelation): boolean {
  switch (er) {
    case NoteEquivalenceRelation.ByNameModuloOctave:
      return false;
    case NoteEquivalenceRelation.ByPitchModuloOctave:
      return false;
    case NoteEquivalenceRelation.ByLetter:
      return false;
    case NoteEquivalenceRelation.ByPitch:
      return true;
    case NoteEquivalenceRelation.ByNameAndPitch:
      return true;
  }
}

enum NoteNameEquivalenceRelation {
  Reflexive,
  ByPitch,
  ByLetter,
}

export function noteEqRelToNoteNameEqRel(
  er: NoteEquivalenceRelation
): NoteNameEquivalenceRelation {
  switch (er) {
    case NoteEquivalenceRelation.ByNameModuloOctave:
      return NoteNameEquivalenceRelation.Reflexive;
    case NoteEquivalenceRelation.ByPitchModuloOctave:
      return NoteNameEquivalenceRelation.ByPitch;
    case NoteEquivalenceRelation.ByLetter:
      return NoteNameEquivalenceRelation.ByLetter;
    case NoteEquivalenceRelation.ByPitch:
      return NoteNameEquivalenceRelation.ByPitch;
    case NoteEquivalenceRelation.ByNameAndPitch:
      return NoteNameEquivalenceRelation.Reflexive;
  }
}

export enum NoteDisplayStyle {
  Letters,
  Staff,
  StaffAndLetters,
}

export function doesDisplayPitch(style: NoteDisplayStyle): boolean {
  switch (style) {
    case NoteDisplayStyle.Letters:
      return false;
    case NoteDisplayStyle.Staff:
      return true;
    case NoteDisplayStyle.StaffAndLetters:
      return true;
  }
}

/**
 * Flats and sharps are named based on the natural
 * notes that they're between.
 * For example, both A Sharp 2 and B Flat 2 are
 * represented by `AB2`.
 *
 * The numeric values assigned to this enum's variants
 * are guaranteed to be assigned such that lower pitches
 * have smaller numbers than higher pitches.
 */
export enum Pitch {
  E2,
  F2,
  FG2,
  G2,
  GA2,
  A2,
  AB2,
  B2,
  C3,
  CD3,
  D3,
  DE3,
  E3,
  F3,
  FG3,
  G3,
  GA3,
  A3,
  AB3,
  B3,
  C4,
  CD4,
  D4,
  DE4,
  E4,
  F4,
  FG4,
  G4,
  GA4,
  A4,
  AB4,
  B4,
  C5,
  CD5,
  D5,
  DE5,
  E5,
  F5,
  FG5,
  G5,
  GA5,
  A5,
  AB5,
  B5,
  C6,
  CD6,
  D6,
  DE6,
  E6,
}

const ALL_PITCHES: readonly Pitch[] = [
  Pitch.E2,
  Pitch.F2,
  Pitch.FG2,
  Pitch.G2,
  Pitch.GA2,
  Pitch.A2,
  Pitch.AB2,
  Pitch.B2,
  Pitch.C3,
  Pitch.CD3,
  Pitch.D3,
  Pitch.DE3,
  Pitch.E3,
  Pitch.F3,
  Pitch.FG3,
  Pitch.G3,
  Pitch.GA3,
  Pitch.A3,
  Pitch.AB3,
  Pitch.B3,
  Pitch.C4,
  Pitch.CD4,
  Pitch.D4,
  Pitch.DE4,
  Pitch.E4,
  Pitch.F4,
  Pitch.FG4,
  Pitch.G4,
  Pitch.GA4,
  Pitch.A4,
  Pitch.AB4,
  Pitch.B4,
  Pitch.C5,
  Pitch.CD5,
  Pitch.D5,
  Pitch.DE5,
  Pitch.E5,
  Pitch.F5,
  Pitch.FG5,
  Pitch.G5,
  Pitch.GA5,
  Pitch.A5,
  Pitch.AB5,
  Pitch.B5,
  Pitch.C6,
  Pitch.CD6,
  Pitch.D6,
  Pitch.DE6,
  Pitch.E6,
];

export const DEFAULT_SETTINGS: Settings = {
  naturalsOnly: true,
  allowRepeats: false,
  equivalenceRelation: NoteEquivalenceRelation.ByNameModuloOctave,
  displayEquivalentNoteNames: true,
  sampleDisplayStyle: NoteDisplayStyle.StaffAndLetters,
  maxPitch: Pitch.E5,
};

export interface Note {
  name: NoteName;
  pitch: Pitch;
}

export enum NoteName {
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

const ALL_NOTE_NAMES: readonly NoteName[] = [
  NoteName.A,
  NoteName.ASharp,
  NoteName.BFlat,
  NoteName.B,
  NoteName.C,
  NoteName.CSharp,
  NoteName.DFlat,
  NoteName.D,
  NoteName.DSharp,
  NoteName.EFlat,
  NoteName.E,
  NoteName.F,
  NoteName.FSharp,
  NoteName.GFlat,
  NoteName.G,
  NoteName.GSharp,
  NoteName.AFlat,
];

export const ALL_NOTES: readonly Note[] = cartesianProduct(
  buildSample,
  ALL_NOTE_NAMES,
  ALL_PITCHES
)
  // We can't simply define the set of all notes as the Cartesian product,
  // since that would include some nonsensical samples (e.g., `{ note: NoteName.A, pitch: Pitch.C2 }`).
  // Instead, we only include samples that have names that agree with their pitch.
  .filter((sample) => pitchToNoteNames(sample.pitch).includes(sample.name));

function cartesianProduct<T, U, R>(
  f: (x: T, y: U) => R,
  xs: readonly T[],
  ys: readonly U[]
): R[] {
  const out = new Array(xs.length * ys.length);
  let k = 0;

  for (let i = 0; i < xs.length; ++i) {
    for (let j = 0; j < ys.length; ++j) {
      out[k] = f(xs[i], ys[j]);
      ++k;
    }
  }

  return out;
}

function buildSample(note: NoteName, pitch: Pitch): Note {
  return { name: note, pitch };
}

function pitchToNoteNames(pitch: Pitch): NoteName[] {
  switch (pitch) {
    case Pitch.E2:
      return [NoteName.E];
    case Pitch.F2:
      return [NoteName.F];
    case Pitch.FG2:
      return [NoteName.FSharp, NoteName.GFlat];
    case Pitch.G2:
      return [NoteName.G];
    case Pitch.GA2:
      return [NoteName.GSharp, NoteName.AFlat];
    case Pitch.A2:
      return [NoteName.A];
    case Pitch.AB2:
      return [NoteName.ASharp, NoteName.BFlat];
    case Pitch.B2:
      return [NoteName.B];
    case Pitch.C3:
      return [NoteName.C];
    case Pitch.CD3:
      return [NoteName.CSharp, NoteName.DFlat];
    case Pitch.D3:
      return [NoteName.D];
    case Pitch.DE3:
      return [NoteName.DSharp, NoteName.EFlat];
    case Pitch.E3:
      return [NoteName.E];
    case Pitch.F3:
      return [NoteName.F];
    case Pitch.FG3:
      return [NoteName.FSharp, NoteName.GFlat];
    case Pitch.G3:
      return [NoteName.G];
    case Pitch.GA3:
      return [NoteName.GSharp, NoteName.AFlat];
    case Pitch.A3:
      return [NoteName.A];
    case Pitch.AB3:
      return [NoteName.ASharp, NoteName.BFlat];
    case Pitch.B3:
      return [NoteName.B];
    case Pitch.C4:
      return [NoteName.C];
    case Pitch.CD4:
      return [NoteName.CSharp, NoteName.DFlat];
    case Pitch.D4:
      return [NoteName.D];
    case Pitch.DE4:
      return [NoteName.DSharp, NoteName.EFlat];
    case Pitch.E4:
      return [NoteName.E];
    case Pitch.F4:
      return [NoteName.F];
    case Pitch.FG4:
      return [NoteName.FSharp, NoteName.GFlat];
    case Pitch.G4:
      return [NoteName.G];
    case Pitch.GA4:
      return [NoteName.GSharp, NoteName.AFlat];
    case Pitch.A4:
      return [NoteName.A];
    case Pitch.AB4:
      return [NoteName.ASharp, NoteName.BFlat];
    case Pitch.B4:
      return [NoteName.B];
    case Pitch.C5:
      return [NoteName.C];
    case Pitch.CD5:
      return [NoteName.CSharp, NoteName.DFlat];
    case Pitch.D5:
      return [NoteName.D];
    case Pitch.DE5:
      return [NoteName.DSharp, NoteName.EFlat];
    case Pitch.E5:
      return [NoteName.E];
    case Pitch.F5:
      return [NoteName.F];
    case Pitch.FG5:
      return [NoteName.FSharp, NoteName.GFlat];
    case Pitch.G5:
      return [NoteName.G];
    case Pitch.GA5:
      return [NoteName.GSharp, NoteName.AFlat];
    case Pitch.A5:
      return [NoteName.A];
    case Pitch.AB5:
      return [NoteName.ASharp, NoteName.BFlat];
    case Pitch.B5:
      return [NoteName.B];
    case Pitch.C6:
      return [NoteName.C];
    case Pitch.CD6:
      return [NoteName.CSharp, NoteName.DFlat];
    case Pitch.D6:
      return [NoteName.D];
    case Pitch.DE6:
      return [NoteName.DSharp, NoteName.EFlat];
    case Pitch.E6:
      return [NoteName.E];
  }
}

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

export function natural(name: NoteName): Natural {
  switch (name) {
    case NoteName.A:
      return Natural.A;
    case NoteName.ASharp:
      return Natural.A;
    case NoteName.AFlat:
      return Natural.A;

    case NoteName.B:
      return Natural.B;
    case NoteName.BFlat:
      return Natural.B;

    case NoteName.C:
      return Natural.C;
    case NoteName.CSharp:
      return Natural.C;

    case NoteName.DFlat:
      return Natural.D;
    case NoteName.D:
      return Natural.D;
    case NoteName.DSharp:
      return Natural.D;

    case NoteName.EFlat:
      return Natural.E;
    case NoteName.E:
      return Natural.E;

    case NoteName.F:
      return Natural.F;
    case NoteName.FSharp:
      return Natural.F;

    case NoteName.GFlat:
      return Natural.G;
    case NoteName.G:
      return Natural.G;
    case NoteName.GSharp:
      return Natural.G;
  }
}

export function modification(name: NoteName): Modification {
  switch (name) {
    case NoteName.A:
    case NoteName.B:
    case NoteName.C:
    case NoteName.D:
    case NoteName.E:
    case NoteName.F:
    case NoteName.G:
      return Modification.None;

    case NoteName.ASharp:
    case NoteName.CSharp:
    case NoteName.DSharp:
    case NoteName.FSharp:
    case NoteName.GSharp:
      return Modification.Sharp;

    case NoteName.AFlat:
    case NoteName.BFlat:
    case NoteName.DFlat:
    case NoteName.EFlat:
    case NoteName.GFlat:
      return Modification.Flat;
  }
}

/**
  * Non-natural notes have two names (e.g., C sharp and D flat).
  * If the provided note is not natural, the other name will be returned.
  * If it is natural, the original note will be returned.

  * ## Example
  * ```typescript
  * assert(NoteName.DFlat === alternativeName(NoteName.CSharp));
  * assert(NoteName.C === alternativeName(NoteName.C));
  * ```
  */
export function alternativeName(name: NoteName): NoteName {
  switch (name) {
    case NoteName.AFlat:
      return NoteName.GSharp;
    case NoteName.ASharp:
      return NoteName.BFlat;

    case NoteName.BFlat:
      return NoteName.ASharp;

    case NoteName.CSharp:
      return NoteName.DFlat;

    case NoteName.DFlat:
      return NoteName.CSharp;
    case NoteName.DSharp:
      return NoteName.EFlat;

    case NoteName.EFlat:
      return NoteName.DSharp;

    case NoteName.FSharp:
      return NoteName.GFlat;

    case NoteName.GFlat:
      return NoteName.FSharp;
    case NoteName.GSharp:
      return NoteName.AFlat;

    case NoteName.A:
    case NoteName.B:
    case NoteName.C:
    case NoteName.D:
    case NoteName.E:
    case NoteName.F:
    case NoteName.G:
      return name;
  }
}

export function nameStrings(
  name: NoteName,
  equivalenceRelation: NoteNameEquivalenceRelation,
  displayEquivalentNotes: boolean
): string {
  if (!displayEquivalentNotes) {
    return nameString(name);
  }

  /**
   * To clarify:
   * The name is "Compare such that [original, nat, sharp, flat]
   * is ascending".
   */
  function compareSuchThatOriginalNatSharpFlatIsAscending(
    a: NoteName,
    b: NoteName
  ): number {
    if (a === name) {
      return -Infinity;
    } else if (b === name) {
      return Infinity;
    } else {
      const aScore = scoreSuchThatNatLtSharpLtFlat(a);
      const bScore = scoreSuchThatNatLtSharpLtFlat(b);
      return aScore - bScore;
    }
  }

  switch (equivalenceRelation) {
    case NoteNameEquivalenceRelation.Reflexive:
      return nameString(name);
    case NoteNameEquivalenceRelation.ByPitch: {
      const alt = alternativeName(name);
      if (alt === name) {
        return nameString(name);
      } else {
        return nameString(name) + "/" + nameString(alt);
      }
    }
    case NoteNameEquivalenceRelation.ByLetter: {
      const nat = natural(name);
      const sharp = sharpOfNatural(nat);
      const flat = flatOfNatural(nat);
      const notes = [naturalToNote(nat), sharp, flat]
        .filter(isNotUndefined)
        .sort(compareSuchThatOriginalNatSharpFlatIsAscending);

      return notes.map(nameString).join("/");
    }
  }
}

export function nameString(note: NoteName): string {
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

export function sharpOfNatural(nat: Natural): undefined | NoteName {
  switch (nat) {
    case Natural.A:
      return NoteName.ASharp;
    case Natural.B:
      return undefined;
    case Natural.C:
      return NoteName.CSharp;
    case Natural.D:
      return NoteName.DSharp;
    case Natural.E:
      return undefined;
    case Natural.F:
      return NoteName.FSharp;
    case Natural.G:
      return NoteName.GSharp;
  }
}

export function flatOfNatural(nat: Natural): undefined | NoteName {
  switch (nat) {
    case Natural.A:
      return NoteName.AFlat;
    case Natural.B:
      return NoteName.BFlat;
    case Natural.C:
      return undefined;
    case Natural.D:
      return NoteName.DFlat;
    case Natural.E:
      return NoteName.EFlat;
    case Natural.F:
      return undefined;
    case Natural.G:
      return NoteName.GFlat;
  }
}

export function naturalToNote(nat: Natural): NoteName {
  switch (nat) {
    case Natural.A:
      return NoteName.A;
    case Natural.B:
      return NoteName.B;
    case Natural.C:
      return NoteName.C;
    case Natural.D:
      return NoteName.D;
    case Natural.E:
      return NoteName.E;
    case Natural.F:
      return NoteName.F;
    case Natural.G:
      return NoteName.G;
  }
}

export function scoreSuchThatNatLtSharpLtFlat(note: NoteName): number {
  switch (modification(note)) {
    case Modification.None:
      return 0;
    case Modification.Sharp:
      return 1;
    case Modification.Flat:
      return 2;
  }
}

export function isNotUndefined<T>(v: T | undefined): v is T {
  if (v === undefined) {
    return false;
  } else {
    return true;
  }
}

export function getRandomNote(
  prev: Note[],
  settings: Settings
): undefined | Note {
  const possibleNextNotes = getPossibleRandomNextNotes(prev, settings);
  return randomElement(possibleNextNotes);
}

export function getPossibleRandomNextNotes(
  prev: Note[],
  settings: Settings
): Note[] {
  let possible = ALL_NOTES.slice().filter((sample) =>
    isLowerThanOrEqualTo(sample.pitch, settings.maxPitch)
  );

  if (settings.naturalsOnly) {
    possible = possible.filter(
      (sample) => modification(sample.name) === Modification.None
    );
  }

  if (settings.allowRepeats) {
    return possible;
  }

  return possible.filter(
    (possibleSample) =>
      !prev.some((prevSample) =>
        areEqualAccordingTo(
          settings.equivalenceRelation,
          possibleSample,
          prevSample
        )
      )
  );
}

function isLowerThanOrEqualTo(x: Pitch, y: Pitch): boolean {
  return x <= y;
}

export function randomElement<T>(arr: T[]): undefined | T {
  if (arr.length === 0) {
    return undefined;
  } else {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export function areEqualAccordingTo(
  rel: NoteEquivalenceRelation,
  a: Note,
  b: Note
): boolean {
  switch (rel) {
    case NoteEquivalenceRelation.ByNameModuloOctave:
      return a.name === b.name;
    case NoteEquivalenceRelation.ByPitchModuloOctave:
      return a.name === b.name || a.name === alternativeName(b.name);
    case NoteEquivalenceRelation.ByLetter:
      return natural(a.name) === natural(b.name);
    case NoteEquivalenceRelation.ByPitch:
      return a.pitch === b.pitch;
    case NoteEquivalenceRelation.ByNameAndPitch:
      return a.name === b.name && a.pitch === b.pitch;
  }
}

export function getNotationWithLetters(samples: Note[]): string {
  return `
X: 1
M: 4/4
L: 1/4
%%staves {V1}
V: V1 clef=treble
[V: V1] ${insertXEveryN(
    () => "|",
    4,
    samples.map((sample) => noteAbcNotation(sample))
  ).join(" ")} |]
w:1.~${samples.map((sample) => nameString(sample.name)).join(" ")}
`;
}

function insertXEveryN<T>(f: () => T, n: number, src: readonly T[]): T[] {
  const out = [];
  for (let i = 0; i < src.length; ++i) {
    if (i !== 0 && i % n === 0) {
      out.push(f());
    }
    out.push(src[i]);
  }
  return out;
}

function noteAbcNotation(note: Note): string {
  return noteNameAbcNotation(note.name) + pitchAbcNotation(note.pitch);
}

function noteNameAbcNotation(name: NoteName): string {
  switch (name) {
    case NoteName.A:
      return "A";
    case NoteName.ASharp:
      return "^A";
    case NoteName.BFlat:
      return "_B";
    case NoteName.B:
      return "B";
    case NoteName.C:
      return "C";
    case NoteName.CSharp:
      return "^C";
    case NoteName.DFlat:
      return "_D";
    case NoteName.D:
      return "D";
    case NoteName.DSharp:
      return "^D";
    case NoteName.EFlat:
      return "_E";
    case NoteName.E:
      return "E";
    case NoteName.F:
      return "F";
    case NoteName.FSharp:
      return "^F";
    case NoteName.GFlat:
      return "_G";
    case NoteName.G:
      return "G";
    case NoteName.GSharp:
      return "^G";
    case NoteName.AFlat:
      return "_A";
  }
}

function pitchAbcNotation(pitch: Pitch): string {
  switch (getOctave(pitch)) {
    case 2:
      return ",";
    case 3:
      return "";
    case 4:
      return "'";
    case 5:
      return "''";
    case 6:
      return "'''";
  }
}

function getOctave(pitch: Pitch): 2 | 3 | 4 | 5 | 6 {
  switch (pitch) {
    case Pitch.E2:
      return 2;
    case Pitch.F2:
      return 2;
    case Pitch.FG2:
      return 2;
    case Pitch.G2:
      return 2;
    case Pitch.GA2:
      return 2;
    case Pitch.A2:
      return 2;
    case Pitch.AB2:
      return 2;
    case Pitch.B2:
      return 2;
    case Pitch.C3:
      return 3;
    case Pitch.CD3:
      return 3;
    case Pitch.D3:
      return 3;
    case Pitch.DE3:
      return 3;
    case Pitch.E3:
      return 3;
    case Pitch.F3:
      return 3;
    case Pitch.FG3:
      return 3;
    case Pitch.G3:
      return 3;
    case Pitch.GA3:
      return 3;
    case Pitch.A3:
      return 3;
    case Pitch.AB3:
      return 3;
    case Pitch.B3:
      return 3;
    case Pitch.C4:
      return 4;
    case Pitch.CD4:
      return 4;
    case Pitch.D4:
      return 4;
    case Pitch.DE4:
      return 4;
    case Pitch.E4:
      return 4;
    case Pitch.F4:
      return 4;
    case Pitch.FG4:
      return 4;
    case Pitch.G4:
      return 4;
    case Pitch.GA4:
      return 4;
    case Pitch.A4:
      return 4;
    case Pitch.AB4:
      return 4;
    case Pitch.B4:
      return 4;
    case Pitch.C5:
      return 5;
    case Pitch.CD5:
      return 5;
    case Pitch.D5:
      return 5;
    case Pitch.DE5:
      return 5;
    case Pitch.E5:
      return 5;
    case Pitch.F5:
      return 5;
    case Pitch.FG5:
      return 5;
    case Pitch.G5:
      return 5;
    case Pitch.GA5:
      return 5;
    case Pitch.A5:
      return 5;
    case Pitch.AB5:
      return 5;
    case Pitch.B5:
      return 5;
    case Pitch.C6:
      return 6;
    case Pitch.CD6:
      return 6;
    case Pitch.D6:
      return 6;
    case Pitch.DE6:
      return 6;
    case Pitch.E6:
      return 6;
  }
}

export function getNotationWithoutLetters(notes: Note[]): string {
  return `
X: 1
M: 4/4
L: 1/4
%%staves {V1}
V: V1 clef=treble
[V: V1] (d3 _B =B_A =A2 | _A2 _B=B G2) (cB | d8)        |]
`;
}
