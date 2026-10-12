import { NextResponse } from "next/server";
import { searchBoxOfficeRecords } from "@/services/box-office";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const results = await searchBoxOfficeRecords(q);
    return NextResponse.json({ success: true, ...results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
