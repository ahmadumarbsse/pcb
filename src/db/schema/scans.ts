import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tickets } from "./tickets";
import { matches } from "./matches";

export const gateScans = pgTable("gate_scans", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").references(() => tickets.id, { onDelete: "set null" }),
  matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "restrict" }),
  scannedByUserId: text("scanned_by_user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  gateName: varchar("gate_name", { length: 50 }).notNull(),
  scanResult: varchar("scan_result", { length: 40 }).notNull(), // "VALID", "ALREADY_USED", "INVALID_TOKEN", "WRONG_MATCH", "WRONG_GATE", "CANCELLED_TICKET"
  rejectionReason: text("rejection_reason"),
  deviceInfo: text("device_info"),
  rawTokenScanned: text("raw_token_scanned"),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
});
