import { getAdminOrders } from "@/services/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders(100);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black font-serif text-white tracking-tight">
          Orders &amp; Issued Tickets Log
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete ledger of verified ticket purchases and digital pass reservations
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
        <CardContent className="p-0 overflow-x-auto">
          {orders.length > 0 ? (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Fixture</th>
                  <th className="py-3 px-4">Total (PKR)</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cricket-gold">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{o.customerName}</div>
                      <div className="text-[11px] text-slate-400">{o.customerEmail}</div>
                      {o.customerCnic && (
                        <div className="text-[10px] text-slate-500 font-mono">CNIC: {o.customerCnic}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {o.matchTitle}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      PKR {o.totalAmountPkr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                        {o.paymentMethod || "SANDBOX"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge className="bg-emerald-950 border-emerald-700 text-emerald-300 text-[10px]">
                        {o.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No orders found in database.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
