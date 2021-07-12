export interface State {
  isSettingsOpen: boolean;
  settings: Settings;
  history: Sample[];
}

export interface Settings {
  naturalsOnly: boolean;
  allowRepeats: boolean;
  equivalenceRelation: SampleEquivalenceRelation;
  displayEquivalentNotes: boolean;
  sampleDisplayStyle: NoteDisplayStyle;
  maxPitch: Pitch;
}

export enum SampleEquivalenceRelation {
  /**
   * Definition: Two samples are equal iff their "names" (e.g., `ASharp`) are equal.
   *
   * This means:
   * - `ASharp` and `BFlat` are **not** equal
   * - We don't care if the pitches are in the same octave (e.g., E2 equals E4)
   */
  ByNameModuloOctave = 0,

  /**
   * Definition: Two samples are equal iff when we make their octaves the same, their
   * pitches are equal.
   *
   * This means:
   * - `ASharp` and `BFlat` are equal
   * - Octave doesn't matter (e.g., A Sharp 2 equals B Flat 4)
   */
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

  /**
   * Definition: Two samples are equal iff they have the same pitch.
   *
   * This means:
   * - A Sharp 2 equals B Flat 2
   * - A Sharp 2 does **not** equal B Flat 3 (different octaves)
   */
  ByPitch = 3,

  /**
   * Definition: Two samples are equal iff they have the same pitch and name.
   *
   * This means:
   * - A Sharp 2 equals A Sharp 2
   * - A Sharp 2 does **not** B Flat 2 (different names)
   * - A Sharp 2 does **not** equal B Flat 3 (different octaves)
   */
  Reflexive = 4,
}

export function isOctaveSensitive(er: SampleEquivalenceRelation): boolean {
  switch (er) {
    case SampleEquivalenceRelation.ByNameModuloOctave:
      return false;
    case SampleEquivalenceRelation.ByPitchModuloOctave:
      return false;
    case SampleEquivalenceRelation.ByLetter:
      return false;
    case SampleEquivalenceRelation.ByPitch:
      return true;
    case SampleEquivalenceRelation.Reflexive:
      return true;
  }
}

enum NoteEquivalenceRelation {
  Reflexive,
  ByPitch,
  ByLetter,
}

