import z from "zod";

export const profileSchema = z.object({
  profileName: z.string().min(1, "Name is required"),
  profileBio: z.string().optional(),
  weapon: z.enum(["Foil", "Épée", "Sabre", "Mixed"] as const).optional(),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"] as const).optional(),
  contactInfo: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
