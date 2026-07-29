import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, type DateArg } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: DateArg<Date>) {
  return format(date, "dd MMM yyyy");
}
