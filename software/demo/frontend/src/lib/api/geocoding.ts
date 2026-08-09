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
  const result = await fetchGeocodeResult(query);
  if (result) {
    return result;
  }

  // Nominatim has no fuzzy business/POI-name search - it only matches strings
  // against places it has actually mapped. A venue name it doesn't recognise
  // (e.g. "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD") can make the
  // whole query match nothing, even though the street address portion alone
  // would resolve fine. Retry once without the leading ", "-separated segment.
  // Requiring at least two commas left after stripping guards against dropping
  // the only address info when the venue field was never more than a plain
  // "street, city" pair to begin with.
  const firstCommaIndex = query.indexOf(",");
  const addressOnly = query.slice(firstCommaIndex + 1).trim();
  if (firstCommaIndex === -1 || addressOnly.split(",").length < 2) {
    return null;
  }

  return fetchGeocodeResult(addressOnly);
}

async function fetchGeocodeResult(query: string): Promise<GeocodeResult | null> {
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
