export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

// Client-side geocoding via OpenStreetMap's Nominatim API (free, no key required,
// consistent with the OSM embed already used for the venue map). Browsers can't set
// a custom User-Agent, so Nominatim identifies the caller via the Referer header it
// sends automatically instead.
export async function geocodeAddress(
  query: string,
): Promise<GeocodeResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`);
  }

  const results: { lat: string; lon: string }[] = await response.json();
  const [first] = results;
  if (!first) {
    return null;
  }

  return { latitude: Number(first.lat), longitude: Number(first.lon) };
}
