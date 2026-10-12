import { notFound } from "next/navigation";
import { getMatchBookingData } from "@/services/bookings";
import { BookingFlow } from "./booking-flow";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Clock, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchBookingPage({ params }: BookPageProps) {
  const { id } = await params;
  const bookingData = await getMatchBookingData(id);

  if (!bookingData) {
    notFound();
  }

  const { match, categories, stands } = bookingData;
  const formattedDate = new Date(match.matchDate).toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Top Banner / Match Header */}
      <div className="bg-gradient-to-b from-cricket-dark via-emerald-950/60 to-slate-950 border-b border-emerald-900/30 py-6 px-4">
        <div className="container mx-auto">
          <Link
            href={`/matches/${match.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-cricket-gold hover:underline mb-4 font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Match Details
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-cricket-gold/40 text-cricket-gold bg-cricket-gold/10">
                  {match.format}
                </Badge>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 bg-emerald-950/50">
                  Max {match.ticketLimitPerUser} tickets/customer
                </Badge>
                {match.salesOpen ? (
                  <Badge className="bg-emerald-600 text-white font-medium">Sales Active</Badge>
                ) : (
                  <Badge variant="destructive">Sales Closed</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-serif tracking-tight text-white">
                {match.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300 mt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cricket-gold" />
                  {formattedDate} &bull; {match.startTime} PKT
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cricket-gold" />
                  {match.venueName}, {match.venueCity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-800/60 rounded-xl p-3 text-xs text-emerald-200">
              <ShieldCheck className="w-6 h-6 text-cricket-gold shrink-0" />
              <div>
                <p className="font-semibold text-white">Real-Time Inventory Hold</p>
                <p className="text-[11px] text-emerald-300/80">
                  Selected seats are locked for 10 minutes to prevent double-booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Booking Interactive Workflow */}
      <div className="container mx-auto px-4 mt-8">
        <BookingFlow match={match} categories={categories} stands={stands} />
      </div>
    </div>
  );
}
