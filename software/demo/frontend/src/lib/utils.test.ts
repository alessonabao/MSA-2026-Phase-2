import { describe, expect, it } from "vitest";
import { formatDate, getInitials, resolveImageUrl } from "./utils";

describe("formatDate", () => {
  it("formats a date string as 'dd MMM yyyy'", () => {
    expect(formatDate("2026-03-05")).toBe("05 Mar 2026");
  });

  it("formats a Date object as 'dd MMM yyyy'", () => {
    expect(formatDate(new Date(2026, 6, 31))).toBe("31 Jul 2026");
  });
});

describe("resolveImageUrl", () => {
  it("passes through absolute http(s) URLs unchanged", () => {
    expect(resolveImageUrl("http://example.com/pic.jpg")).toBe(
      "http://example.com/pic.jpg",
    );
    expect(resolveImageUrl("https://example.com/pic.jpg")).toBe(
      "https://example.com/pic.jpg",
    );
  });

  it("prefixes relative paths with the API origin", () => {
    expect(resolveImageUrl("/uploads/pic.jpg")).toBe(
      "http://localhost:5000/uploads/pic.jpg",
    );
  });
});

describe("getInitials", () => {
  it("returns an empty string for an empty/whitespace-only name", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });

  it("returns the first two characters for a single-word name", () => {
    expect(getInitials("Cher")).toBe("CH");
  });

  it("returns first-and-last initials for a multi-word name", () => {
    expect(getInitials("Portia Knight")).toBe("PK");
  });

  it("uses first and last word when there are more than two words", () => {
    expect(getInitials("Mary Jane Watson")).toBe("MW");
  });

  it("collapses repeated whitespace between words", () => {
    expect(getInitials("  Portia   Knight  ")).toBe("PK");
  });
});
