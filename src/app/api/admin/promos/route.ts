import { NextResponse } from "next/server";
import { getAdminPromos, createPromoCode } from "@/services/admin";

export async function GET() {
  try {
    const promos = await getAdminPromos();
    return NextResponse.json({ success: true, promos });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountType, discountValue, minOrderAmountPkr, maxDiscountPkr, usageLimit, validUntil } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ success: false, error: "Missing required promo code fields" }, { status: 400 });
    }

    const res = await createPromoCode({
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmountPkr: Number(minOrderAmountPkr) || 0,
      maxDiscountPkr: maxDiscountPkr ? Number(maxDiscountPkr) : undefined,
      usageLimit: Number(usageLimit) || 1000,
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
