import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_ACTIVITY_FILTERS,
  filterActivities,
  getInitialCalendarMonth,
  type ActivityFilters,
} from "./ActivityFilters";
import type { Activity } from "@/lib/types";

let nextId = 0;

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  nextId += 1;
  return {
    id: overrides.id ?? `activity-${nextId}`,
    title: `Activity ${nextId}`,
    date: "2026-08-15T00:00:00.000Z",
    startTime: "18:00",
    endTime: "20:00",
    description: "A club activity.",
    weapon: "Foil",
    skillLevel: "Beginner",
    type: "Training",
    isCancelled: false,
    city: "Auckland",
    venue: "City Fencing Club",
    latitude: 0,
    longitude: 0,
    price: 0,
    ...overrides,
  };
}

describe("filterActivities", () => {
  it("returns every activity when filters are left at their defaults", () => {
    const activities = [makeActivity(), makeActivity(), makeActivity()];
    const result = filterActivities(activities, DEFAULT_ACTIVITY_FILTERS, new Set());
    expect(result).toHaveLength(3);
  });

  it("keeps only activities the user is going to when participation is 'going'", () => {
    const going = makeActivity({ id: "going" });
    const notGoing = makeActivity({ id: "not-going" });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      participation: "going",
    };

    const result = filterActivities(
      [going, notGoing],
      filters,
      new Set(["going"]),
    );

    expect(result.map((a) => a.id)).toEqual(["going"]);
  });

  it("excludes activities the user is going to when participation is 'notGoing'", () => {
    const going = makeActivity({ id: "going" });
    const notGoing = makeActivity({ id: "not-going" });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      participation: "notGoing",
    };

    const result = filterActivities(
      [going, notGoing],
      filters,
      new Set(["going"]),
    );

    expect(result.map((a) => a.id)).toEqual(["not-going"]);
  });

  it("filters by weapon when at least one weapon is selected", () => {
    const foil = makeActivity({ id: "foil", weapon: "Foil" });
    const sabre = makeActivity({ id: "sabre", weapon: "Sabre" });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      weapons: ["Foil"],
    };

    const result = filterActivities([foil, sabre], filters, new Set());

    expect(result.map((a) => a.id)).toEqual(["foil"]);
  });

  it("does not filter by weapon when no weapons are selected", () => {
    const foil = makeActivity({ id: "foil", weapon: "Foil" });
    const sabre = makeActivity({ id: "sabre", weapon: "Sabre" });

    const result = filterActivities(
      [foil, sabre],
      { ...DEFAULT_ACTIVITY_FILTERS, weapons: [] },
      new Set(),
    );

    expect(result).toHaveLength(2);
  });

  it("filters out event types not present in eventTypes", () => {
    const training = makeActivity({ id: "training", type: "Training" });
    const social = makeActivity({ id: "social", type: "Social" });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      eventTypes: ["Training"],
    };

    const result = filterActivities([training, social], filters, new Set());

    expect(result.map((a) => a.id)).toEqual(["training"]);
  });

  it("filters by skill level when one is selected", () => {
    const beginner = makeActivity({ id: "beginner", skillLevel: "Beginner" });
    const advanced = makeActivity({ id: "advanced", skillLevel: "Advanced" });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      skillLevel: "Advanced",
    };

    const result = filterActivities([beginner, advanced], filters, new Set());

    expect(result.map((a) => a.id)).toEqual(["advanced"]);
  });

  it("does not filter by skill level when null", () => {
    const beginner = makeActivity({ id: "beginner", skillLevel: "Beginner" });
    const advanced = makeActivity({ id: "advanced", skillLevel: "Advanced" });

    const result = filterActivities(
      [beginner, advanced],
      { ...DEFAULT_ACTIVITY_FILTERS, skillLevel: null },
      new Set(),
    );

    expect(result).toHaveLength(2);
  });

  // Activity dates and range bounds both use bare "yyyy-MM-dd" strings /
  // local-time Date objects (never a UTC "Z" timestamp) so the comparison
  // is not sensitive to the machine's timezone offset.
  it("keeps only activities within a single-day date range", () => {
    const inRange = makeActivity({ id: "in-range", date: "2026-08-15" });
    const outOfRange = makeActivity({ id: "out-of-range", date: "2026-08-16" });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      dateRange: { from: new Date(2026, 7, 15), to: undefined },
    };

    const result = filterActivities([inRange, outOfRange], filters, new Set());

    expect(result.map((a) => a.id)).toEqual(["in-range"]);
  });

  it("keeps activities within a multi-day date range (inclusive of both ends)", () => {
    const before = makeActivity({ id: "before", date: "2026-08-09" });
    const start = makeActivity({ id: "start", date: "2026-08-10" });
    const end = makeActivity({ id: "end", date: "2026-08-12" });
    const after = makeActivity({ id: "after", date: "2026-08-13" });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      dateRange: {
        from: new Date(2026, 7, 10),
        to: new Date(2026, 7, 12),
      },
    };

    const result = filterActivities([before, start, end, after], filters, new Set());

    expect(result.map((a) => a.id).sort()).toEqual(["end", "start"]);
  });

  it("applies multiple filters together (AND semantics)", () => {
    const match = makeActivity({
      id: "match",
      weapon: "Sabre",
      type: "Competition",
      skillLevel: "Advanced",
    });
    const wrongWeapon = makeActivity({
      id: "wrong-weapon",
      weapon: "Foil",
      type: "Competition",
      skillLevel: "Advanced",
    });
    const filters: ActivityFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      weapons: ["Sabre"],
      eventTypes: ["Competition"],
      skillLevel: "Advanced",
    };

    const result = filterActivities([match, wrongWeapon], filters, new Set());

    expect(result.map((a) => a.id)).toEqual(["match"]);
  });
});

describe("getInitialCalendarMonth", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-31T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the current date when there are no activities", () => {
    const result = getInitialCalendarMonth([]);
    expect(result.getTime()).toBe(new Date("2026-07-31T12:00:00.000Z").getTime());
  });

  it("returns the soonest upcoming activity date", () => {
    const activities = [
      makeActivity({ date: "2026-09-01T00:00:00.000Z" }),
      makeActivity({ date: "2026-08-05T00:00:00.000Z" }),
      makeActivity({ date: "2026-08-20T00:00:00.000Z" }),
    ];

    const result = getInitialCalendarMonth(activities);

    expect(result.toISOString()).toBe("2026-08-05T00:00:00.000Z");
  });

  it("falls back to the earliest date when every activity is in the past", () => {
    const activities = [
      makeActivity({ date: "2026-06-01T00:00:00.000Z" }),
      makeActivity({ date: "2026-01-01T00:00:00.000Z" }),
    ];

    const result = getInitialCalendarMonth(activities);

    expect(result.toISOString()).toBe("2026-01-01T00:00:00.000Z");
  });
});
