import { NextResponse } from "next/server";
import { createSeatHold, releaseSeatHold } from "@/services/bookings";
import { z } from "zod";

const holdRequestSchema = z.object({
  matchId: z.string().min(1),
  categoryId: z.string().min(1),
  seatIds: z.array(z.string()).optional(),
  quantity: z.number().int().min(1).max(10).optional(),
  userId: z.string().optional(),
  holdToken: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = holdRequestSchema.parse(body);

    const result = await createSeatHold(validated);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create seat hold" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const holdToken = searchParams.get("holdToken");

    if (!holdToken) {
      return NextResponse.json(
        { success: false, error: "holdToken is required to release hold" },
        { status: 400 }
      );
    }

    const result = await releaseSeatHold(holdToken);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to release seat hold" },
      { status: 500 }
    );
  }
}
