import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const promotionalCodes = pgTable("promotional_codes", {
  id: text("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(), // e.g. "PCB2026", "EARLYBIRD"
  discountType: varchar("discount_type", { length: 20 }).notNull(), // "PERCENTAGE", "FIXED_AMOUNT"
  discountValue: integer("discount_value").notNull(), // e.g. 15 (for 15%) or 500 (for PKR 500 off)
  minOrderAmountPkr: integer("min_order_amount_pkr").default(0).notNull(),
  maxDiscountPkr: integer("max_discount_pkr"), // Optional cap for percentage discounts
  usageLimit: integer("usage_limit").default(1000).notNull(),
  usedCount: integer("used_count").default(0).notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
