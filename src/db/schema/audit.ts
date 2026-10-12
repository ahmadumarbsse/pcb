import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  userEmail: text("user_email").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // e.g. "USER_ROLE_UPDATED", "PRICE_CHANGED", "REFUND_APPROVED", "GATE_ENTRY"
  entityType: varchar("entity_type", { length: 50 }).notNull(), // "ORDER", "MATCH", "TICKET", "USER", "VENUE"
  entityId: text("entity_id"),
  detailsJson: text("details_json"), // JSON stringified details of what changed
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
