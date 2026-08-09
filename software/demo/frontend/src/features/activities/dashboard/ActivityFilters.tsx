import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Activity, ActivityType, SkillLevel, Weapon } from "@/lib/types";
import { EVENT_TYPE_OPTIONS } from "@/lib/constants/activityOptions";

export type ParticipationFilter = "all" | "going" | "notGoing";

export interface ActivityFilters {
  participation: ParticipationFilter;
  weapons: Weapon[];
  eventTypes: ActivityType[];
  skillLevel: SkillLevel | null;
  dateRange: DateRange | undefined;
}

export const DEFAULT_ACTIVITY_FILTERS: ActivityFilters = {
  participation: "all",
  weapons: [],
  eventTypes: [...EVENT_TYPE_OPTIONS],
  skillLevel: null,
  dateRange: undefined,
};

export function getInitialCalendarMonth(activities: Activity[]): Date {
  if (activities.length === 0) return new Date();

  const now = new Date();
  const dates = activities
    .map((activity) => parseISO(activity.date))
    .sort((a, b) => a.getTime() - b.getTime());
  const upcoming = dates.find((date) => date >= now);

  return upcoming ?? dates[0];
}

export function filterActivities(
  activities: Activity[],
  filters: ActivityFilters,
  // Activity ids the current user is actively attending - a cancelled
  // ActivityAttendance is deliberately excluded from this set, so it is
  // treated as "not going" here, not just in how it's labeled in the UI.
  goingActivityIds: Set<string>,
): Activity[] {
  return activities.filter((activity) => {
    if (
      filters.participation === "going" &&
      !goingActivityIds.has(activity.id)
    )
      return false;
    if (
      filters.participation === "notGoing" &&
      goingActivityIds.has(activity.id)
    )
      return false;
    if (
      filters.weapons.length > 0 &&
      !filters.weapons.includes(activity.weapon)
    )
      return false;
    if (!filters.eventTypes.includes(activity.type)) return false;
    if (filters.skillLevel && activity.skillLevel !== filters.skillLevel)
      return false;
    if (filters.dateRange?.from) {
      const start = startOfDay(filters.dateRange.from);
      const end = endOfDay(filters.dateRange.to ?? filters.dateRange.from);
      if (!isWithinInterval(parseISO(activity.date), { start, end }))
        return false;
    }
    return true;
  });
}
