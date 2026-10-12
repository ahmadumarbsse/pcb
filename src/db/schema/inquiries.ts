import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { matches } from "./matches";

export const groupInquiries = pgTable("group_inquiries", {
  id: text("id").primaryKey(),
  organizationName: text("organization_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  matchId: text("match_id").references(() => matches.id, { onDelete: "set null" }),
  requestedQuantity: integer("requested_quantity").notNull(),
  categoryPreference: varchar("category_preference", { length: 50 }).notNull(), // VIP, HOSPITALITY, PREMIUM, GENERAL
  organizationType: varchar("organization_type", { length: 50 }).notNull(), // CORPORATE, SCHOOL, CRICKET_CLUB, COMMUNITY
  status: varchar("status", { length: 30 }).default("NEW").notNull(), // "NEW", "CONTACTED", "QUOTED", "CONFIRMED", "DECLINED"
  notes: text("notes"),
  adminQuotationNotes: text("admin_quotation_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
