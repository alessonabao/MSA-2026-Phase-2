import { describe, expect, it } from "vitest";
import { getKnownVenueCoordinates } from "./knownVenues";

describe("getKnownVenueCoordinates", () => {
  it("returns the override for a known venue", () => {
    expect(
      getKnownVenueCoordinates(
        "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
      ),
    ).toEqual({ latitude: -36.852634, longitude: 174.769104 });
  });

  it("matches regardless of surrounding whitespace or casing", () => {
    expect(
      getKnownVenueCoordinates(
        "  hiwa recreation centre, 17 symonds street, auckland cbd  ",
      ),
    ).toEqual({ latitude: -36.852634, longitude: 174.769104 });
  });

  it("returns null for a venue with no override", () => {
    expect(getKnownVenueCoordinates("City Fencing Club")).toBeNull();
  });
});
