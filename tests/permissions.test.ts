import { describe, it, expect } from "vitest";
import {
  hasPermission,
  isAdminRole,
  verifyResourceOwnership,
  type Permission,
} from "@/lib/permissions";
import { registerSchema } from "@/validators/auth";

describe("Role-Based Access Control (RBAC) Permissions", () => {
  it("allows fan to book and view own tickets, but blocks privileged operations", () => {
    expect(hasPermission("fan", "book_tickets")).toBe(true);
    expect(hasPermission("fan", "view_own_tickets")).toBe(true);

    // Fan cannot perform admin or staff operations
    expect(hasPermission("fan", "manage_matches")).toBe(false);
    expect(hasPermission("fan", "manage_pricing")).toBe(false);
    expect(hasPermission("fan", "approve_refunds")).toBe(false);
    expect(hasPermission("fan", "scan_gate_tickets")).toBe(false);
    expect(hasPermission("fan", "manage_roles")).toBe(false);
  });

  it("allows gate_staff only gate scanning and match viewing", () => {
    expect(hasPermission("gate_staff", "scan_gate_tickets")).toBe(true);
    expect(hasPermission("gate_staff", "view_public_matches")).toBe(true);
    expect(hasPermission("gate_staff", "manage_matches")).toBe(false);
    expect(hasPermission("gate_staff", "approve_refunds")).toBe(false);
  });

  it("allows box_office_staff to sell counter tickets and view orders", () => {
    expect(hasPermission("box_office_staff", "sell_box_office_tickets")).toBe(true);
    expect(hasPermission("box_office_staff", "book_tickets")).toBe(true);
    expect(hasPermission("box_office_staff", "approve_refunds")).toBe(false);
  });

  it("allows venue_manager to manage venues and stadiums", () => {
    expect(hasPermission("venue_manager", "manage_venues")).toBe(true);
    expect(hasPermission("venue_manager", "scan_gate_tickets")).toBe(true);
    expect(hasPermission("venue_manager", "manage_roles")).toBe(false);
  });

  it("allows ticketing_admin full ticketing operations and refund approvals", () => {
    expect(hasPermission("ticketing_admin", "manage_matches")).toBe(true);
    expect(hasPermission("ticketing_admin", "manage_pricing")).toBe(true);
    expect(hasPermission("ticketing_admin", "approve_refunds")).toBe(true);
    expect(hasPermission("ticketing_admin", "manage_roles")).toBe(false);
  });

  it("grants super_admin universal permissions", () => {
    const permissions: Permission[] = [
      "view_public_matches",
      "book_tickets",
      "view_own_tickets",
      "scan_gate_tickets",
      "sell_box_office_tickets",
      "manage_venues",
      "manage_matches",
      "manage_pricing",
      "approve_refunds",
      "view_audit_logs",
      "manage_roles",
      "full_admin",
    ];

    for (const perm of permissions) {
      expect(hasPermission("super_admin", perm)).toBe(true);
    }
  });

  it("identifies administrative roles accurately", () => {
    expect(isAdminRole("super_admin")).toBe(true);
    expect(isAdminRole("ticketing_admin")).toBe(true);
    expect(isAdminRole("venue_manager")).toBe(true);
    expect(isAdminRole("fan")).toBe(false);
    expect(isAdminRole("gate_staff")).toBe(false);
  });
});

describe("Resource Ownership & Privacy Isolation", () => {
  const fanAId = "user-fan-a-123";
  const fanBId = "user-fan-b-456";
  const adminId = "user-admin-789";

  it("allows a customer to access only their own tickets and orders", () => {
    expect(verifyResourceOwnership(fanAId, fanAId, "fan")).toBe(true);
    expect(verifyResourceOwnership(fanBId, fanBId, "fan")).toBe(true);
  });

  it("strictly prevents Customer A from accessing Customer B's tickets", () => {
    // Fan A trying to access Fan B's order
    expect(verifyResourceOwnership(fanBId, fanAId, "fan")).toBe(false);
  });

  it("allows authorized administrators to inspect customer orders for support", () => {
    expect(verifyResourceOwnership(fanAId, adminId, "super_admin")).toBe(true);
    expect(verifyResourceOwnership(fanAId, adminId, "ticketing_admin")).toBe(true);
    expect(verifyResourceOwnership(fanAId, adminId, "box_office_staff")).toBe(true);
  });
});

describe("Input Validation & Privilege Escalation Defenses", () => {
  it("validates valid registration payloads", () => {
    const validData = {
      name: "Babar Azam",
      email: "babar@cricket.demo",
      password: "StrongPassword123!",
      phoneNumber: "03001234567",
      cnic: "35201-1234567-1",
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects invalid CNIC format", () => {
    const invalidCnic = {
      name: "Shaheen Afridi",
      email: "shaheen@cricket.demo",
      password: "StrongPassword123!",
      cnic: "12345-invalid", // bad format
    };
    const result = registerSchema.safeParse(invalidCnic);
    expect(result.success).toBe(false);
  });

  it("rejects weak passwords lacking uppercase or digits", () => {
    const weakPassword = {
      name: "Mohammad Rizwan",
      email: "rizwan@cricket.demo",
      password: "weakpassword", // No uppercase, no digits
    };
    const result = registerSchema.safeParse(weakPassword);
    expect(result.success).toBe(false);
  });
});
