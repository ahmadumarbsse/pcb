import { NextResponse } from "next/server";
import { getStandSeatsWithStatus } from "@/services/bookings";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get("matchId");
    const standId = searchParams.get("standId");

    if (!matchId || !standId) {
      return NextResponse.json(
        { success: false, error: "Missing matchId or standId" },
        { status: 400 }
      );
    }

    const seats = await getStandSeatsWithStatus(matchId, standId);
    return NextResponse.json({ success: true, seats });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch seat map" },
      { status: 500 }
    );
  }
}