export function sampleEqRelToNoteEqRel(
  er: SampleEquivalenceRelation
): NoteEquivalenceRelation {
  switch (er) {
    case SampleEquivalenceRelation.ByNameModuloOctave:
      return NoteEquivalenceRelation.Reflexive;
    case SampleEquivalenceRelation.ByPitchModuloOctave:
      return NoteEquivalenceRelation.ByPitch;
    case SampleEquivalenceRelation.ByLetter:
      return NoteEquivalenceRelation.ByLetter;
    case SampleEquivalenceRelation.ByPitch:
      return NoteEquivalenceRelation.ByPitch;
    case SampleEquivalenceRelation.Reflexive:
      return NoteEquivalenceRelation.Reflexive;
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
  C2,
  CD2,
  D2,
  DE2,
  E3,
  F3,
  FG3,
  G3,
  GA3,
  A3,
  AB3,
  B3,
  C3,
  CD3,
  D3,
  DE3,
  E4,
  F4,
  FG4,
  G4,
  GA4,
  A4,
  AB4,
  B4,
  C4,
  CD4,
  D4,
  DE4,
  E5,
  F5,
  FG5,
  G5,
  GA5,
  A5,
  AB5,
  B5,
  C5,
  CD5,
  D5,
  DE5,
  E6,
  F6,
  FG6,
  G6,
  GA6,
  A6,
  AB6,
  B6,
  C6,
  CD6,
  D6,
  DE6,
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
  Pitch.C2,
  Pitch.CD2,
  Pitch.D2,
  Pitch.DE2,
  Pitch.E3,
  Pitch.F3,
  Pitch.FG3,
  Pitch.G3,
  Pitch.GA3,
  Pitch.A3,
  Pitch.AB3,
  Pitch.B3,
  Pitch.C3,
  Pitch.CD3,
  Pitch.D3,
  Pitch.DE3,
  Pitch.E4,
  Pitch.F4,
  Pitch.FG4,
  Pitch.G4,
  Pitch.GA4,
  Pitch.A4,
  Pitch.AB4,
  Pitch.B4,
  Pitch.C4,
  Pitch.CD4,
  Pitch.D4,
  Pitch.DE4,
  Pitch.E5,
  Pitch.F5,
  Pitch.FG5,
  Pitch.G5,
  Pitch.GA5,
  Pitch.A5,
  Pitch.AB5,
  Pitch.B5,
  Pitch.C5,
  Pitch.CD5,
  Pitch.D5,
  Pitch.DE5,
  Pitch.E6,
  Pitch.F6,
  Pitch.FG6,
  Pitch.G6,
  Pitch.GA6,
  Pitch.A6,
  Pitch.AB6,
  Pitch.B6,
  Pitch.C6,
  Pitch.CD6,
  Pitch.D6,
  Pitch.DE6,
];

export const DEFAULT_SETTINGS: Settings = {
  naturalsOnly: true,
  allowRepeats: false,
  equivalenceRelation: SampleEquivalenceRelation.ByNameModuloOctave,
  displayEquivalentNotes: true,
  sampleDisplayStyle: NoteDisplayStyle.StaffAndLetters,
  maxPitch: Pitch.E5,
};

/**
 * I call this `Sample` instead of something like `NoteAndPitch`,
 * because it's much more succinct.
 *
 * In case you're wondering why I chose "sample", of all names,
 * it's because a note-pitch pair is a sample in
 * the statistical/probability-theoretic sense.
 * Remember, the primary purpose of this app is to randomly
 * select note-pitch pairs from a pool of possible
 * pairs, so the selected note-pitch pairs would be called samples.
 */
export interface Sample {
  note: Note;
  pitch: Pitch;
}

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

const ALL_NOTES: readonly Note[] = [
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

export const ALL_SAMPLES: readonly Sample[] = cartesianProduct(
  buildSample,
  ALL_NOTES,
  ALL_PITCHES
)
  // We can't simply define the set of all samples as the Cartesian product,
  // since that would include some nonsensical samples (e.g., `{ note: Note.A, pitch: Pitch.C2 }`).
  // Instead, we only include samples that have notes that agree with their pitch.
  .filter((sample) => pitchToNotes(sample.pitch).includes(sample.note));

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

function buildSample(note: Note, pitch: Pitch): Sample {
  return { note, pitch };
}

function pitchToNotes(pitch: Pitch): Note[] {
  switch (pitch) {
    case Pitch.E2:
      return [Note.E];
    case Pitch.F2:
      return [Note.F];
    case Pitch.FG2:
      return [Note.FSharp, Note.GFlat];
    case Pitch.G2:
      return [Note.G];
    case Pitch.GA2:
      return [Note.GSharp, Note.AFlat];
    case Pitch.A2:
      return [Note.A];
    case Pitch.AB2:
      return [Note.ASharp, Note.BFlat];
    case Pitch.B2:
      return [Note.B];
    case Pitch.C2:
      return [Note.C];
    case Pitch.CD2:
      return [Note.CSharp, Note.DFlat];
    case Pitch.D2:
      return [Note.D];
    case Pitch.DE2:
      return [Note.DSharp, Note.EFlat];
    case Pitch.E3:
      return [Note.E];
    case Pitch.F3:
      return [Note.F];
    case Pitch.FG3:
      return [Note.FSharp, Note.GFlat];
    case Pitch.G3:
      return [Note.G];
    case Pitch.GA3:
      return [Note.GSharp, Note.AFlat];
    case Pitch.A3:
      return [Note.A];
    case Pitch.AB3:
      return [Note.ASharp, Note.BFlat];
    case Pitch.B3:
      return [Note.B];
    case Pitch.C3:
      return [Note.C];
    case Pitch.CD3:
      return [Note.CSharp, Note.DFlat];
    case Pitch.D3:
      return [Note.D];
    case Pitch.DE3:
      return [Note.DSharp, Note.EFlat];
    case Pitch.E4:
      return [Note.E];
    case Pitch.F4:
      return [Note.F];
    case Pitch.FG4:
      return [Note.FSharp, Note.GFlat];
    case Pitch.G4:
      return [Note.G];
    case Pitch.GA4:
      return [Note.GSharp, Note.AFlat];
    case Pitch.A4:
      return [Note.A];
    case Pitch.AB4:
      return [Note.ASharp, Note.BFlat];
    case Pitch.B4:
      return [Note.B];
    case Pitch.C4:
      return [Note.C];
    case Pitch.CD4:
      return [Note.CSharp, Note.DFlat];
    case Pitch.D4:
      return [Note.D];
    case Pitch.DE4:
      return [Note.DSharp, Note.EFlat];
    case Pitch.E5:
      return [Note.E];
    case Pitch.F5:
      return [Note.F];
    case Pitch.FG5:
      return [Note.FSharp, Note.GFlat];
    case Pitch.G5:
      return [Note.G];
    case Pitch.GA5:
      return [Note.GSharp, Note.AFlat];
    case Pitch.A5:
      return [Note.A];
    case Pitch.AB5:
      return [Note.ASharp, Note.BFlat];
    case Pitch.B5:
      return [Note.B];
    case Pitch.C5:
      return [Note.C];
    case Pitch.CD5:
      return [Note.CSharp, Note.DFlat];
    case Pitch.D5:
      return [Note.D];
    case Pitch.DE5:
      return [Note.DSharp, Note.EFlat];
    case Pitch.E6:
      return [Note.E];
    case Pitch.F6:
      return [Note.F];
    case Pitch.FG6:
      return [Note.FSharp, Note.GFlat];
    case Pitch.G6:
      return [Note.G];
    case Pitch.GA6:
      return [Note.GSharp, Note.AFlat];
    case Pitch.A6:
      return [Note.A];
    case Pitch.AB6:
      return [Note.ASharp, Note.BFlat];
    case Pitch.B6:
      return [Note.B];
    case Pitch.C6:
      return [Note.C];
    case Pitch.CD6:
      return [Note.CSharp, Note.DFlat];
    case Pitch.D6:
      return [Note.D];
    case Pitch.DE6:
      return [Note.DSharp, Note.EFlat];
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
  equivalenceRelation: NoteEquivalenceRelation,
  displayEquivalentNotes: boolean
): string {
  if (!displayEquivalentNotes) {
    return noteString(note);
  }

  function compareSuchThatOriginalNatSharpFlatIsAscending(
    a: Note,
    b: Note
  ): number {
    if (a === note) {
      return -Infinity;
    } else if (b === note) {
      return Infinity;
    } else {
      const aScore = scoreSuchThatNatLtSharpLtFlat(a);
      const bScore = scoreSuchThatNatLtSharpLtFlat(b);
      return aScore - bScore;
    }
  }

  switch (equivalenceRelation) {
    case NoteEquivalenceRelation.Reflexive:
      return noteString(note);
    case NoteEquivalenceRelation.ByPitch: {
      const alt = alternativeName(note);
      if (alt === note) {
        return noteString(note);
      } else {
        return noteString(note) + "/" + noteString(alt);
      }
    }
    case NoteEquivalenceRelation.ByLetter: {
      const nat = natural(note);
      const sharp = sharpOfNatural(nat);
      const flat = flatOfNatural(nat);
      const notes = [naturalToNote(nat), sharp, flat]
        .filter(isNotUndefined)
        .sort(compareSuchThatOriginalNatSharpFlatIsAscending);

      return notes.map(noteString).join("/");
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

export function naturalToNote(nat: Natural): Note {
  switch (nat) {
    case Natural.A:
      return Note.A;
    case Natural.B:
      return Note.B;
    case Natural.C:
      return Note.C;
    case Natural.D:
      return Note.D;
    case Natural.E:
      return Note.E;
    case Natural.F:
      return Note.F;
    case Natural.G:
      return Note.G;
  }
}

export function scoreSuchThatNatLtSharpLtFlat(note: Note): number {
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

/**
 * Normally we would name such a function "sample" (as in the verb),
 * but for consistency, we'll name it "getSample" so that "sample" will
 * always refer to a noun (for the scope of this project).
 */
export function getSample(
  prev: Sample[],
  settings: Settings
): undefined | Sample {
  const possibleNextNotes = getPool(prev, settings);
  return randomElement(possibleNextNotes);
}

export function getPool(prev: Sample[], settings: Settings): Sample[] {
  let possible = ALL_SAMPLES.slice().filter((sample) =>
    isLowerThanOrEqualTo(sample.pitch, settings.maxPitch)
  );

  if (settings.naturalsOnly) {
    possible = possible.filter(
      (sample) => modification(sample.note) === Modification.None
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
  rel: SampleEquivalenceRelation,
  a: Sample,
  b: Sample
): boolean {
  switch (rel) {
    case SampleEquivalenceRelation.ByNameModuloOctave:
      return a.note === b.note;
    case SampleEquivalenceRelation.ByPitchModuloOctave:
      return a.note === b.note || a.note === alternativeName(b.note);
    case SampleEquivalenceRelation.ByLetter:
      return natural(a.note) === natural(b.note);
    case SampleEquivalenceRelation.ByPitch:
      return a.pitch === b.pitch;
    case SampleEquivalenceRelation.Reflexive:
      return a.note === b.note && a.pitch === b.pitch;
  }
}
