import { NextResponse } from "next/server";
import { toggleMatchSalesStatus } from "@/services/admin";

export async function POST(req: Request) {
  try {
    const { matchId, salesOpen } = await req.json();
    if (!matchId || typeof salesOpen !== "boolean") {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
    }

    const res = await toggleMatchSalesStatus(matchId, salesOpen);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
