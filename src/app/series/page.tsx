import Link from "next/link";
import { getSeriesList } from "@/services/matches";
import { Trophy, Calendar, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function SeriesPage() {
  const seriesList = await getSeriesList();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-cricket-dark to-emerald-950 text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
              <Trophy className="w-3.5 h-3.5 text-cricket-gold" />
              <span>Tournaments &amp; Bilateral Series &bull; Demo Data</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
              Cricket Series &amp; Championships
            </h1>
            <p className="text-sm sm:text-base text-stone-300">
              Explore international tours, bilateral series, and domestic championship competitions scheduled across Pakistan.
            </p>
          </div>
        </div>
      </div>

      {/* Series Cards Grid */}
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seriesList.map((s) => (
            <Card key={s.id} className="overflow-hidden border border-slate-200 hover:border-cricket-primary/40 hover:shadow-lg transition-all flex flex-col justify-between bg-white">
              <div>
                <div className="bg-gradient-to-r from-emerald-950 to-cricket-dark p-5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-cricket-gold" />
                    <span className="text-xs font-semibold text-stone-200">Season {s.season}</span>
                  </div>
                  <Badge variant="gold" className="text-[10px]">
                    {s.format}
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold font-serif text-foreground leading-snug">
                    {s.name}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {s.description || "International bilateral cricket contest featuring world-class players and high-intensity match action."}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cricket-primary" />
                      <span>{formatDate(s.startDate, "short")} - {formatDate(s.endDate, "short")}</span>
                    </div>
                    <span className="font-bold text-cricket-primary bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {s.matchCount} Fixtures
                    </span>
                  </div>
                </CardContent>
              </div>

              <div className="p-6 pt-0">
                <Link href={`/matches?q=${encodeURIComponent(s.name.split(" ")[0])}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full border-cricket-primary/30 text-cricket-primary hover:bg-cricket-primary hover:text-white justify-between">
                    <span>View Scheduled Matches</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
