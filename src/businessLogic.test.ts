/* eslint jest/no-conditional-expect: "off" */

import {
  ALL_NATURALS,
  alternativeName,
  areEqualAccordingTo,
  NoteEquivalenceRelation,
  flatOfNatural,
  Modification,
  modification,
  natural,
  sharpOfNatural,
  ALL_NOTES,
  getOctave,
} from "./businessLogic";

test("alternativeName is involutive", () => {
  for (const sample of ALL_NOTES) {
    expect(alternativeName(alternativeName(sample.name))).toBe(sample.name);
  }
});

test("EquivalenceRelation.ByNameModuloOctave spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areEqualAccordingTo(NoteEquivalenceRelation.ByNameModuloOctave, a, b)
      ).toBe(a.name === b.name);
    }
  }
});

test("EquivalenceRelation.ByPitchModuloOctave spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areEqualAccordingTo(NoteEquivalenceRelation.ByPitchModuloOctave, a, b)
      ).toBe(a.name === b.name || a.name === alternativeName(b.name));
    }
  }
});

test("EquivalenceRelation.ByLetter spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(areEqualAccordingTo(NoteEquivalenceRelation.ByLetter, a, b)).toBe(
        natural(a.name) === natural(b.name)
      );
    }
  }
});

test("EquivalenceRelation.ByPitch spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(areEqualAccordingTo(NoteEquivalenceRelation.ByPitch, a, b)).toBe(
        a.pitch === b.pitch
      );
    }
  }
});

test("EquivalenceRelation.ByNameAndOctave spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areEqualAccordingTo(NoteEquivalenceRelation.ByNameAndOctave, a, b)
      ).toBe(a.name === b.name && getOctave(a.pitch) === getOctave(b.pitch));
    }
  }
});

test("EquivalenceRelation.ByLetterAndOctave spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(
        areEqualAccordingTo(NoteEquivalenceRelation.ByLetterAndOctave, a, b)
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
