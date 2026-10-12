import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatchById } from "@/services/matches";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Shield,
  Info,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) {
    notFound();
  }

  const minPrice = match.categories.length > 0 ? Math.min(...match.categories.map((c) => c.pricePkr)) : 500;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      {/* Hero Match Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-[#063319] to-cricket-dark text-white border-b border-emerald-900/60 py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link href="/matches" className="text-xs text-emerald-300 hover:text-white flex items-center gap-1">
              &larr; All Matches
            </Link>
            <span className="text-emerald-700">&bull;</span>
            <span className="text-xs text-stone-300 font-semibold">{match.seriesName}</span>
            <span className="text-emerald-700">&bull;</span>
            <Badge variant="gold" className="text-[10px] uppercase font-bold">
              {match.format}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Matchup Banner */}
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white tracking-tight">
                {match.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-emerald-100/90 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cricket-gold" />
                  <span>{formatDate(match.matchDate, "full")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cricket-gold" />
                  <span>{formatTime(match.startTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cricket-gold" />
                  <span>{match.venueName}, {match.city}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-900/50 border border-emerald-700/60 text-xs text-emerald-200/90 max-w-xl">
                <strong>Maximum Ticket Limit:</strong> Up to {match.ticketLimitPerUser} tickets per fan account to ensure fair distribution and counter scalping.
              </div>
            </div>

            {/* Price Card & Quick Action */}
            <div className="lg:col-span-4">
              <Card className="bg-white/95 text-foreground backdrop-blur-md border border-emerald-800 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Ticket Sales Active
                  </CardTitle>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-cricket-primary">
                      {formatCurrency(minPrice)}
                    </span>
                    <span className="text-xs text-muted-foreground">starting price</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xs text-stone-600 space-y-1">
                    <div className="flex justify-between">
                      <span>General Admission:</span>
                      <span className="font-semibold">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VIP &amp; Premium Stands:</span>
                      <span className="font-semibold text-amber-700">Selling Fast</span>
                    </div>
                  </div>

                  <Link href={`/matches/${match.id}/book`} className="block w-full">
                    <Button className="w-full bg-cricket-gold hover:bg-amber-400 text-stone-950 font-bold h-11 text-sm shadow-md gap-2">
                      <Ticket className="w-4 h-4" />
                      <span>Select Stands &amp; Buy Tickets</span>
                    </Button>
                  </Link>

                  <p className="text-[11px] text-center text-muted-foreground">
                    100% Verified Digital QR Delivery &bull; Instant Mobile Pass
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Categories, Stadium Guide, Policies */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Stand Categories & Current Pricing */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-cricket-primary" />
                  <h2 className="text-lg font-bold text-foreground">Available Ticket Categories</h2>
                </div>
                <span className="text-xs text-muted-foreground">{match.categories.length} Enclosures Open</span>
              </div>

              <div className="space-y-3">
                {match.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-cricket-primary/40 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{cat.name}</h4>
                        <Badge
                          variant={cat.tier === "VIP" ? "gold" : cat.tier === "PREMIUM" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {cat.tier}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                        <span>{cat.standName}</span>
                        <span>&bull;</span>
                        <span>{cat.gateNumber}</span>
                        <span>&bull;</span>
                        <span>{cat.isReservedSeating ? "Numbered Seat" : "General Admission"}</span>
                      </div>
                      {cat.perksDescription && (
                        <p className="text-xs text-emerald-800 font-medium pt-1">
                          &bull; {cat.perksDescription}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-base font-extrabold text-cricket-primary">
                          {formatCurrency(cat.pricePkr)}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {cat.availableQuota} seats left
                        </span>
                      </div>
                      <Link href={`/matches/${match.id}/book?category=${cat.id}`}>
                        <Button size="sm" className="bg-cricket-primary hover:bg-emerald-800 text-white text-xs font-semibold">
                          Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Stadium Information & Entry Rules */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building className="w-5 h-5 text-cricket-primary" />
                <h2 className="text-lg font-bold text-foreground">Venue &amp; Stadium Guidelines</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Stadium Entry Protocol
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {match.venueRules || "Turnstile entry opens 3 hours before match start. Physical CNIC/passport mandatory for adult pass verification."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Gates &amp; Access Lanes
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {match.venueGatesInfo || "Specific turnstiles are mapped on your ticket pass. Please enter through your assigned outer barrier to avoid crowd rerouting."}
                  </p>
                </div>
              </div>

              {/* Accessibility info */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-1 text-emerald-950">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Wheelchair &amp; Special Assistance Accessibility
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  {match.venueAccessibility || "Step-free ramp entry and reserved companion seating bays are available at VIP and Pavilion gates. Volunteers are stationed at turnstiles for assistance."}
                </p>
              </div>
            </section>

            {/* 3. Refund Policy */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-foreground">Official Ticket Refund Terms</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {match.refundPolicyNotes || "In the event of match cancellation before toss without a single ball bowled, fans are eligible for 100% face-value refunds back to their original payment method. Booking fees are non-refundable. Voluntary cancellation requests must be submitted at least 48 hours prior to matchday."}
              </p>
            </section>
          </div>

          {/* Right Column: Stadium Overview & Support */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Venue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Stadium:</span>
                  <p className="font-bold text-foreground">{match.venueName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Address:</span>
                  <p className="text-foreground">{match.venueAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Capacity:</span>
                  <p className="text-foreground">{match.capacity.toLocaleString()} Spectators</p>
                </div>
                <div className="pt-2">
                  <Link href={`/venues/${match.venueId}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs text-cricket-primary border-cricket-primary/30">
                      View Full Stadium &amp; Stands Guide
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Hospitality Teaser */}
            <Card className="bg-gradient-to-br from-emerald-950 to-cricket-dark text-white border border-emerald-800 shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cricket-gold">
                  <Sparkles className="w-4 h-4" />
                  <span>CORPORATE HOSPITALITY</span>
                </div>
                <h4 className="font-bold text-sm text-white">Booking for 10+ Guests?</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Unlock private air-conditioned suites, premium dining, and dedicated turnstiles for corporate groups and clubs.
                </p>
                <Link href="/group-bookings">
                  <Button size="sm" className="w-full bg-cricket-gold hover:bg-amber-400 text-stone-950 font-bold text-xs mt-1">
                    Request Group Quotation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
