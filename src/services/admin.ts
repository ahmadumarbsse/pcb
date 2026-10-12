import { getDb } from "@/db";
import {
  matches,
  venues,
  orders,
  tickets,
  seatHolds,
  groupInquiries,
  promotionalCodes,
  users,
  stands,
  seats,
  orderItems,
  ticketCategories,
} from "@/db/schema";
import { eq, desc, and, gt, sql } from "drizzle-orm";

export async function getAdminKpis() {
  const db = getDb();
  const now = new Date();

  // Total Gross Revenue in PKR
  const revenueResult = await db
    .select({
      totalRevenue: sql<number>`coalesce(sum(${orders.totalAmountPkr}), 0)`,
      totalOrders: sql<number>`count(${orders.id})`,
    })
    .from(orders)
    .where(eq(orders.status, "PAID"));

  // Total Tickets Issued
  const ticketsResult = await db
    .select({
      totalIssued: sql<number>`count(${tickets.id})`,
    })
    .from(tickets)
    .where(eq(tickets.status, "ISSUED"));

  // Active Seat Holds
  const holdsResult = await db
    .select({
      activeHolds: sql<number>`count(${seatHolds.id})`,
    })
    .from(seatHolds)
    .where(and(eq(seatHolds.status, "ACTIVE"), gt(seatHolds.expiresAt, now)));

  // Pending Group Inquiries
  const inquiriesResult = await db
    .select({
      newInquiries: sql<number>`count(${groupInquiries.id})`,
    })
    .from(groupInquiries)
    .where(eq(groupInquiries.status, "NEW"));

  // Total Matches
  const matchesCountResult = await db
    .select({
      totalMatches: sql<number>`count(${matches.id})`,
    })
    .from(matches);

  return {
    totalRevenuePkr: Number(revenueResult[0]?.totalRevenue || 0),
    totalOrders: Number(revenueResult[0]?.totalOrders || 0),
    totalTicketsIssued: Number(ticketsResult[0]?.totalIssued || 0),
    activeHolds: Number(holdsResult[0]?.activeHolds || 0),
    pendingInquiries: Number(inquiriesResult[0]?.newInquiries || 0),
    totalMatches: Number(matchesCountResult[0]?.totalMatches || 0),
  };
}

export async function getAllMatchesForAdmin() {
  const db = getDb();

  return await db
    .select({
      id: matches.id,
      title: matches.title,
      homeTeam: matches.homeTeam,
      awayTeam: matches.awayTeam,
      format: matches.format,
      matchDate: matches.matchDate,
      startTime: matches.startTime,
      status: matches.status,
      salesOpen: matches.salesOpen,
      ticketLimitPerUser: matches.ticketLimitPerUser,
      venueName: venues.name,
      venueCity: venues.city,
    })
    .from(matches)
    .innerJoin(venues, eq(matches.venueId, venues.id))
    .orderBy(desc(matches.matchDate));
}

export async function toggleMatchSalesStatus(matchId: string, salesOpen: boolean) {
  const db = getDb();
  await db.update(matches).set({ salesOpen }).where(eq(matches.id, matchId));
  return { success: true, matchId, salesOpen };
}

export async function getAdminOrders(limit = 50) {
  const db = getDb();

  return await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      customerPhone: orders.customerPhone,
      customerCnic: orders.customerCnic,
      totalAmountPkr: orders.totalAmountPkr,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      promoCodeApplied: orders.promoCodeApplied,
      createdAt: orders.createdAt,
      matchTitle: matches.title,
    })
    .from(orders)
    .innerJoin(matches, eq(orders.matchId, matches.id))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}

export async function getAdminInquiries() {
  const db = getDb();

  return await db
    .select({
      id: groupInquiries.id,
      organizationName: groupInquiries.organizationName,
      contactName: groupInquiries.contactName,
      email: groupInquiries.email,
      phone: groupInquiries.phone,
      requestedQuantity: groupInquiries.requestedQuantity,
      categoryPreference: groupInquiries.categoryPreference,
      organizationType: groupInquiries.organizationType,
      status: groupInquiries.status,
      notes: groupInquiries.notes,
      adminQuotationNotes: groupInquiries.adminQuotationNotes,
      createdAt: groupInquiries.createdAt,
      matchTitle: matches.title,
    })
    .from(groupInquiries)
    .leftJoin(matches, eq(groupInquiries.matchId, matches.id))
    .orderBy(desc(groupInquiries.createdAt));
}

export async function updateInquiryStatus(inquiryId: string, status: string, notes?: string) {
  const db = getDb();

  await db
    .update(groupInquiries)
    .set({
      status,
      ...(notes !== undefined ? { adminQuotationNotes: notes } : {}),
      updatedAt: new Date(),
    })
    .where(eq(groupInquiries.id, inquiryId));

  return { success: true, inquiryId, status };
}

export async function getAdminPromos() {
  const db = getDb();

  return await db
    .select()
    .from(promotionalCodes)
    .orderBy(desc(promotionalCodes.createdAt));
}

export async function createPromoCode(data: {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmountPkr?: number;
  maxDiscountPkr?: number;
  usageLimit?: number;
  validUntil: Date;
}) {
  const db = getDb();
  const id = `promo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  await db.insert(promotionalCodes).values({
    id,
    code: data.code.toUpperCase().trim(),
    discountType: data.discountType,
    discountValue: data.discountValue,
    minOrderAmountPkr: data.minOrderAmountPkr || 0,
    maxDiscountPkr: data.maxDiscountPkr || null,
    usageLimit: data.usageLimit || 1000,
    usedCount: 0,
    validFrom: new Date(),
    validUntil: data.validUntil,
    isActive: true,
  });

  return { success: true, id, code: data.code.toUpperCase().trim() };
}

export async function getAdminUsers(limit = 100) {
  const db = getDb();

  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      phoneNumber: users.phoneNumber,
      cnic: users.cnic,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
}
