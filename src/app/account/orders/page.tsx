import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/permissions";
import { getUserOrders } from "@/services/account";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Receipt, CheckCircle2 } from "lucide-react";

export default async function AccountOrdersPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = session.user as any;
  const ordersList = await getUserOrders(user.id);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-3 text-xs text-emerald-300">
            <Link href="/account" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black font-serif text-white">Order History &amp; Receipts</h1>
          <p className="text-xs text-stone-300">
            Review past transactions, payment confirmation references, and invoice receipts
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        {ordersList.length === 0 ? (
          <Card className="bg-white border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-cricket-primary flex items-center justify-center mx-auto border border-emerald-200">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Orders Yet</h3>
            <p className="text-xs text-muted-foreground">
              You haven&apos;t placed any ticket orders yet.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {ordersList.map((ord) => (
              <Card key={ord.id} className="bg-white border-slate-200 overflow-hidden shadow-sm">
                <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-cricket-primary" />
                    <div>
                      <span className="font-mono text-xs font-bold text-foreground">{ord.orderNumber}</span>
                      <span className="text-[11px] text-muted-foreground block">{formatDate(ord.createdAt, "full")}</span>
                    </div>
                  </div>
                  <Badge variant={ord.status === "PAID" ? "upcoming" : "secondary"}>
                    {ord.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-foreground">{ord.matchTitle}</h4>
                    <p className="text-muted-foreground">{ord.venueName}</p>
                    <span className="text-[11px] text-stone-500">Method: {ord.paymentMethod || "Electronic"}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-cricket-primary">
                      {formatCurrency(ord.totalAmountPkr)}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid &bull; Verified
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
