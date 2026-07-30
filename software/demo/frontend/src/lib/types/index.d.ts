export type Weapon = "Foil" | "Épée" | "Sabre" | "Mixed";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type ActivityType = "Competition" | "Training" | "Social";
export type Role = "Member" | "ClubAdmin";

export interface Activity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  weapon: Weapon;
  skillLevel: SkillLevel;
  type: ActivityType;
  isCancelled: boolean;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
  price: number;
}

export type User = {
  id: string;
  email: string;
  profileName: string;
  profileImageUrl: string | null;
  role: Role;
};

export type Badge = {
  id: string;
  code: string;
  title: string;
  description: string;
  awardedAt: string;
};

export type Profile = {
  id: string;
  email: string;
  profileName: string;
  profileBio: string | null;
  profileImageUrl: string | null;
  role: Role;
  weapon: Weapon | null;
  skillLevel: SkillLevel | null;
  contactInfo: string | null;
  isProfileComplete: boolean;
  badges: Badge[];
};
