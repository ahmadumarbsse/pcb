import { headers } from "next/headers";
import { auth } from "./auth";
import type { UserRole } from "@/db/schema/users";

export type Permission =
  | "view_public_matches"
  | "book_tickets"
  | "view_own_tickets"
  | "scan_gate_tickets"
  | "sell_box_office_tickets"
  | "manage_venues"
  | "manage_matches"
  | "manage_pricing"
  | "approve_refunds"
  | "view_audit_logs"
  | "manage_roles"
  | "full_admin";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  fan: [
    "view_public_matches",
    "book_tickets",
    "view_own_tickets",
  ],
  gate_staff: [
    "view_public_matches",
    "scan_gate_tickets",
  ],
  box_office_staff: [
    "view_public_matches",
    "book_tickets",
    "sell_box_office_tickets",
    "view_own_tickets",
  ],
  venue_manager: [
    "view_public_matches",
    "scan_gate_tickets",
    "sell_box_office_tickets",
    "manage_venues",
  ],
  ticketing_admin: [
    "view_public_matches",
    "book_tickets",
    "sell_box_office_tickets",
    "manage_venues",
    "manage_matches",
    "manage_pricing",
    "approve_refunds",
    "view_audit_logs",
  ],
  super_admin: [
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
  ],
};

/**
 * Checks whether a given role possesses a specific permission
 */
export function hasPermission(role: UserRole | string, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role as UserRole];
  if (!allowed) return false;
  return allowed.includes(permission) || allowed.includes("full_admin");
}

/**
 * Checks whether a role is one of the administrative roles
 */
export function isAdminRole(role: string): boolean {
  return ["ticketing_admin", "venue_manager", "super_admin"].includes(role);
}

/**
 * Retrieves the current authenticated user session on the server
 */
export async function getServerSession() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  return session;
}

/**
 * Enforces an active session on the server. Throws or returns 401 response if unauthenticated.
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }
  return session;
}

/**
 * Enforces that the current authenticated user has a required permission.
 */
export async function requirePermission(permission: Permission) {
  const session = await requireAuth();
  const role = (session.user as any).role || "fan";

  if (!hasPermission(role, permission)) {
    throw new Error(`FORBIDDEN: Role '${role}' lacks required permission '${permission}'`);
  }

  return session;
}

/**
 * Verifies that a resource belongs to the current user, or that the current user is an admin.
 */
export function verifyResourceOwnership(
  resourceUserId: string,
  currentUserId: string,
  currentUserRole: string
): boolean {
  if (isAdminRole(currentUserRole) || currentUserRole === "box_office_staff") {
    return true;
  }
  return resourceUserId === currentUserId;
}
