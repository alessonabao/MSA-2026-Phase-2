import { describe, expect, it } from "vitest";
import { getAttendeesLabel } from "./getAttendeesLabel";

describe("getAttendeesLabel", () => {
  it("returns 'no one' for an empty list", () => {
    expect(getAttendeesLabel([])).toBe("no one");
  });

  it("returns the single name for a list of one", () => {
    expect(getAttendeesLabel(["Alice"])).toBe("Alice");
  });

  it("joins two names with 'and'", () => {
    expect(getAttendeesLabel(["Alice", "Bob"])).toBe("Alice and Bob");
  });

  it("shows the first two names plus a singular 'other' count for three", () => {
    expect(getAttendeesLabel(["Alice", "Bob", "Cara"])).toBe(
      "Alice, Bob +1 other",
    );
  });

  it("pluralizes 'others' for more than three", () => {
    expect(getAttendeesLabel(["Alice", "Bob", "Cara", "Dan"])).toBe(
      "Alice, Bob +2 others",
    );
  });
});
