import Link from "next/link";
import { Calendar, MapPin, Clock, Ticket, ChevronRight, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export interface MatchCardProps {
  id: string;
  seriesName: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamCode?: string;
  awayTeamCode?: string;
  format: "TEST" | "ODI" | "T20I" | "DOMESTIC";
  date: string;
  time: string;
  venueName: string;
  city: string;
  minPrice: number;
  status: "UPCOMING" | "LIVE" | "COMPLETED" | "POSTPONED";
  availabilityText?: string;
}

export function MatchCard({
  id,
  seriesName,
  homeTeam,
  awayTeam,
  homeTeamCode = homeTeam.slice(0, 3).toUpperCase(),
  awayTeamCode = awayTeam.slice(0, 3).toUpperCase(),
  format,
  date,
  time,
  venueName,
  city,
  minPrice,
  status,
  availabilityText = "Tickets Available",
}: MatchCardProps) {
  const getFormatBadge = (fmt: string) => {
    switch (fmt) {
      case "TEST":
        return <Badge variant="outline" className="border-red-600/50 text-red-700 bg-red-50">TEST</Badge>;
      case "ODI":
        return <Badge variant="outline" className="border-blue-600/50 text-blue-700 bg-blue-50">ODI</Badge>;
      case "T20I":
        return <Badge variant="outline" className="border-emerald-600/50 text-emerald-700 bg-emerald-50">T20I</Badge>;
      default:
        return <Badge variant="secondary">CRICKET</Badge>;
    }
  };

  const isCompleted = status === "COMPLETED";

  return (
    <Card className="overflow-hidden border border-emerald-900/10 hover:border-cricket-primary/40 hover:shadow-lg transition-all duration-300 group bg-white">
      {/* Top Meta Bar */}
      <div className="bg-gradient-to-r from-emerald-950 to-cricket-dark px-4 py-2.5 flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-cricket-gold" />
          <span className="font-semibold truncate max-w-[200px] text-stone-200">
            {seriesName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getFormatBadge(format)}
          {status === "LIVE" && <Badge variant="live">LIVE</Badge>}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Matchup Header */}
        <div className="grid grid-cols-5 items-center gap-2 my-2">
          {/* Home Team */}
          <div className="col-span-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-600/30 flex items-center justify-center font-bold text-cricket-dark text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              {homeTeamCode}
            </div>
            <h4 className="font-bold text-sm text-foreground line-clamp-1">{homeTeam}</h4>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Home</span>
          </div>

          {/* VS Divider */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-cricket-gold bg-cricket-dark px-2 py-1 rounded-full shadow-inner">
              VS
            </span>
          </div>

          {/* Away Team */}
          <div className="col-span-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 border-2 border-stone-300 flex items-center justify-center font-bold text-stone-800 text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              {awayTeamCode}
            </div>
            <h4 className="font-bold text-sm text-foreground line-clamp-1">{awayTeam}</h4>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Away</span>
          </div>
        </div>

        {/* Date, Time & Venue */}
        <div className="my-4 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cricket-primary shrink-0" />
            <span className="font-medium text-foreground">{formatDate(date, "full")}</span>
            <span className="text-stone-300">&bull;</span>
            <Clock className="w-3.5 h-3.5 text-cricket-primary shrink-0" />
            <span>{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-cricket-primary shrink-0" />
            <span className="truncate">{venueName}, {city}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-dashed border-border flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground">Tickets from</div>
            <div className="text-base font-extrabold text-cricket-primary">
              {formatCurrency(minPrice)}
            </div>
          </div>

          {isCompleted ? (
            <Badge variant="completed">Match Ended</Badge>
          ) : (
            <Link href={`/matches/${id}`}>
              <Button
                size="sm"
                className="bg-cricket-primary hover:bg-cricket-dark text-white font-semibold text-xs gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Select Seats</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
