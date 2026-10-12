import { getAllMatchesForAdmin } from "@/services/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMatchesPage() {
  const matches = await getAllMatchesForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black font-serif text-white tracking-tight">
            Fixtures &amp; Match Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage ticketing configuration, user purchase limits, and match sales status
          </p>
        </div>

        <Link href="/matches">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 text-xs">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            View Public Fixtures
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {matches.map((m) => (
          <Card key={m.id} className="bg-slate-900 border-slate-800 text-white shadow-md">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-cricket-gold/40 text-cricket-gold bg-cricket-gold/10 text-[10px]">
                    {m.format}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Limit: {m.ticketLimitPerUser} tickets/user
                  </span>
                  {m.salesOpen ? (
                    <Badge className="bg-emerald-950 border-emerald-800 text-emerald-300 text-[10px]">
                      Sales Open
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px]">
                      Sales Suspended
                    </Badge>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">{m.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cricket-gold" />
                    {new Date(m.matchDate).toLocaleDateString()} at {m.startTime} PKT
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cricket-gold" />
                    {m.venueName}, {m.venueCity}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link href={`/matches/${m.id}`}>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 text-xs">
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    Match Preview
                  </Button>
                </Link>
                <Link href={`/matches/${m.id}/book`}>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
                    Open Seat Grid
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
