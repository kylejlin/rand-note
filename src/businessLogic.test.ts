import { ALL_NOTES, alternativeName } from "./businessLogic";

test("alternativeName is involutive", () => {
  for (const note of ALL_NOTES) {
    expect(alternativeName(alternativeName(note))).toBe(note);
  }
});
