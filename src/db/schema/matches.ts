import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { venues, stands, seats } from "./venues";
import { users } from "./users";

export const series = pgTable("series", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // e.g. "England Tour of Pakistan 2026"
  code: varchar("code", { length: 50 }).notNull().unique(),
  format: varchar("format", { length: 20 }).notNull(), // TEST, ODI, T20I, MULTI_FORMAT
  season: varchar("season", { length: 20 }).notNull(), // "2026-27"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: text("id").primaryKey(),
  seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
  venueId: text("venue_id").notNull().references(() => venues.id, { onDelete: "restrict" }),
  matchNumber: integer("match_number").default(1).notNull(),
  title: text("title").notNull(), // "1st T20I: Pakistan vs England"
  homeTeam: text("home_team").notNull(), // "Pakistan"
  awayTeam: text("away_team").notNull(), // "England"
  homeTeamCode: varchar("home_team_code", { length: 10 }).notNull(), // "PAK"
  awayTeamCode: varchar("away_team_code", { length: 10 }).notNull(), // "ENG"
  format: varchar("format", { length: 20 }).notNull(), // "TEST", "ODI", "T20I", "DOMESTIC"
  matchDate: timestamp("match_date").notNull(),
  startTime: varchar("start_time", { length: 20 }).notNull(), // "19:00"
  status: varchar("status", { length: 20 }).default("UPCOMING").notNull(), // "UPCOMING", "LIVE", "COMPLETED", "POSTPONED", "CANCELLED"
  salesOpen: boolean("sales_open").default(true).notNull(),
  salesOpensAt: timestamp("sales_opens_at"),
  salesClosesAt: timestamp("sales_closes_at"),
  ticketLimitPerUser: integer("ticket_limit_per_user").default(6).notNull(),
  refundPolicyNotes: text("refund_policy_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketCategories = pgTable("ticket_categories", {
  id: text("id").primaryKey(),
  matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  standId: text("stand_id").notNull().references(() => stands.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. "Wasim Akram VIP", "Fazal Mahmood Premium", "General Enclosure"
  tier: varchar("tier", { length: 30 }).notNull(), // VIP, PREMIUM, FIRST_CLASS, GENERAL, HOSPITALITY
  pricePkr: integer("price_pkr").notNull(), // Integer currency in PKR (e.g. 1500)
  totalQuota: integer("total_quota").notNull(),
  availableQuota: integer("available_quota").notNull(),
  salesStatus: varchar("sales_status", { length: 30 }).default("ON_SALE").notNull(), // "ON_SALE", "FAST_SELLING", "SOLD_OUT", "PAUSED"
  perksDescription: text("perks_description"), // e.g. "Includes snacks, cushioned seating, air-conditioned lounge access"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const seatHolds = pgTable("seat_holds", {
  id: text("id").primaryKey(),
  matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  seatId: text("seat_id").references(() => seats.id, { onDelete: "cascade" }),
  categoryId: text("category_id").notNull().references(() => ticketCategories.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  holdToken: text("hold_token").notNull().unique(), // UUID or signed token held by client session
  expiresAt: timestamp("expires_at").notNull(),
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(), // "ACTIVE", "CONFIRMED", "EXPIRED", "RELEASED"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
