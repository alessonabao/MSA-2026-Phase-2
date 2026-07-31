import { afterEach, describe, expect, it } from "vitest";
import { useActivityFilterStore } from "./useActivityFilterStore";
import { DEFAULT_ACTIVITY_FILTERS } from "@/features/activities/dashboard/ActivityFilters";

afterEach(() => {
  useActivityFilterStore.setState({ filters: DEFAULT_ACTIVITY_FILTERS });
});

describe("useActivityFilterStore", () => {
  it("starts with the default filters", () => {
    expect(useActivityFilterStore.getState().filters).toEqual(
      DEFAULT_ACTIVITY_FILTERS,
    );
  });

  it("setFilters replaces the current filters", () => {
    const nextFilters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      participation: "going" as const,
      weapons: ["Sabre" as const],
    };

    useActivityFilterStore.getState().setFilters(nextFilters);

    expect(useActivityFilterStore.getState().filters).toEqual(nextFilters);
  });

  it("resetFilters restores the default filters after a change", () => {
    useActivityFilterStore.getState().setFilters({
      ...DEFAULT_ACTIVITY_FILTERS,
      participation: "notGoing",
    });

    useActivityFilterStore.getState().resetFilters();

    expect(useActivityFilterStore.getState().filters).toEqual(
      DEFAULT_ACTIVITY_FILTERS,
    );
  });
});
