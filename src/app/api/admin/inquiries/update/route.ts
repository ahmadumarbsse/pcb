import { NextResponse } from "next/server";
import { updateInquiryStatus } from "@/services/admin";

export async function POST(req: Request) {
  try {
    const { inquiryId, status, notes } = await req.json();
    if (!inquiryId || !status) {
      return NextResponse.json({ success: false, error: "Missing inquiryId or status" }, { status: 400 });
    }

    const res = await updateInquiryStatus(inquiryId, status, notes);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
