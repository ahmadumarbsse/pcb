import { getDb } from "@/db";
import {
  matches,
  venues,
  stands,
  seats,
  rows,
  sections,
  ticketCategories,
  seatHolds,
  tickets,
  promotionalCodes,
} from "@/db/schema";
import { eq, and, gt, inArray, sql } from "drizzle-orm";
import crypto from "crypto";

export interface SeatWithStatus {
  id: string;
  seatNumber: string;
  seatCode: string;
  rowNumber: string;
  sectionName: string;
  standId: string;
  isWheelchairAccessible: boolean;
  isVip: boolean;
  status: "AVAILABLE" | "HELD" | "BOOKED" | "BLOCKED";
}

export async function getMatchBookingData(matchId: string) {
  const db = getDb();

  const matchData = await db
    .select({
      id: matches.id,
      title: matches.title,
      homeTeam: matches.homeTeam,
      awayTeam: matches.awayTeam,
      homeTeamCode: matches.homeTeamCode,
      awayTeamCode: matches.awayTeamCode,
      format: matches.format,
      matchDate: matches.matchDate,
      startTime: matches.startTime,
      status: matches.status,
      salesOpen: matches.salesOpen,
      ticketLimitPerUser: matches.ticketLimitPerUser,
      venueId: matches.venueId,
      venueName: venues.name,
      venueCity: venues.city,
      venueAddress: venues.address,
    })
    .from(matches)
    .innerJoin(venues, eq(matches.venueId, venues.id))
    .where(eq(matches.id, matchId))
    .limit(1);

  if (!matchData.length) {
    return null;
  }

  const match = matchData[0];

  // Get categories for this match
  const categories = await db
    .select({
      id: ticketCategories.id,
      standId: ticketCategories.standId,
      name: ticketCategories.name,
      tier: ticketCategories.tier,
      pricePkr: ticketCategories.pricePkr,
      totalQuota: ticketCategories.totalQuota,
      availableQuota: ticketCategories.availableQuota,
      salesStatus: ticketCategories.salesStatus,
      perksDescription: ticketCategories.perksDescription,
      standName: stands.name,
      standCode: stands.code,
      gateNumber: stands.gateNumber,
      isReservedSeating: stands.isReservedSeating,
    })
    .from(ticketCategories)
    .innerJoin(stands, eq(ticketCategories.standId, stands.id))
    .where(eq(ticketCategories.matchId, matchId));

  // Get all stands for this venue
  const venueStands = await db
    .select()
    .from(stands)
    .where(eq(stands.venueId, match.venueId));

  return {
    match,
    categories,
    stands: venueStands,
  };
}

export async function getStandSeatsWithStatus(matchId: string, standId: string): Promise<SeatWithStatus[]> {
  const db = getDb();
  const now = new Date();

  // 1. Fetch seats in this stand
  const allSeats = await db
    .select({
      id: seats.id,
      seatNumber: seats.seatNumber,
      seatCode: seats.seatCode,
      isWheelchairAccessible: seats.isWheelchairAccessible,
      isVip: seats.isVip,
      isActive: seats.isActive,
      standId: seats.standId,
      rowNumber: rows.rowNumber,
      sectionName: sections.name,
    })
    .from(seats)
    .innerJoin(rows, eq(seats.rowId, rows.id))
    .innerJoin(sections, eq(rows.sectionId, sections.id))
    .where(eq(seats.standId, standId));

  if (!allSeats.length) {
    return [];
  }

  const seatIds = allSeats.map((s) => s.id);

  // 2. Fetch active holds for this match
  const activeHolds = await db
    .select({ seatId: seatHolds.seatId })
    .from(seatHolds)
    .where(
      and(
        eq(seatHolds.matchId, matchId),
        eq(seatHolds.status, "ACTIVE"),
        gt(seatHolds.expiresAt, now),
        inArray(seatHolds.seatId, seatIds)
      )
    );

  const heldSeatIdSet = new Set(activeHolds.map((h) => h.seatId).filter(Boolean));

  // 3. Fetch sold tickets for this match
  const soldTickets = await db
    .select({ seatId: tickets.seatId })
    .from(tickets)
    .where(
      and(
        eq(tickets.matchId, matchId),
        eq(tickets.status, "ISSUED"),
        inArray(tickets.seatId, seatIds)
      )
    );

  const soldSeatIdSet = new Set(soldTickets.map((t) => t.seatId).filter(Boolean));

  return allSeats.map((s) => {
    let status: SeatWithStatus["status"] = "AVAILABLE";
    if (!s.isActive) {
      status = "BLOCKED";
    } else if (soldSeatIdSet.has(s.id)) {
      status = "BOOKED";
    } else if (heldSeatIdSet.has(s.id)) {
      status = "HELD";
    }

    return {
      id: s.id,
      seatNumber: s.seatNumber,
      seatCode: s.seatCode,
      rowNumber: s.rowNumber,
      sectionName: s.sectionName,
      standId: s.standId,
      isWheelchairAccessible: s.isWheelchairAccessible,
      isVip: s.isVip,
      status,
    };
  });
}

export interface CreateHoldInput {
  matchId: string;
  categoryId: string;
  seatIds?: string[];
  quantity?: number;
  userId?: string;
  holdToken?: string;
}

