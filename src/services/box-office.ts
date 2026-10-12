import { getDb } from "@/db";
import {
  matches,
  venues,
  stands,
  seats,
  ticketCategories,
  orders,
  orderItems,
  tickets,
  users,
} from "@/db/schema";
import { eq, or, like, desc, sql } from "drizzle-orm";
import crypto from "crypto";

export async function searchBoxOfficeRecords(query: string) {
  if (!query || query.trim().length < 2) {
    return { tickets: [], orders: [] };
  }

  const db = getDb();
  const cleanQ = query.trim();
  const searchPattern = `%${cleanQ}%`;

  // Search in tickets
  const matchingTickets = await db
    .select({
      id: tickets.id,
      ticketNumber: tickets.ticketNumber,
      holderName: tickets.holderName,
      holderCnic: tickets.holderCnic,
      status: tickets.status,
      gateAssigned: tickets.gateAssigned,
      qrSignatureToken: tickets.qrSignatureToken,
      issuedAt: tickets.issuedAt,
      scannedAt: tickets.scannedAt,
      matchTitle: matches.title,
      matchDate: matches.matchDate,
      categoryName: ticketCategories.name,
      seatNumber: seats.seatNumber,
      seatCode: seats.seatCode,
    })
    .from(tickets)
    .innerJoin(matches, eq(tickets.matchId, matches.id))
    .innerJoin(ticketCategories, eq(tickets.ticketCategoryId, ticketCategories.id))
    .leftJoin(seats, eq(tickets.seatId, seats.id))
    .where(
      or(
        like(tickets.ticketNumber, searchPattern),
        like(tickets.holderName, searchPattern),
        like(tickets.holderCnic, searchPattern)
      )
    )
    .limit(20);

  // Search in orders
  const matchingOrders = await db
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
      createdAt: orders.createdAt,
      matchTitle: matches.title,
    })
    .from(orders)
    .innerJoin(matches, eq(orders.matchId, matches.id))
    .where(
      or(
        like(orders.orderNumber, searchPattern),
        like(orders.customerName, searchPattern),
        like(orders.customerPhone, searchPattern),
        like(orders.customerCnic, searchPattern)
      )
    )
    .limit(20);

  return { tickets: matchingTickets, orders: matchingOrders };
}

export interface IssueWalkInTicketInput {
  matchId: string;
  categoryId: string;
  seatId?: string;
  customerName: string;
  customerCnic?: string;
  customerPhone?: string;
  paymentMethod: "CASH" | "POS_CARD" | "DIGITAL_WALLET";
  staffUserId?: string;
}

export async function issueWalkInTicket(input: IssueWalkInTicketInput) {
  const db = getDb();

  // Get match & category info
  const catResult = await db
    .select({
      category: ticketCategories,
      match: matches,
      stand: stands,
    })
    .from(ticketCategories)
    .innerJoin(matches, eq(ticketCategories.matchId, matches.id))
    .innerJoin(stands, eq(ticketCategories.standId, stands.id))
    .where(eq(ticketCategories.id, input.categoryId))
    .limit(1);

  if (!catResult.length) {
    throw new Error("Ticket category or fixture not found");
  }

  const { category, match, stand } = catResult[0];

  // Default box office staff user ID
  let userId = input.staffUserId;
  if (!userId) {
    const staffUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "box_office_staff"))
      .limit(1);
    userId = staffUser[0]?.id || "usr-boxoffice";
  }

  const orderId = `ord-box-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const orderNumber = `PCB-BOX-${Math.floor(100000 + Math.random() * 900000)}`;
  const ticketId = `tck-box-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const ticketNumber = `TCK-BOX-${Math.floor(100000 + Math.random() * 900000)}`;

  // Generate HMAC signature token for QR pass
  const signingSecret = process.env.TICKET_SIGNING_SECRET || "pcb_dev_ticket_hmac_signing_secret_998877";
  const signaturePayload = `${ticketNumber}:${input.matchId}:${stand.gateNumber}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", signingSecret).update(signaturePayload).digest("hex");
  const qrSignatureToken = `PCB_SECURE_PASS_${ticketNumber}_${hmac.slice(0, 24)}`;

  // 1. Insert order
  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    userId: userId,
    matchId: input.matchId,
    customerName: input.customerName,
    customerEmail: `${input.customerPhone || "counter"}@boxoffice.local`,
    customerPhone: input.customerPhone || "Walk-in Desk",
    customerCnic: input.customerCnic || null,
    totalAmountPkr: category.pricePkr,
    subtotalAmountPkr: category.pricePkr,
    discountAmountPkr: 0,
    feesAmountPkr: 0,
    status: "PAID",
    paymentMethod: input.paymentMethod,
  });

  // 2. Insert order item
  await db.insert(orderItems).values({
    id: `item-${Date.now()}`,
    orderId,
    ticketCategoryId: category.id,
    seatId: input.seatId || null,
    unitPricePkr: category.pricePkr,
    quantity: 1,
    attendeeName: input.customerName,
    attendeeCnic: input.customerCnic || null,
  });

  // 3. Insert ticket
  await db.insert(tickets).values({
    id: ticketId,
    ticketNumber,
    orderId,
    matchId: input.matchId,
    ticketCategoryId: category.id,
    seatId: input.seatId || null,
    userId: userId,
    holderName: input.customerName,
    holderCnic: input.customerCnic || null,
    qrSignatureToken,
    status: "ISSUED",
    gateAssigned: stand.gateNumber,
  });

  return {
    success: true,
    orderNumber,
    ticketNumber,
    qrSignatureToken,
    customerName: input.customerName,
    matchTitle: match.title,
    gateAssigned: stand.gateNumber,
    enclosure: category.name,
    amountPkr: category.pricePkr,
    issuedAt: new Date().toISOString(),
  };
}

export async function getBoxOfficeRecentTickets(limit = 20) {
  const db = getDb();

  return await db
    .select({
      id: tickets.id,
      ticketNumber: tickets.ticketNumber,
      holderName: tickets.holderName,
      holderCnic: tickets.holderCnic,
      status: tickets.status,
      gateAssigned: tickets.gateAssigned,
      qrSignatureToken: tickets.qrSignatureToken,
      issuedAt: tickets.issuedAt,
      matchTitle: matches.title,
      categoryName: ticketCategories.name,
      pricePkr: ticketCategories.pricePkr,
    })
    .from(tickets)
    .innerJoin(matches, eq(tickets.matchId, matches.id))
    .innerJoin(ticketCategories, eq(tickets.ticketCategoryId, ticketCategories.id))
    .orderBy(desc(tickets.issuedAt))
    .limit(limit);
}
