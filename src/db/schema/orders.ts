import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { matches, ticketCategories } from "./matches";
import { seats } from "./venues";

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 30 }).notNull().unique(), // e.g. "PCB-2026-X892K"
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "restrict" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerCnic: varchar("customer_cnic", { length: 20 }),
  totalAmountPkr: integer("total_amount_pkr").notNull(), // Integer PKR
  subtotalAmountPkr: integer("subtotal_amount_pkr").notNull(),
  discountAmountPkr: integer("discount_amount_pkr").default(0).notNull(),
  feesAmountPkr: integer("fees_amount_pkr").default(0).notNull(),
  status: varchar("status", { length: 30 }).default("PENDING").notNull(), // "PENDING", "PAID", "FAILED", "CANCELLED", "PARTIALLY_REFUNDED", "REFUNDED"
  paymentMethod: varchar("payment_method", { length: 50 }), // "CARD", "JAZZCASH", "EASYPAISA", "SANDBOX"
  promoCodeApplied: varchar("promo_code_applied", { length: 50 }),
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  ticketCategoryId: text("ticket_category_id").notNull().references(() => ticketCategories.id, { onDelete: "restrict" }),
  seatId: text("seat_id").references(() => seats.id, { onDelete: "set null" }),
  unitPricePkr: integer("unit_price_pkr").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  attendeeName: text("attendee_name").notNull(),
  attendeeCnic: varchar("attendee_cnic", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
