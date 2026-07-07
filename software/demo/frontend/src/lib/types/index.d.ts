export type Weapon = "Foil" | "Épée" | "Sabre";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type ActivityType = "Competition" | "Training" | "Social";

export interface Activity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  weapon: string;
  skillLevel: string;
  type: string;
  isCancelled: boolean;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
  price: number;
}
