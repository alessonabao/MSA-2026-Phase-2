import { describe, expect, it } from "vitest";
import { getMissingProfileFields } from "./profileCompletion";
import type { Profile } from "@/lib/types";

const baseProfile: Profile = {
  id: "1",
  email: "portia@example.com",
  profileName: "Portia Knight",
  role: "Member",
  profileImageUrl: "/uploads/pic.jpg",
  profileBio: "Loves fencing.",
  weapon: "Épée",
  skillLevel: "Advanced",
  contactInfo: null,
  isProfileComplete: true,
  badges: [],
};

describe("getMissingProfileFields", () => {
  it("returns an empty list when every field is set", () => {
    expect(getMissingProfileFields(baseProfile)).toEqual([]);
  });

  it("flags all four fields when none are set", () => {
    const profile: Profile = {
      ...baseProfile,
      profileImageUrl: null,
      profileBio: null,
      weapon: null,
      skillLevel: null,
    };
    expect(getMissingProfileFields(profile)).toEqual([
      "Profile Picture",
      "Bio",
      "Weapon of Choice",
      "Skill Level",
    ]);
  });

  it("flags only the specific fields that are missing", () => {
    const profile: Profile = {
      ...baseProfile,
      profileBio: null,
      skillLevel: null,
    };
    expect(getMissingProfileFields(profile)).toEqual(["Bio", "Skill Level"]);
  });
});
