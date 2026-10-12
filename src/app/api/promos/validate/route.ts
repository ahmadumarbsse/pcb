import { NextResponse } from "next/server";
import { validatePromoCode } from "@/services/bookings";

export async function POST(req: Request) {
  try {
    const { code, subtotalPkr } = await req.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Promotional code is required", discountPkr: 0 },
        { status: 400 }
      );
    }

    const result = await validatePromoCode(String(code), Number(subtotalPkr) || 0);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, message: err.message || "Failed to validate promo code", discountPkr: 0 },
      { status: 500 }
    );
  }
}