export async function createSeatHold(input: CreateHoldInput) {
  const db = getDb();
  const now = new Date();
  const holdDurationMinutes = 10;
  const expiresAt = new Date(now.getTime() + holdDurationMinutes * 60 * 1000);
  const token = input.holdToken || crypto.randomUUID();

  // Validate match sales status & ticket limit
  const matchResult = await db
    .select()
    .from(matches)
    .where(eq(matches.id, input.matchId))
    .limit(1);

  if (!matchResult.length) {
    throw new Error("Match not found");
  }

  const match = matchResult[0];
  if (!match.salesOpen) {
    throw new Error("Ticket sales for this match are currently closed");
  }

  const seatIds = input.seatIds || [];
  const requestedQuantity = seatIds.length || input.quantity || 1;

  if (requestedQuantity > match.ticketLimitPerUser) {
    throw new Error(`Maximum ${match.ticketLimitPerUser} tickets allowed per user for this fixture`);
  }

  // If specific seats requested, ensure they are available
  if (seatIds.length > 0) {
    // Check if any seat is already booked
    const booked = await db
      .select({ seatId: tickets.seatId })
      .from(tickets)
      .where(
        and(
          eq(tickets.matchId, input.matchId),
          eq(tickets.status, "ISSUED"),
          inArray(tickets.seatId, seatIds)
        )
      );

    if (booked.length > 0) {
      throw new Error("One or more selected seats have already been booked. Please pick another seat.");
    }

    // Check if any seat is already held by someone else
    const currentlyHeld = await db
      .select({ seatId: seatHolds.seatId, holdToken: seatHolds.holdToken })
      .from(seatHolds)
      .where(
        and(
          eq(seatHolds.matchId, input.matchId),
          eq(seatHolds.status, "ACTIVE"),
          gt(seatHolds.expiresAt, now),
          inArray(seatHolds.seatId, seatIds)
        )
      );

    // If held by another token
    const heldByOthers = currentlyHeld.filter((h) => h.holdToken !== token);
    if (heldByOthers.length > 0) {
      throw new Error("One or more selected seats are currently reserved by another customer.");
    }

    // Release any previous holds with this token
    await db
      .update(seatHolds)
      .set({ status: "RELEASED" })
      .where(eq(seatHolds.holdToken, token));

    // Create fresh holds
    const insertValues = seatIds.map((seatId) => ({
      id: `hold-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      matchId: input.matchId,
      seatId: seatId,
      categoryId: input.categoryId,
      userId: input.userId || null,
      holdToken: token,
      expiresAt: expiresAt,
      status: "ACTIVE",
    }));

    await db.insert(seatHolds).values(insertValues);
  } else {
    // General admission hold
    await db
      .update(seatHolds)
      .set({ status: "RELEASED" })
      .where(eq(seatHolds.holdToken, token));

    const insertValues = Array.from({ length: requestedQuantity }).map(() => ({
      id: `hold-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      matchId: input.matchId,
      seatId: null,
      categoryId: input.categoryId,
      userId: input.userId || null,
      holdToken: token,
      expiresAt: expiresAt,
      status: "ACTIVE",
    }));

    await db.insert(seatHolds).values(insertValues);
  }

  return {
    success: true,
    holdToken: token,
    expiresAt: expiresAt.toISOString(),
    durationMinutes: holdDurationMinutes,
    seatIds,
    quantity: requestedQuantity,
    message: `Reserved ${requestedQuantity} seat(s) for ${holdDurationMinutes} minutes.`,
  };
}

export async function releaseSeatHold(holdToken: string) {
  const db = getDb();
  await db
    .update(seatHolds)
    .set({ status: "RELEASED" })
    .where(eq(seatHolds.holdToken, holdToken));

  return { success: true, message: "Seat hold released" };
}

export async function validatePromoCode(code: string, subtotalPkr: number) {
  const db = getDb();
  const now = new Date();

  const found = await db
    .select()
    .from(promotionalCodes)
    .where(
      and(
        eq(sql`LOWER(${promotionalCodes.code})`, code.toLowerCase().trim()),
        eq(promotionalCodes.isActive, true),
        gt(promotionalCodes.validUntil, now)
      )
    )
    .limit(1);

  if (!found.length) {
    return {
      valid: false,
      message: "Invalid or expired promotional code",
      discountPkr: 0,
    };
  }

  const promo = found[0];

  if (subtotalPkr < promo.minOrderAmountPkr) {
    return {
      valid: false,
      message: `Minimum order amount of PKR ${promo.minOrderAmountPkr.toLocaleString()} required for code ${promo.code}`,
      discountPkr: 0,
    };
  }

  if (promo.usedCount >= promo.usageLimit) {
    return {
      valid: false,
      message: "Promotional code usage limit has been reached",
      discountPkr: 0,
    };
  }

  let discountPkr = 0;
  if (promo.discountType === "PERCENTAGE") {
    discountPkr = Math.round((subtotalPkr * promo.discountValue) / 100);
    if (promo.maxDiscountPkr && discountPkr > promo.maxDiscountPkr) {
      discountPkr = promo.maxDiscountPkr;
    }
  } else {
    // FIXED
    discountPkr = promo.discountValue;
  }

  discountPkr = Math.min(discountPkr, subtotalPkr);

  return {
    valid: true,
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discountPkr,
    message: `Promotional code ${promo.code} applied successfully!`,
  };
}
