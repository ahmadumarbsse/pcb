import { describe, it, expect, beforeAll } from "vitest";
import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { runMigrations } from "@/db/migrate";

describe("Better Auth Authentication and Identity Verification", () => {
  beforeAll(async () => {
    await runMigrations();
  });

  it("authenticates fan with valid credentials", async () => {
    const res = await auth.api.signInEmail({
      body: {
        email: "fan@pcb.demo",
        password: "CricketFan@2026!",
      },
    });

    expect(res).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.email).toBe("fan@pcb.demo");
    expect((res.user as any).role).toBe("fan");
  });

  it("authenticates super administrator and verifies elevated role", async () => {
    const res = await auth.api.signInEmail({
      body: {
        email: "superadmin@pcb.demo",
        password: "SuperAdmin@2026!",
      },
    });

    expect(res).toBeDefined();
    expect(res.user).toBeDefined();
    expect((res.user as any).role).toBe("super_admin");
  });

  it("rejects login attempt with invalid password", async () => {
    await expect(
      auth.api.signInEmail({
        body: {
          email: "fan@pcb.demo",
          password: "WrongPassword!999",
        },
      })
    ).rejects.toThrow();
  });

  it("registers new fans strictly with default 'fan' role", async () => {
    const randomEmail = `fan_${Date.now()}@pcb.demo`;
    const res = await auth.api.signUpEmail({
      body: {
        email: randomEmail,
        password: "StrongFanPass123!",
        name: "Test Registration User",
      },
    });

    expect(res.user).toBeDefined();
    expect(res.user.email).toBe(randomEmail);

    // Verify user in database has 'fan' role
    const db = getDb();
    const dbUser = await db.select().from(users).where(eq(users.email, randomEmail)).limit(1);
    expect(dbUser.length).toBe(1);
    expect(dbUser[0].role).toBe("fan");
  });
});
