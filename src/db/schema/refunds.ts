import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { orders } from "./orders";
import { tickets } from "./tickets";

export const refundRequests = pgTable("refund_requests", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "restrict" }),
  ticketId: text("ticket_id").references(() => tickets.id, { onDelete: "set null" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  amountPkr: integer("amount_pkr").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 30 }).default("REQUESTED").notNull(), // "REQUESTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "PROCESSED"
  adminNotes: text("admin_notes"),
  reviewedByUserId: text("reviewed_by_user_id").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
