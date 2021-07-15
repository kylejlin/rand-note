/* eslint jest/no-conditional-expect: "off" */

import {
  ALL_NATURALS,
  alternativeName,
  areNotesEqualAccordingTo,
  flatOfNatural,
  Modification,
  modification,
  natural,
  sharpOfNatural,
  ALL_NOTES,
  getOctave,
  NoteNameEquivalenceRelation,
} from "./businessLogic";

test("alternativeName is involutive", () => {
  for (const sample of ALL_NOTES) {
    expect(alternativeName(alternativeName(sample.name))).toBe(sample.name);
  }
});

test("[by name, octave insensitive] spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areNotesEqualAccordingTo(
          {
            isOctaveSensitive: false,
            nameEqRel: NoteNameEquivalenceRelation.Reflexive,
          },
          a,
          b
        )
      ).toBe(a.name === b.name);
    }
  }
});

test("[by pitch, octave insensitive] spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areNotesEqualAccordingTo(
          {
            isOctaveSensitive: false,
            nameEqRel: NoteNameEquivalenceRelation.ByPitch,
          },
          a,
          b
        )
      ).toBe(a.name === b.name || a.name === alternativeName(b.name));
    }
  }
});

test("[by letter, octave insensitive] spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areNotesEqualAccordingTo(
          {
            isOctaveSensitive: false,
            nameEqRel: NoteNameEquivalenceRelation.ByLetter,
          },
          a,
          b
        )
      ).toBe(natural(a.name) === natural(b.name));
    }
  }
});

test("[by pitch, octave sensitive] spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areNotesEqualAccordingTo(
          {
            isOctaveSensitive: true,
            nameEqRel: NoteNameEquivalenceRelation.ByPitch,
          },
          a,
          b
        )
      ).toBe(a.pitch === b.pitch);
    }
  }
});

test("[by name, octave sensitive] spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areNotesEqualAccordingTo(
          {
            isOctaveSensitive: true,
            nameEqRel: NoteNameEquivalenceRelation.Reflexive,
          },
          a,
          b
        )
      ).toBe(a.name === b.name && getOctave(a.pitch) === getOctave(b.pitch));
    }
  }
});

test("[by letter, octave sensitive] spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areNotesEqualAccordingTo(
          {
            isOctaveSensitive: true,
            nameEqRel: NoteNameEquivalenceRelation.ByLetter,
          },
          a,
          b
        )
      ).toBe(
        natural(a.name) === natural(b.name) &&
          getOctave(a.pitch) === getOctave(b.pitch)
      );
    }
  }
});

test("sharpOfNatural is complete", () => {
  for (const sample of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      const { name: note } = sample;
      if (nat === natural(note) && modification(note) === Modification.Sharp) {
        expect(sharpOfNatural(nat)).toBe(note);
      }
    }
  }
});

test("sharpOfNatural is sound", () => {
  for (const sample of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      const { name: note } = sample;
      if (sharpOfNatural(nat) === note) {
        expect(natural(note)).toBe(nat);
        expect(modification(note)).toBe(Modification.Sharp);
      }
    }
  }
});

test("flatOfNatural is complete", () => {
  for (const sample of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      const { name: note } = sample;
      if (nat === natural(note) && modification(note) === Modification.Flat) {
        expect(flatOfNatural(nat)).toBe(note);
      }
    }
  }
});

test("flatOfNatural is sound", () => {
  for (const sample of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      const { name: note } = sample;
      if (flatOfNatural(nat) === note) {
        expect(natural(note)).toBe(nat);
        expect(modification(note)).toBe(Modification.Flat);
      }
    }
  }
});
