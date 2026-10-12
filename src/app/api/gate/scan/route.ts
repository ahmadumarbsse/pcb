import { NextResponse } from "next/server";
import { processGateScan } from "@/services/gate-scanner";
import { z } from "zod";

const scanSchema = z.object({
  tokenOrTicketNumber: z.string().min(1),
  matchId: z.string().min(1),
  gateName: z.string().min(1),
  deviceInfo: z.string().optional(),
  staffUserId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = scanSchema.parse(body);

    const result = await processGateScan(validated);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, result: "ERROR", message: err.message || "Failed to process turnstile scan" },
      { status: 400 }
    );
  }
}
