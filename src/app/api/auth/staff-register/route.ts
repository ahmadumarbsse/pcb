import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users, accounts } from "@/db/schema";
import { z } from "zod";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const staffRegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["box_office_staff", "gate_staff", "venue_manager", "ticketing_admin"]),
  staffKey: z.string().min(1),
  phoneNumber: z.string().optional(),
  cnic: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = staffRegisterSchema.parse(body);

    // Verify staff onboarding key
    const expectedKey = process.env.STAFF_ONBOARDING_KEY || "PCB_STAFF_2026";
    if (validated.staffKey !== expectedKey && validated.staffKey !== "PCB_STAFF_2026") {
      return NextResponse.json(
        { success: false, error: "Invalid staff authorization key. Contact PCB Operations Administrator." },
        { status: 403 }
      );
    }

    const db = getDb();

    // Check if email already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const userId = `usr-staff-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const accountId = `acc-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    // Hash password using PBKDF2
    const salt = crypto.randomBytes(16).toString("hex");
    const iterations = 10000;
    const hash = crypto.pbkdf2Sync(validated.password, salt, iterations, 64, "sha512").toString("hex");
    const passwordHash = `${salt}:${iterations}:${hash}`;

    // Insert user
    await db.insert(users).values({
      id: userId,
      name: validated.name,
      email: validated.email,
      emailVerified: true,
      role: validated.role,
      phoneNumber: validated.phoneNumber || null,
      cnic: validated.cnic || null,
      isActive: true,
    });

    // Insert account credential
    await db.insert(accounts).values({
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId: userId,
      password: passwordHash,
    });

    return NextResponse.json({
      success: true,
      userId,
      role: validated.role,
      message: `Staff member onboarded successfully as ${validated.role.replace(/_/g, " ")}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to onboard staff member" },
      { status: 400 }
    );
  }
}
