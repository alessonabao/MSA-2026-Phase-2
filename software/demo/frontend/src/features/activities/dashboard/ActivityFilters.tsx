import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Activity, ActivityType, SkillLevel, Weapon } from "@/lib/types";

export type ParticipationFilter = "all" | "going" | "hosting";

export interface ActivityFilters {
  participation: ParticipationFilter;
  weapons: Weapon[];
  eventTypes: ActivityType[];
  skillLevel: SkillLevel | null;
  dateRange: DateRange | undefined;
}

export const WEAPON_OPTIONS: Weapon[] = ["Foil", "Épée", "Sabre", "Mixed"];
export const EVENT_TYPE_OPTIONS: ActivityType[] = [
  "Competition",
  "Training",
  "Social",
];
export const SKILL_LEVEL_OPTIONS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

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
): Activity[] {
  return activities.filter((activity) => {
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
