import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "restrict" }),
  provider: varchar("provider", { length: 50 }).notNull(), // "SANDBOX", "JAZZCASH", "EASYPAISA", "STRIPE_CARD"
  transactionReference: varchar("transaction_reference", { length: 100 }).unique(),
  amountPkr: integer("amount_pkr").notNull(),
  currency: varchar("currency", { length: 10 }).default("PKR").notNull(),
  status: varchar("status", { length: 30 }).default("INITIATED").notNull(), // "INITIATED", "PENDING", "SUCCESS", "FAILED", "EXPIRED", "REFUNDED"
  idempotencyKey: text("idempotency_key").unique(),
  providerResponseRaw: text("provider_response_raw"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const paymentEvents = pgTable("payment_events", {
  id: text("id").primaryKey(),
  paymentId: text("payment_id").references(() => payments.id, { onDelete: "cascade" }),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 50 }).notNull(), // "WEBHOOK_PAYMENT_SUCCESS", "WEBHOOK_PAYMENT_FAILED", "RECONCILIATION"
  payloadRaw: text("payload_raw").notNull(),
  signatureVerified: boolean("signature_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
