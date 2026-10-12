import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueById } from "@/services/venues";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  MapPin,
  Users,
  Car,
  Accessibility,
  ShieldCheck,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface VenueDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;
  const venue = await getVenueById(id);

  if (!venue) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      {/* Stadium Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-[#063319] to-cricket-dark text-white border-b border-emerald-900/60 py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 mb-3 text-xs text-emerald-300">
            <Link href="/venues" className="hover:text-white">&larr; All Venues</Link>
            <span>&bull;</span>
            <span>{venue.city}, Pakistan</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white tracking-tight">
                {venue.name}
              </h1>
              <div className="flex items-center gap-2 text-stone-300 text-sm">
                <MapPin className="w-4 h-4 text-cricket-gold shrink-0" />
                <span>{venue.address}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-emerald-900/80 px-4 py-2 rounded-xl border border-emerald-700/60 text-center">
                <span className="text-[11px] text-emerald-300 uppercase block font-semibold">Capacity</span>
                <span className="text-xl font-black text-cricket-gold">{venue.capacity.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-900/80 px-4 py-2 rounded-xl border border-emerald-700/60 text-center">
                <span className="text-[11px] text-emerald-300 uppercase block font-semibold">Enclosures</span>
                <span className="text-xl font-black text-white">{venue.stands.length} Stands</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Stands Guide, Parking & Facilities */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-foreground">About the Stadium</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {venue.description}
              </p>
            </section>

            {/* Stands & Enclosures Table */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cricket-primary" />
                  <h3 className="text-base font-bold text-foreground">Stands &amp; Enclosures Directory</h3>
                </div>
                <span className="text-xs text-muted-foreground">{venue.stands.length} Designated Enclosures</span>
              </div>

              {venue.stands.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4">No stand configurations recorded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {venue.stands.map((stand) => (
                    <div
                      key={stand.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-cricket-primary/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-foreground">{stand.name}</h4>
                        <Badge
                          variant={stand.tier === "VIP" ? "gold" : stand.tier === "PREMIUM" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {stand.tier}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div><strong>Gate:</strong> {stand.gateNumber}</div>
                        <div><strong>Capacity:</strong> {stand.capacity.toLocaleString()} seats</div>
                        <div><strong>Type:</strong> {stand.isReservedSeating ? "Reserved Seating" : "General Bleachers"}</div>
                      </div>
                      {stand.description && (
                        <p className="text-[11px] text-stone-500 italic pt-1 border-t border-slate-200/60">
                          {stand.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Stadium Matchday Operations */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-foreground">Matchday Facilities &amp; Access</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Gates Info */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Turnstiles &amp; Gates
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {venue.gatesInfo || "Multiple outer security barriers lead to designated turnstiles."}
                  </p>
                </div>

                {/* Parking Info */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-emerald-600" />
                    Parking &amp; Shuttles
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {venue.parkingInfo || "Designated park-and-ride shuttle buses operate from nearby perimeter parking lots."}
                  </p>
                </div>

                {/* Accessibility Info */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Accessibility className="w-4 h-4 text-emerald-600" />
                    Accessibility
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {venue.accessibilityInfo || "Step-free ramp gates and wheelchair viewing spaces available."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Scheduled Matches */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cricket-primary" />
                  <span>Matches at this Venue</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {venue.matches.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No fixtures currently scheduled.</p>
                ) : (
                  venue.matches.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">{m.title}</span>
                        <Badge variant="outline" className="text-[10px]">{m.format}</Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {formatDate(m.date, "short")} &bull; {formatTime(m.time)}
                      </div>
                      <Link href={`/matches/${m.id}`} className="block pt-1">
                        <Button size="sm" className="w-full bg-cricket-primary hover:bg-emerald-800 text-white text-xs h-8 justify-between">
                          <span>View Tickets</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Map Link Action */}
            <Card className="bg-emerald-950 text-white border border-emerald-800 shadow-sm">
              <CardContent className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-white">Stadium Location Directions</h4>
                <p className="text-xs text-stone-300">
                  Open stadium location on Google Maps to navigate via vehicular routes or public transit.
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name} ${venue.city} Pakistan`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block pt-1"
                >
                  <Button variant="outline" size="sm" className="w-full border-cricket-gold text-cricket-gold hover:bg-cricket-gold hover:text-stone-950 font-bold text-xs gap-1.5 bg-transparent">
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
