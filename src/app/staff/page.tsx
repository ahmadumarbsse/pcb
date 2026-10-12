import { getAllMatchesForAdmin } from "@/services/admin";
import { getBoxOfficeRecentTickets } from "@/services/box-office";
import { getDb } from "@/db";
import { ticketCategories, stands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { StaffClient } from "./staff-client";

export const dynamic = "force-dynamic";

export default async function StaffDashboardPage() {
  const db = getDb();

  const [matches, recentTickets] = await Promise.all([
    getAllMatchesForAdmin(),
    getBoxOfficeRecentTickets(20),
  ]);

  // Fetch categories for all matches
  const categories = await db
    .select({
      id: ticketCategories.id,
      matchId: ticketCategories.matchId,
      name: ticketCategories.name,
      tier: ticketCategories.tier,
      pricePkr: ticketCategories.pricePkr,
      availableQuota: ticketCategories.availableQuota,
      gateNumber: stands.gateNumber,
      standName: stands.name,
    })
    .from(ticketCategories)
    .innerJoin(stands, eq(ticketCategories.standId, stands.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-900/40 py-5 px-4 sm:px-8">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500 flex items-center justify-center">
              <span className="text-sm font-black text-cricket-gold">PCB</span>
            </div>
            <div>
              <h1 className="text-xl font-black font-serif text-white tracking-tight uppercase">
                Box Office Desk Operations
              </h1>
              <p className="text-xs text-emerald-300/80">
                Stadium Walk-in Ticketing &bull; Verified CNIC Pass Issuance &bull; Customer Lookup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Counter Active
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 mt-8">
        <StaffClient matches={matches} categories={categories} initialRecentTickets={recentTickets} />
      </div>
    </div>
  );
}
