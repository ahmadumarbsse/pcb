import Link from "next/link";
import { getMatches } from "@/services/matches";
import { getVenues } from "@/services/venues";
import { MatchCard } from "@/components/shared/match-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, Filter, RotateCcw, Calendar, MapPin } from "lucide-react";

interface MatchesPageProps {
  searchParams: Promise<{
    format?: string;
    city?: string;
    team?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const params = await searchParams;
  const format = params.format || "ALL";
  const city = params.city || "ALL";
  const team = params.team || "ALL";
  const status = params.status || "ALL";
  const query = params.q || "";

  const [matchesList, venuesList] = await Promise.all([
    getMatches({ format, city, team, status, query }),
    getVenues(),
  ]);

  const uniqueCities = Array.from(new Set(venuesList.map((v) => v.city)));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-cricket-dark to-emerald-950 text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
              <Trophy className="w-3.5 h-3.5 text-cricket-gold" />
              <span>Official Matchday Schedule &bull; Demo Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
              Cricket Matches &amp; Fixtures
            </h1>
            <p className="text-sm sm:text-base text-stone-300">
              Browse upcoming international bilateral series, test matches, and domestic cricket fixtures. Select your match to view stadium stands and book tickets.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <form method="GET" action="/matches" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search team, series, or stadium..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cricket-primary"
              />
            </div>

            {/* Format Filter */}
            <div>
              <select
                name="format"
                defaultValue={format}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-cricket-primary"
              >
                <option value="ALL">All Formats</option>
                <option value="T20I">T20 Internationals</option>
                <option value="ODI">One Day Internationals</option>
                <option value="TEST">Test Matches</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                name="city"
                defaultValue={city}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-cricket-primary"
              >
                <option value="ALL">All Cities</option>
                {uniqueCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Submit & Reset */}
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="w-full bg-cricket-primary hover:bg-emerald-800 text-white text-xs">
                Filter
              </Button>
              {(format !== "ALL" || city !== "ALL" || query) && (
                <Link href="/matches">
                  <Button type="button" variant="outline" size="sm" className="px-2.5 text-xs text-stone-600">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-stone-400 font-medium">Quick view:</span>
            <Link href="/matches">
              <Badge variant={format === "ALL" && !query ? "default" : "outline"} className="cursor-pointer">
                All Matches ({matchesList.length})
              </Badge>
            </Link>
            <Link href="/matches?format=T20I">
              <Badge variant={format === "T20I" ? "default" : "outline"} className="cursor-pointer">
                T20 Series
              </Badge>
            </Link>
            <Link href="/matches?format=TEST">
              <Badge variant={format === "TEST" ? "default" : "outline"} className="cursor-pointer">
                Test Championship
              </Badge>
            </Link>
            <Link href="/matches?city=Lahore">
              <Badge variant={city === "Lahore" ? "default" : "outline"} className="cursor-pointer">
                Lahore Fixtures
              </Badge>
            </Link>
            <Link href="/matches?city=Karachi">
              <Badge variant={city === "Karachi" ? "default" : "outline"} className="cursor-pointer">
                Karachi Fixtures
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="container mx-auto px-4 py-8 flex-1">
        {matchesList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto my-12 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-cricket-primary flex items-center justify-center mx-auto border border-emerald-200">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground font-serif">No Matches Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No cricket fixtures matched your current search filters. Try selecting a different format, stadium, or clear your search query.
            </p>
            <Link href="/matches">
              <Button size="sm" variant="outline" className="text-xs">
                Clear Filters
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {matchesList.map((match) => (
              <MatchCard key={match.id} {...match} format={match.format as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
