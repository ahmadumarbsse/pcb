import { describe, it, expect, beforeAll } from "vitest";
import { runMigrations } from "@/db/migrate";
import { seedDatabase } from "@/db/seed";
import { validatePromoCode } from "@/services/bookings";
import { processGateScan } from "@/services/gate-scanner";
import { getAdminKpis } from "@/services/admin";

describe("Booking Engine & Promo Calculations", () => {
  beforeAll(async () => {
    await runMigrations();
    await seedDatabase();
  });

  it("calculates percentage promotional discount accurately in PKR integers", async () => {
    // Seeded PCB2026: 10% discount, min PKR 1000, max discount PKR 1500
    const promo = await validatePromoCode("PCB2026", 10000);
    expect(promo.valid).toBe(true);
    // 10% of 10000 = 1000
    expect(promo.discountPkr).toBe(1000);
  });

  it("respects maximum discount cap on promotional codes", async () => {
    // 10% of 30,000 = 3,000, but capped at 1,500
    const promo = await validatePromoCode("PCB2026", 30000);
    expect(promo.valid).toBe(true);
    expect(promo.discountPkr).toBe(1500);
  });

  it("rejects promotional code when order subtotal is below minimum order amount", async () => {
    const promo = await validatePromoCode("PCB2026", 500);
    expect(promo.valid).toBe(false);
    expect(promo.discountPkr).toBe(0);
  });

  it("rejects unrecognized or nonexistent promo code", async () => {
    const promo = await validatePromoCode("NONEXISTENT_CODE_99", 5000);
    expect(promo.valid).toBe(false);
    expect(promo.discountPkr).toBe(0);
  });
});

describe("Admin Telemetry & KPIs", () => {
  it("queries real-time KPIs without error", async () => {
    const kpis = await getAdminKpis();
    expect(kpis).toHaveProperty("totalRevenuePkr");
    expect(kpis).toHaveProperty("totalOrders");
    expect(kpis).toHaveProperty("totalTicketsIssued");
    expect(kpis).toHaveProperty("activeHolds");
    expect(typeof kpis.totalRevenuePkr).toBe("number");
  });
});

describe("Stadium Turnstile Gate Security", () => {
  it("rejects unauthorized or fraudulent ticket token", async () => {
    const result = await processGateScan({
      tokenOrTicketNumber: "INVALID_FORGED_TOKEN_8899",
      matchId: "match-1",
      gateName: "Gate 1",
    });

    expect(result.success).toBe(false);
    expect(result.result).toBe("INVALID_TOKEN");
  });
});
