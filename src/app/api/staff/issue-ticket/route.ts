import { NextResponse } from "next/server";
import { issueWalkInTicket } from "@/services/box-office";
import { z } from "zod";

const issueTicketSchema = z.object({
  matchId: z.string().min(1),
  categoryId: z.string().min(1),
  seatId: z.string().optional(),
  customerName: z.string().min(2),
  customerCnic: z.string().optional(),
  customerPhone: z.string().optional(),
  paymentMethod: z.enum(["CASH", "POS_CARD", "DIGITAL_WALLET"]),
  staffUserId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = issueTicketSchema.parse(body);

    const result = await issueWalkInTicket(validated);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to issue ticket" },
      { status: 400 }
    );
  }
}
