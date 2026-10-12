import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const venues = pgTable("venues", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  imageUrl: text("image_url"),
  description: text("description").notNull(),
  rules: text("rules"),
  gatesInfo: text("gates_info"),
  accessibilityInfo: text("accessibility_info"),
  parkingInfo: text("parking_info"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stands = pgTable("stands", {
  id: text("id").primaryKey(),
  venueId: text("venue_id").notNull().references(() => venues.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. "Wasim Akram Enclosure", "Fazal Mahmood Stand"
  code: varchar("code", { length: 20 }).notNull(),
  tier: varchar("tier", { length: 30 }).default("GENERAL").notNull(), // VIP, PREMIUM, FIRST_CLASS, GENERAL, HOSPITALITY
  gateNumber: varchar("gate_number", { length: 20 }).notNull(), // e.g. "Gate 4", "Gate 10"
  capacity: integer("capacity").notNull(),
  isReservedSeating: boolean("is_reserved_seating").default(true).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sections = pgTable("sections", {
  id: text("id").primaryKey(),
  standId: text("stand_id").notNull().references(() => stands.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(), // e.g. "Upper Tier A", "Lower Tier B"
  code: varchar("code", { length: 20 }).notNull(),
  capacity: integer("capacity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rows = pgTable("rows", {
  id: text("id").primaryKey(),
  sectionId: text("section_id").notNull().references(() => sections.id, { onDelete: "cascade" }),
  rowNumber: varchar("row_number", { length: 10 }).notNull(), // e.g. "A", "B", "1", "2"
  capacity: integer("capacity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const seats = pgTable("seats", {
  id: text("id").primaryKey(),
  rowId: text("row_id").notNull().references(() => rows.id, { onDelete: "cascade" }),
  standId: text("stand_id").notNull().references(() => stands.id, { onDelete: "cascade" }),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(), // e.g. "1", "2", "15"
  seatCode: varchar("seat_code", { length: 50 }).notNull(), // e.g. "WA-A-1"
  isWheelchairAccessible: boolean("is_wheelchair_accessible").default(false).notNull(),
  isVip: boolean("is_vip").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
