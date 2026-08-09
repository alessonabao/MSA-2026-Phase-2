import { afterEach, describe, expect, it, vi } from "vitest";
import { geocodeAddress } from "./geocoding";

function mockFetchResults(results: unknown[][]) {
  const fetchMock = vi.fn();
  for (const result of results) {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(result), { status: 200 }),
    );
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("geocodeAddress", () => {
  it("returns coordinates from the first successful query", async () => {
    mockFetchResults([[{ lat: "-36.85", lon: "174.76" }]]);

    const result = await geocodeAddress("City Fencing Club, Auckland");

    expect(result).toEqual({ latitude: -36.85, longitude: 174.76 });
  });

  it("retries without the leading venue-name segment when the full query finds nothing", async () => {
    const fetchMock = mockFetchResults([
      [],
      [{ lat: "-36.857", lon: "174.765" }],
    ]);

    const result = await geocodeAddress(
      "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD, Auckland",
    );

    expect(result).toEqual({ latitude: -36.857, longitude: 174.765 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const secondUrl = new URL(fetchMock.mock.calls[1][0] as string | URL);
    expect(secondUrl.searchParams.get("q")).toBe(
      "17 Symonds Street, Auckland CBD, Auckland",
    );
  });

  it("does not retry (and returns null) when stripping the first segment would leave no address behind", async () => {
    const fetchMock = mockFetchResults([[]]);

    const result = await geocodeAddress("17 Symonds Street, Auckland");

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns null when both the full query and the retry find nothing", async () => {
    const fetchMock = mockFetchResults([[], []]);

    const result = await geocodeAddress(
      "Nonexistent Place, Nowhere Street, Nowhere Suburb, Nowhere City",
    );

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws when the geocoding request itself fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 500 })),
    );

    await expect(geocodeAddress("Some Venue, Some City")).rejects.toThrow(
      "Geocoding request failed: 500",
    );
  });
});
