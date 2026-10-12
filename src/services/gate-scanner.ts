import { getDb } from "@/db";
import {
  tickets,
  gateScans,
  matches,
  ticketCategories,
  seats,
  users,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export interface ScanPassInput {
  tokenOrTicketNumber: string;
  matchId: string;
  gateName: string;
  deviceInfo?: string;
  staffUserId?: string;
}

export async function processGateScan(input: ScanPassInput) {
  const db = getDb();
  const now = new Date();
  const rawInput = input.tokenOrTicketNumber.trim();

  // Find gate staff user
  let staffId = input.staffUserId;
  if (!staffId) {
    const staffUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "gate_staff"))
      .limit(1);
    staffId = staffUser[0]?.id || "usr-gatestaff";
  }

  // Find ticket by QR signature token or ticket number
  const ticketResult = await db
    .select({
      id: tickets.id,
      ticketNumber: tickets.ticketNumber,
      matchId: tickets.matchId,
      status: tickets.status,
      holderName: tickets.holderName,
      holderCnic: tickets.holderCnic,
      gateAssigned: tickets.gateAssigned,
      scannedAt: tickets.scannedAt,
      categoryName: ticketCategories.name,
      seatNumber: seats.seatNumber,
      seatCode: seats.seatCode,
      matchTitle: matches.title,
    })
    .from(tickets)
    .innerJoin(ticketCategories, eq(tickets.ticketCategoryId, ticketCategories.id))
    .innerJoin(matches, eq(tickets.matchId, matches.id))
    .leftJoin(seats, eq(tickets.seatId, seats.id))
    .where(
      rawInput.startsWith("PCB_SECURE_PASS_")
        ? eq(tickets.qrSignatureToken, rawInput)
        : eq(tickets.ticketNumber, rawInput)
    )
    .limit(1);

  const scanLogId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // 1. Invalid / Unrecognized Token
  if (!ticketResult.length) {
    await db.insert(gateScans).values({
      id: scanLogId,
      ticketId: null,
      matchId: input.matchId,
      scannedByUserId: staffId,
      gateName: input.gateName,
      scanResult: "INVALID_TOKEN",
      rejectionReason: "Unrecognized QR signature token or ticket number",
      deviceInfo: input.deviceInfo || "Handheld Turnstile Scanner",
      rawTokenScanned: rawInput.slice(0, 50),
      scannedAt: now,
    });

    return {
      result: "INVALID_TOKEN",
      success: false,
      message: "DENIED: Fraudulent or unrecognized ticket token.",
    };
  }

  const ticket = ticketResult[0];

  // 2. Wrong Match Check
  if (ticket.matchId !== input.matchId) {
    await db.insert(gateScans).values({
      id: scanLogId,
      ticketId: ticket.id,
      matchId: input.matchId,
      scannedByUserId: staffId,
      gateName: input.gateName,
      scanResult: "WRONG_MATCH",
      rejectionReason: `Ticket is for ${ticket.matchTitle}, not current fixture`,
      deviceInfo: input.deviceInfo || "Handheld Turnstile Scanner",
      rawTokenScanned: rawInput.slice(0, 50),
      scannedAt: now,
    });

    return {
      result: "WRONG_MATCH",
      success: false,
      message: `DENIED: Pass is for fixture "${ticket.matchTitle}".`,
      ticketNumber: ticket.ticketNumber,
      holderName: ticket.holderName,
    };
  }

  // 3. Already Used / Duplicate Turnstile Scan
  if (ticket.status === "SCANNED") {
    await db.insert(gateScans).values({
      id: scanLogId,
      ticketId: ticket.id,
      matchId: input.matchId,
      scannedByUserId: staffId,
      gateName: input.gateName,
      scanResult: "ALREADY_USED",
      rejectionReason: `Turnstile pass-back attempt. Previously scanned at ${ticket.scannedAt?.toLocaleTimeString()}`,
      deviceInfo: input.deviceInfo || "Handheld Turnstile Scanner",
      rawTokenScanned: rawInput.slice(0, 50),
      scannedAt: now,
    });

    return {
      result: "ALREADY_USED",
      success: false,
      message: "DENIED: DUPLICATE SCAN! This pass has already entered the venue.",
      ticketNumber: ticket.ticketNumber,
      holderName: ticket.holderName,
      previousScanTime: ticket.scannedAt?.toLocaleTimeString() || "Earlier today",
    };
  }

  // 4. Cancelled or Refunded
  if (ticket.status === "CANCELLED" || ticket.status === "REFUNDED") {
    await db.insert(gateScans).values({
      id: scanLogId,
      ticketId: ticket.id,
      matchId: input.matchId,
      scannedByUserId: staffId,
      gateName: input.gateName,
      scanResult: "CANCELLED_TICKET",
      rejectionReason: "Ticket cancelled or refunded by box office",
      deviceInfo: input.deviceInfo || "Handheld Turnstile Scanner",
      rawTokenScanned: rawInput.slice(0, 50),
      scannedAt: now,
    });

    return {
      result: "CANCELLED_TICKET",
      success: false,
      message: "DENIED: Ticket was cancelled or refunded.",
      ticketNumber: ticket.ticketNumber,
      holderName: ticket.holderName,
    };
  }

  // 5. Valid Entry -> Mark as SCANNED and record in gate_scans
  await db
    .update(tickets)
    .set({
      status: "SCANNED",
      scannedAt: now,
      updatedAt: now,
    })
    .where(eq(tickets.id, ticket.id));

  await db.insert(gateScans).values({
    id: scanLogId,
    ticketId: ticket.id,
    matchId: input.matchId,
    scannedByUserId: staffId,
    gateName: input.gateName,
    scanResult: "VALID",
    rejectionReason: null,
    deviceInfo: input.deviceInfo || "Handheld Turnstile Scanner",
    rawTokenScanned: rawInput.slice(0, 50),
    scannedAt: now,
  });

  return {
    result: "VALID",
    success: true,
    message: "ACCESS GRANTED: Turnstile unlocked.",
    ticketNumber: ticket.ticketNumber,
    holderName: ticket.holderName,
    holderCnic: ticket.holderCnic,
    categoryName: ticket.categoryName,
    seatCode: ticket.seatCode || ticket.seatNumber || "General Admission",
    gateAssigned: ticket.gateAssigned || input.gateName,
    scannedAt: now.toLocaleTimeString(),
  };
}

export async function getRecentGateScans(limit = 25) {
  const db = getDb();

  return await db
    .select({
      id: gateScans.id,
      scanResult: gateScans.scanResult,
      gateName: gateScans.gateName,
      scannedAt: gateScans.scannedAt,
      rejectionReason: gateScans.rejectionReason,
      matchTitle: matches.title,
      ticketNumber: tickets.ticketNumber,
      holderName: tickets.holderName,
    })
    .from(gateScans)
    .innerJoin(matches, eq(gateScans.matchId, matches.id))
    .leftJoin(tickets, eq(gateScans.ticketId, tickets.id))
    .orderBy(desc(gateScans.scannedAt))
    .limit(limit);
}
