"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Ticket,
  Clock,
  Inbox,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface AdminOverviewProps {
  kpis: {
    totalRevenuePkr: number;
    totalOrders: number;
    totalTicketsIssued: number;
    activeHolds: number;
    pendingInquiries: number;
    totalMatches: number;
  };
  initialMatches: any[];
  recentOrders: any[];
}

export function AdminOverviewClient({ kpis, initialMatches, recentOrders }: AdminOverviewProps) {
  const [matchesList, setMatchesList] = React.useState(initialMatches);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  async function handleToggleSales(matchId: string, currentStatus: boolean) {
    setUpdatingId(matchId);
    try {
      const res = await fetch("/api/admin/matches/toggle-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, salesOpen: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMatchesList((prev) =>
          prev.map((m) => (m.id === matchId ? { ...m, salesOpen: !currentStatus } : m))
        );
      }
    } catch {
      // Ignored
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <Card className="bg-slate-900 border-slate-800 text-white shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400">Total Revenue (PKR)</CardTitle>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-mono text-white">
              PKR {kpis.totalRevenuePkr.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>{kpis.totalOrders} paid booking orders</span>
            </p>
          </CardContent>
        </Card>

        {/* Tickets Issued */}
        <Card className="bg-slate-900 border-slate-800 text-white shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400">Tickets Issued</CardTitle>
            <Ticket className="w-4 h-4 text-cricket-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-mono text-white">
              {kpis.totalTicketsIssued.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Digital HMAC passes active
            </p>
          </CardContent>
        </Card>

        {/* Active Holds */}
        <Card className="bg-slate-900 border-slate-800 text-white shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400">Active Seat Holds</CardTitle>
            <Clock className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-mono text-amber-400">
              {kpis.activeHolds}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              10-minute cart locks in progress
            </p>
          </CardContent>
        </Card>

        {/* Pending Inquiries */}
        <Card className="bg-slate-900 border-slate-800 text-white shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400">Corporate Inquiries</CardTitle>
            <Inbox className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-mono text-white">
              {kpis.pendingInquiries}
            </div>
            <p className="text-[11px] text-blue-400 mt-1">
              {kpis.pendingInquiries > 0 ? "Awaiting quotation contact" : "All inquiries handled"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fixture Sales Controls */}
      <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
        <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Matchday Fixture Sales Controls
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Instantly open or suspend public ticketing access for upcoming matches
            </CardDescription>
          </div>
          <Link
            href="/admin/matches"
            className="text-xs text-cricket-gold hover:underline flex items-center gap-1 font-semibold"
          >
            Manage Fixtures <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>

        <CardContent className="pt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Fixture</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Venue</th>
                <th className="py-2.5 px-3">Match Date</th>
                <th className="py-2.5 px-3">Limit/User</th>
                <th className="py-2.5 px-3">Sales Status</th>
                <th className="py-2.5 px-3 text-right">Quick Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {matchesList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {m.title}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                      {m.format}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {m.venueCity}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {new Date(m.matchDate).toLocaleDateString()} &bull; {m.startTime}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {m.ticketLimitPerUser} max
                  </td>
                  <td className="py-3 px-3">
                    {m.salesOpen ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ON SALE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        SALES PAUSED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === m.id}
                      onClick={() => handleToggleSales(m.id, m.salesOpen)}
                      className={`text-xs h-7 px-2.5 border ${
                        m.salesOpen
                          ? "border-red-800/60 text-red-300 hover:bg-red-950"
                          : "border-emerald-800/60 text-emerald-300 hover:bg-emerald-950"
                      }`}
                    >
                      {updatingId === m.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : m.salesOpen ? (
                        "Pause Sales"
                      ) : (
                        "Open Sales"
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent Orders Log */}
      <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
        <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white">Recent Booking Orders</CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Live transactions recorded in PostgreSQL orders table
            </CardDescription>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-cricket-gold hover:underline flex items-center gap-1 font-semibold"
          >
            All Orders <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>

        <CardContent className="pt-4 overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Match</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-cricket-gold">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{o.customerName}</div>
                      <div className="text-[10px] text-slate-400">{o.customerEmail}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {o.matchTitle}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      PKR {o.totalAmountPkr.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                        {o.paymentMethod || "CARD"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No orders recorded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
