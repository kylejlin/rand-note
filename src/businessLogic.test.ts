/* eslint jest/no-conditional-expect: "off" */

import {
  ALL_NATURALS,
  alternativeName,
  areEqualAccordingTo,
  SampleEquivalenceRelation,
  flatOfNatural,
  Modification,
  modification,
  natural,
  sharpOfNatural,
  ALL_SAMPLES,
} from "./businessLogic";

test("alternativeName is involutive", () => {
  for (const sample of ALL_SAMPLES) {
    expect(alternativeName(alternativeName(sample.note))).toBe(sample.note);
  }
});

test("EquivalenceRelation.ByNameModuloOctave spec", () => {
  for (const a of ALL_SAMPLES) {
    for (const b of ALL_SAMPLES) {
      expect(
        areEqualAccordingTo(SampleEquivalenceRelation.ByNameModuloOctave, a, b)
      ).toBe(a.note === b.note);
    }
  }
});

test("EquivalenceRelation.ByPitchModuloOctave spec", () => {
  for (const a of ALL_SAMPLES) {
    for (const b of ALL_SAMPLES) {
      expect(
        areEqualAccordingTo(SampleEquivalenceRelation.ByPitchModuloOctave, a, b)
      ).toBe(a.note === b.note || a.note === alternativeName(b.note));
    }
  }
});

test("EquivalenceRelation.ByLetter spec", () => {
  for (const a of ALL_SAMPLES) {
    for (const b of ALL_SAMPLES) {
      expect(
        areEqualAccordingTo(SampleEquivalenceRelation.ByLetter, a, b)
      ).toBe(natural(a.note) === natural(b.note));
    }
  }
});

test("EquivalenceRelation.ByPitch spec", () => {
  for (const a of ALL_SAMPLES) {
    for (const b of ALL_SAMPLES) {
      expect(areEqualAccordingTo(SampleEquivalenceRelation.ByPitch, a, b)).toBe(
        a.pitch === b.pitch
      );
    }
  }
});

test("EquivalenceRelation.Reflexive spec", () => {
  for (const a of ALL_SAMPLES) {
    for (const b of ALL_SAMPLES) {
      expect(
        areEqualAccordingTo(SampleEquivalenceRelation.Reflexive, a, b)
      ).toBe(a.note === b.note && a.pitch === b.pitch);
    }
  }
});

test("sharpOfNatural is complete", () => {
  for (const sample of ALL_SAMPLES) {
    for (const nat of ALL_NATURALS) {
      const { note } = sample;
      if (nat === natural(note) && modification(note) === Modification.Sharp) {
        expect(sharpOfNatural(nat)).toBe(note);
      }
    }
  }
});

test("sharpOfNatural is sound", () => {
  for (const sample of ALL_SAMPLES) {
    for (const nat of ALL_NATURALS) {
      const { note } = sample;
      if (sharpOfNatural(nat) === note) {
        expect(natural(note)).toBe(nat);
        expect(modification(note)).toBe(Modification.Sharp);
      }
    }
  }
});

test("flatOfNatural is complete", () => {
  for (const sample of ALL_SAMPLES) {
    for (const nat of ALL_NATURALS) {
      const { note } = sample;
      if (nat === natural(note) && modification(note) === Modification.Flat) {
        expect(flatOfNatural(nat)).toBe(note);
      }
    }
  }
});

test("flatOfNatural is sound", () => {
  for (const sample of ALL_SAMPLES) {
    for (const nat of ALL_NATURALS) {
      const { note } = sample;
      if (flatOfNatural(nat) === note) {
        expect(natural(note)).toBe(nat);
        expect(modification(note)).toBe(Modification.Flat);
      }
    }
  }
});
