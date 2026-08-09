import type { GeocodeResult } from "@/lib/api/geocoding";

// Manual coordinate overrides for venues whose exact building free-text geocoding
// can't reliably resolve (Nominatim has no fuzzy business/POI-name search - see
// geocodeAddress). Keyed by the Venue field's text, normalized for case/whitespace,
// so it matches regardless of what's typed into the separate City field.
const KNOWN_VENUE_COORDINATES: Record<string, GeocodeResult> = {
  "hiwa recreation centre, 17 symonds street, auckland cbd": {
    latitude: -36.852634,
    longitude: 174.769104,
  },
};

export function getKnownVenueCoordinates(venue: string): GeocodeResult | null {
  return KNOWN_VENUE_COORDINATES[venue.trim().toLowerCase()] ?? null;
}
