import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { orders } from "./orders";
import { matches, ticketCategories } from "./matches";
import { seats } from "./venues";

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  ticketNumber: varchar("ticket_number", { length: 40 }).notNull().unique(), // e.g. "TCK-GDF-789012"
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "restrict" }),
  matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "restrict" }),
  ticketCategoryId: text("ticket_category_id").notNull().references(() => ticketCategories.id, { onDelete: "restrict" }),
  seatId: text("seat_id").references(() => seats.id, { onDelete: "set null" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  holderName: text("holder_name").notNull(),
  holderCnic: varchar("holder_cnic", { length: 20 }),
  qrSignatureToken: text("qr_signature_token").notNull().unique(), // Tamper-resistant HMAC-signed token
  status: varchar("status", { length: 30 }).default("ISSUED").notNull(), // "ISSUED", "SCANNED", "CANCELLED", "REFUNDED", "TRANSFERRED"
  gateAssigned: varchar("gate_assigned", { length: 30 }),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  scannedAt: timestamp("scanned_at"),
  cancelledAt: timestamp("cancelled_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketTransfers = pgTable("ticket_transfers", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  fromUserId: text("from_user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  toUserId: text("to_user_id").references(() => users.id, { onDelete: "set null" }),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientCnic: varchar("recipient_cnic", { length: 20 }),
  status: varchar("status", { length: 30 }).default("PENDING").notNull(), // "PENDING", "ACCEPTED", "REVOKED", "EXPIRED"
  transferToken: text("transfer_token").notNull().unique(),
  transferredAt: timestamp("transferred_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
});
