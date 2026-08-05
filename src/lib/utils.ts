import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Backend date-only values serialize as UTC midnight; formatting them with
// the browser's local timezone shifts the displayed day/month backward for
// negative-offset viewers (e.g. Brazil, UTC-3). Force timeZone: "UTC".
export function formatDateOnlyPtBR(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(dateString)
  );
}
