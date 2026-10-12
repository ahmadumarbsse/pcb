import { getDb } from "@/db";
import { orders, orderItems, tickets, matches, venues, ticketCategories, seats } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getUserTickets(userId: string) {
  const db = getDb();

  const userTickets = await db
    .select({
      id: tickets.id,
      ticketNumber: tickets.ticketNumber,
      orderId: tickets.orderId,
      holderName: tickets.holderName,
      holderCnic: tickets.holderCnic,
      qrSignatureToken: tickets.qrSignatureToken,
      status: tickets.status,
      gateAssigned: tickets.gateAssigned,
      issuedAt: tickets.issuedAt,
      matchId: matches.id,
      matchTitle: matches.title,
      homeTeam: matches.homeTeam,
      awayTeam: matches.awayTeam,
      format: matches.format,
      matchDate: matches.matchDate,
      startTime: matches.startTime,
      venueName: venues.name,
      city: venues.city,
      categoryName: ticketCategories.name,
      tier: ticketCategories.tier,
      pricePkr: ticketCategories.pricePkr,
      seatNumber: seats.seatNumber,
      seatCode: seats.seatCode,
    })
    .from(tickets)
    .innerJoin(matches, eq(tickets.matchId, matches.id))
    .innerJoin(venues, eq(matches.venueId, venues.id))
    .innerJoin(ticketCategories, eq(tickets.ticketCategoryId, ticketCategories.id))
    .leftJoin(seats, eq(tickets.seatId, seats.id))
    .where(eq(tickets.userId, userId))
    .orderBy(desc(tickets.issuedAt));

  return userTickets;
}

export async function getUserOrders(userId: string) {
  const db = getDb();

  const userOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      customerPhone: orders.customerPhone,
      totalAmountPkr: orders.totalAmountPkr,
      discountAmountPkr: orders.discountAmountPkr,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      matchTitle: matches.title,
      matchDate: matches.matchDate,
      venueName: venues.name,
    })
    .from(orders)
    .innerJoin(matches, eq(orders.matchId, matches.id))
    .innerJoin(venues, eq(matches.venueId, venues.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  return userOrders;
}
