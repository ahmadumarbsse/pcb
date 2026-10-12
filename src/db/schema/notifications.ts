import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // "BOOKING_CONFIRMATION", "PAYMENT_FAILED", "REFUND_UPDATE", "MATCH_REMINDER"
  channel: varchar("channel", { length: 20 }).notNull(), // "EMAIL", "SMS"
  recipient: text("recipient").notNull(), // email address or phone number
  subject: text("subject"),
  content: text("content").notNull(),
  status: varchar("status", { length: 30 }).default("PENDING").notNull(), // "PENDING", "SENT", "FAILED"
  retryCount: integer("retry_count").default(0).notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});
