import { NextResponse } from "next/server";
import { submitGroupInquiry, groupInquirySchema } from "@/services/inquiries";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await submitGroupInquiry(body);
    return NextResponse.json(result);
  } catch (err: any) {
    const errorDetails = err?.cause?.message || err?.message || "Failed to process inquiry";
    console.error("Inquiry error detail:", err?.cause || err);
    return NextResponse.json(
      { success: false, error: errorDetails, fullMessage: err?.message },
      { status: 400 }
    );
  }
}
