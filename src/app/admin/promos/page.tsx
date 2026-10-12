import { getAdminPromos } from "@/services/admin";
import { PromosClient } from "./promos-client";

export const dynamic = "force-dynamic";

export default async function AdminPromosPage() {
  const promos = await getAdminPromos();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black font-serif text-white tracking-tight">
          Promotional Discount Codes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Create marketing promo vouchers, manage usage quotas, and set percentage or fixed PKR discounts
        </p>
      </div>

      <PromosClient initialPromos={promos} />
    </div>
  );
}
