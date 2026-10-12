import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

describe("Formatting Utilities", () => {
  it("formats PKR currency correctly", () => {
    const formatted = formatCurrency(1500);
    expect(formatted).toContain("1,500");
    expect(formatted).toContain("PKR");
  });

  it("formats date properly", () => {
    const formatted = formatDate("2026-11-14", "short");
    expect(formatted).toContain("Nov 14");
  });

  it("formats time properly", () => {
    const formatted = formatTime("19:00");
    expect(formatted).toBe("7:00 PM PKT");
  });
});
