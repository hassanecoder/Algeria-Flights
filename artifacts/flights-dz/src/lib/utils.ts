import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(durationString: string): string {
  // Assuming format like "PT2H30M" or just "2h 30m"
  // For simplicity, returning as is if it's already friendly,
  // but a robust app would parse ISO 8601 durations here.
  return durationString.replace('PT', '').toLowerCase();
}
