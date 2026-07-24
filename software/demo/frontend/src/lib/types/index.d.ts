export type Weapon = "Foil" | "Épée" | "Sabre" | "Mixed";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type ActivityType = "Competition" | "Training" | "Social";

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
