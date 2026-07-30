import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, type DateArg } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: DateArg<Date>) {
  return format(date, "dd MMM yyyy");
}

// The API is served from VITE_API_URL (e.g. http://localhost:5000/api), but static files
// (uploaded profile pictures) are served from the same origin without the /api suffix.
const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export function resolveImageUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}
