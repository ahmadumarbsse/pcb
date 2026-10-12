import Link from "next/link";
import { MapPin, Users, Building, ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface VenueCardProps {
  id: string;
  name: string;
  city: string;
  capacity: number;
  standCount: number;
  description: string;
  imageUrl?: string;
  upcomingMatchCount?: number;
}

export function VenueCard({
  id,
  name,
  city,
  capacity,
  standCount,
  description,
  upcomingMatchCount = 2,
}: VenueCardProps) {
  return (
    <Card className="overflow-hidden border border-emerald-900/15 hover:shadow-xl transition-all duration-300 group bg-white flex flex-col justify-between">
      <div>
        {/* Pitch / Stadium Header Art */}
        <div className="h-40 bg-gradient-to-br from-emerald-900 via-cricket-dark to-emerald-950 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 stadium-pitch-pattern" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-200 border border-emerald-700/50">
              <Building className="w-3 h-3 text-cricket-gold" />
              <span>{city}</span>
            </span>
            <span className="text-xs font-bold text-cricket-gold bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              {capacity.toLocaleString()} Capacity
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white group-hover:text-cricket-gold transition-colors font-serif">
              {name}
            </h3>
            <div className="flex items-center text-xs text-stone-300 gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cricket-gold shrink-0" />
              <span>{city}, Pakistan</span>
            </div>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border">
            <div>
              <span className="text-muted-foreground block text-[11px]">Enclosures</span>
              <span className="font-bold text-foreground">{standCount} Stands &amp; Enclosures</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Next Fixtures</span>
              <span className="font-bold text-cricket-primary">{upcomingMatchCount} Matches Scheduled</span>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-5 pt-0">
        <Link href={`/venues/${id}`} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-cricket-primary/30 text-cricket-primary hover:bg-cricket-primary hover:text-white justify-between"
          >
            <span>View Stadium &amp; Stands Guide</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
