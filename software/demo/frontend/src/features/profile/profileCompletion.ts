import type { Profile } from "@/lib/types";

export function getMissingProfileFields(profile: Profile): string[] {
  const missing: string[] = [];

  if (!profile.profileImageUrl) missing.push("Profile Picture");
  if (!profile.profileBio) missing.push("Bio");
  if (!profile.weapon) missing.push("Weapon of Choice");
  if (!profile.skillLevel) missing.push("Skill Level");

  return missing;
}
