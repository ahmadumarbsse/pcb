import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(pkrAmount: number): string {
  return `PKR ${pkrAmount.toLocaleString("en-US")}`;
}

export function formatDate(date: Date | string, format: "short" | "medium" | "full" = "medium"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (format === "short") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (format === "full") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  if (timeStr.includes("T")) {
    const d = new Date(timeStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${period} PKT`;
}
