import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityBadgeColor(severity: string) {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    case "HIGH":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "MEDIUM":
      return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
    case "LOW":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    default:
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
}

export function getMethodBadgeColor(method: string) {
  switch (method?.toUpperCase()) {
    case "GET":
      return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    case "POST":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "PUT":
    case "PATCH":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "DELETE":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    default:
      return "bg-gray-500/15 text-gray-400 border-gray-500/30";
  }
}
