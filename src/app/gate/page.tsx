import { getAllMatchesForAdmin } from "@/services/admin";
import { getRecentGateScans } from "@/services/gate-scanner";
import { GateScannerClient } from "./gate-scanner-client";

export const dynamic = "force-dynamic";

export default async function GateStaffPage() {
  const [matches, recentScans] = await Promise.all([
    getAllMatchesForAdmin(),
    getRecentGateScans(30),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-900/40 py-5 px-4 sm:px-8">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-cricket-gold flex items-center justify-center">
              <span className="text-sm font-black text-cricket-gold">PCB</span>
            </div>
            <div>
              <h1 className="text-xl font-black font-serif text-white tracking-tight uppercase">
                Stadium Turnstile Gate Scanner
              </h1>
              <p className="text-xs text-emerald-300/80">
                Gate Staff Turnstile Validation &bull; Anti-Fraud Duplicate Scan Rejection &bull; Real-time Neon DB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Turnstile Armed
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 mt-8">
        <GateScannerClient matches={matches} initialRecentScans={recentScans} />
      </div>
    </div>
  );
}
