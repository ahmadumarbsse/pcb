import { getAdminKpis, getAllMatchesForAdmin, getAdminOrders } from "@/services/admin";
import { AdminOverviewClient } from "./admin-overview";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [kpis, matches, recentOrders] = await Promise.all([
    getAdminKpis(),
    getAllMatchesForAdmin(),
    getAdminOrders(6),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black font-serif text-white tracking-tight">
            Ticketing Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time PostgreSQL telemetry: revenue, matchday fixtures, active holds, and orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Neon PostgreSQL Live
          </div>
        </div>
      </div>

      <AdminOverviewClient kpis={kpis} initialMatches={matches} recentOrders={recentOrders} />
    </div>
  );
}
