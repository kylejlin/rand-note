/* eslint jest/no-conditional-expect: "off" */

import {
  ALL_NATURALS,
  ALL_NOTES,
  alternativeName,
  areEqualAccordingTo,
  EquivalenceRelation,
  flatOfNatural,
  Modification,
  modification,
  natural,
  sharpOfNatural,
} from "./businessLogic";

test("alternativeName is involutive", () => {
  for (const note of ALL_NOTES) {
    expect(alternativeName(alternativeName(note))).toBe(note);
  }
});

test("EquivalenceRelation.ReflexiveOnly spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(areEqualAccordingTo(EquivalenceRelation.ReflexiveOnly, a, b)).toBe(
        a === b
      );
    }
  }
});

test("EquivalenceRelation.ByPitch spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(areEqualAccordingTo(EquivalenceRelation.ByPitch, a, b)).toBe(
        a === b || a === alternativeName(b)
      );
    }
  }
});

test("EquivalenceRelation.ByLetter spec", () => {
  for (const a of ALL_NOTES) {
    for (const b of ALL_NOTES) {
      expect(areEqualAccordingTo(EquivalenceRelation.ByLetter, a, b)).toBe(
        natural(a) === natural(b)
      );
    }
  }
});

test("sharpOfNatural is complete", () => {
  for (const note of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      if (nat === natural(note) && modification(note) === Modification.Sharp) {
        expect(sharpOfNatural(nat)).toBe(note);
      }
    }
  }
});

test("sharpOfNatural is sound", () => {
  for (const note of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      if (sharpOfNatural(nat) === note) {
        expect(natural(note)).toBe(nat);
        expect(modification(note)).toBe(Modification.Sharp);
      }
    }
  }
});

test("flatOfNatural is complete", () => {
  for (const note of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      if (nat === natural(note) && modification(note) === Modification.Flat) {
        expect(flatOfNatural(nat)).toBe(note);
      }
    }
  }
});

test("flatOfNatural is sound", () => {
  for (const note of ALL_NOTES) {
    for (const nat of ALL_NATURALS) {
      if (flatOfNatural(nat) === note) {
        expect(natural(note)).toBe(nat);
        expect(modification(note)).toBe(Modification.Flat);
      }
    }
  }
});
