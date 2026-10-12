import Link from "next/link";
import { getVenues } from "@/services/venues";
import { VenueCard } from "@/components/shared/venue-card";
import { Building, MapPin } from "lucide-react";

export default async function VenuesPage() {
  const venuesList = await getVenues();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-cricket-dark to-emerald-950 text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
              <Building className="w-3.5 h-3.5 text-cricket-gold" />
              <span>Iconic Cricket Grounds of Pakistan &bull; Demo Data</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
              Stadiums &amp; Match Venues
            </h1>
            <p className="text-sm sm:text-base text-stone-300">
              Explore stadium layouts, enclosures, turnstile gates, parking arrangements, and accessibility guides for world-renowned Pakistani cricket venues.
            </p>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venuesList.map((venue) => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </div>
      </div>
    </div>
  );
}
