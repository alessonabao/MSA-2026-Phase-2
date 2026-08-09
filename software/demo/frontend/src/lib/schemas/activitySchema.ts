import z from "zod";
import {
  EVENT_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  WEAPON_OPTIONS,
} from "@/lib/constants/activityOptions";

export const activitySchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters.")
      .max(100, "Title must be at most 100 characters."),
    date: z.coerce
      .date()
      .min(new Date(), { message: "Date cannot be in the past" })
      .max(new Date("2030-01-01"), {
        message: "Date is too far in the future",
      })
      .transform((val) => new Date(val)),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters.")
      .max(500, "Description must be at most 500 characters."),
    weapon: z.enum(WEAPON_OPTIONS, {
      error: "Please select a valid weapon.",
    }),
    skillLevel: z.enum(SKILL_LEVEL_OPTIONS, {
      error: "Please select a valid skill level.",
    }),
    type: z.enum(EVENT_TYPE_OPTIONS, {
      error: "Please select a valid activity type.",
    }),
    city: z
      .string()
      .min(2, "City must be at least 2 characters.")
      .max(100, "City must be at most 100 characters."),
    venue: z
      .string()
      .min(5, "Venue must be at least 5 characters.")
      .max(200, "Venue must be at most 200 characters."),
    price: z.coerce
      .number({ error: "Price must be a number." })
      .min(0, "Price cannot be negative.")
      .max(10000, "Price must be at most $10,000.")
      .transform((val) => Number(val)),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

export type ActivitySchema = z.output<typeof activitySchema>;
