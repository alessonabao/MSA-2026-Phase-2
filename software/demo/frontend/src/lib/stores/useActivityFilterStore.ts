import { create } from "zustand";
import {
  DEFAULT_ACTIVITY_FILTERS,
  type ActivityFilters,
} from "@/features/activities/dashboard/ActivityFilters";

/**
 * Client-side state for the Activities dashboard's filter panel
 * (participation, weapon, event type, skill level, date range).
 *
 * Why Zustand and not local useState/Context:
 * - This state used to live as `useState` in ActivitiesDashboard and get
 *   threaded through two levels of props (`filters` / `onFiltersChange`)
 *   into both ActivityList and ActivityDashboardSidebar - classic prop
 *   drilling of state the parent component never reads itself.
 * - It has nothing to do with the server: TanStack Query already owns the
 *   activities data (`useActivities`). This store only owns the user's
 *   local view/filter preferences over that data, which is pure client
 *   state with no backend endpoint behind it.
 * - Because there's no Provider, ActivityList and ActivityDashboardSidebar
 *   each subscribe directly to just the slice they need, and ActivitiesDashboard
 *   itself no longer re-renders every time a filter changes.
 * - Bonus: because the store lives outside the component tree, filters now
 *   survive navigating away to an activity's details page and back, instead
 *   of resetting every time ActivitiesDashboard unmounts.
 */
type ActivityFilterState = {
  filters: ActivityFilters;
  setFilters: (filters: ActivityFilters) => void;
  resetFilters: () => void;
};

export const useActivityFilterStore = create<ActivityFilterState>((set) => ({
  filters: DEFAULT_ACTIVITY_FILTERS,
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: DEFAULT_ACTIVITY_FILTERS }),
}));
