import type { ActivityType, SkillLevel, Weapon } from "@/lib/types";

// Single source of truth for these three enums' selectable values - shared by
// the activity filters, the activity form, and (via the shared schema) its
// validation, instead of each place hardcoding its own copy of the list.
export const WEAPON_OPTIONS = [
  "Foil",
  "Épée",
  "Sabre",
  "Mixed",
] as const satisfies readonly Weapon[];

export const SKILL_LEVEL_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const satisfies readonly SkillLevel[];

export const EVENT_TYPE_OPTIONS = [
  "Competition",
  "Training",
  "Social",
] as const satisfies readonly ActivityType[];
