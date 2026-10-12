import Link from "next/link";
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  CreditCard,
  MapPin,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { HeroBanner } from "@/components/shared/hero-banner";
import { MatchCard } from "@/components/shared/match-card";
import { VenueCard } from "@/components/shared/venue-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMatches } from "@/services/matches";
import { getVenues } from "@/services/venues";

export default async function HomePage() {
  const [matchesList, venuesList] = await Promise.all([
    getMatches({ status: "UPCOMING" }),
    getVenues(),
  ]);

  const featuredMatches = matchesList.slice(0, 4);
  const featuredVenues = venuesList.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Featured Matches Section (Database-backed) */}
      <section className="py-12 lg:py-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cricket-primary uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-cricket-gold" />
              <span>International &amp; National Fixtures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-serif">
              Upcoming Matches On Sale
            </h2>
          </div>
          <Link href="/matches">
            <Button variant="outline" className="border-cricket-primary/30 text-cricket-primary hover:bg-cricket-primary hover:text-white font-semibold gap-1.5">
              <span>View Full Fixture Schedule</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMatches.map((match) => (
            <MatchCard
              key={match.id}
              id={match.id}
              seriesName={match.seriesName}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeTeamCode={match.homeTeamCode}
              awayTeamCode={match.awayTeamCode}
              format={match.format as any}
              date={match.date}
              time={match.time}
              venueName={match.venueName}
              city={match.city}
              minPrice={match.minPrice}
              status={match.status as any}
            />
          ))}
        </div>
      </section>

      {/* 3. Value Proposition / Why Book With PCB Portal */}
      <section className="py-14 bg-gradient-to-b from-emerald-950 to-cricket-dark text-white border-y border-emerald-900/60">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-cricket-gold tracking-widest uppercase">
              Official Fan Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 font-serif">
              Seamless Matchday Entry
            </h2>
            <p className="text-sm text-emerald-200/80 mt-2">
              Book with guaranteed authenticity, real-time seat lock protection, and smooth stadium turnstile access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-emerald-900/30 border border-emerald-800/50 backdrop-blur-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-800/80 text-cricket-gold flex items-center justify-center border border-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Guaranteed Official Passes</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Directly connected to stadium turnstiles. Every ticket is cryptographically signed to eradicate scalping, duplication, and fake passes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-emerald-900/30 border border-emerald-800/50 backdrop-blur-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-800/80 text-cricket-gold flex items-center justify-center border border-emerald-700">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Interactive Seat Reservation</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Explore stand perspectives and reserve your specific seat with 10-minute hold concurrency to guarantee your booking during peak demand.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-emerald-900/30 border border-emerald-800/50 backdrop-blur-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-800/80 text-cricket-gold flex items-center justify-center border border-emerald-700">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Local Pakistani &amp; Global Pay</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Pay effortlessly via Easypaisa, JazzCash, 1Link, debit cards, and international Visa / Mastercard with instant digital receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Iconic Stadiums & Venues (Database-backed) */}
      <section className="py-14 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cricket-primary uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4 text-cricket-gold" />
              <span>World-Class Grounds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-serif">
              Explore Cricket Stadiums
            </h2>
          </div>
          <Link href="/venues">
            <Button variant="outline" className="border-cricket-primary/30 text-cricket-primary hover:bg-cricket-primary hover:text-white font-semibold">
              All Venues &amp; Seating Layouts
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVenues.map((stadium) => (
            <VenueCard
              key={stadium.id}
              id={stadium.id}
              name={stadium.name}
              city={stadium.city}
              capacity={stadium.capacity}
              standCount={stadium.standCount}
              description={stadium.description}
              upcomingMatchCount={stadium.upcomingMatchCount}
            />
          ))}
        </div>
      </section>

      {/* 5. VIP Hospitality & Premium Experiences Callout */}
      <section className="py-12 bg-amber-500/10 border-y border-amber-400/30">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-950 via-cricket-dark to-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-emerald-700/50 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <Badge variant="gold" className="text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                VIP ENCLOSURES &amp; HOSPITALITY
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-white">
                Elevate Your Matchday In Luxury
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Enjoy air-conditioned luxury suites, gourmet 5-star catering, prime panoramic pitch views, and private fast-track gate entry for you and your corporate guests.
              </p>
              <div className="flex flex-wrap gap-4 pt-3">
                <Link href="/premium">
                  <Button className="bg-cricket-gold hover:bg-amber-400 text-stone-950 font-bold px-6 shadow-md border border-amber-300">
                    Explore Hospitality Packages
                  </Button>
                </Link>
                <Link href="/group-bookings">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold bg-transparent">
                    Request Group Quotation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Fan Matchday Guide & Entry Rules */}
      <section className="py-14 container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-cricket-primary tracking-widest uppercase">
            Stadium Guidelines
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-serif mt-1">
            Matchday Ready: Know Before You Go
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cricket-primary font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Gate Opening &amp; Timing</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stadium gates open 3 hours prior to match commencement. We strongly advise fans to arrive early to clear physical security checkpoints comfortably.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cricket-primary font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Digital QR Pass &amp; CNIC</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Please have your digital E-ticket downloaded on your phone or printed on paper, along with a valid original National Identity Card (CNIC) or passport for gate verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cricket-primary font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Prohibited Items</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Glass bottles, fireworks, sharp objects, heavy recording equipment, laser pointers, and unapproved political banners are strictly prohibited inside spectator stands.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
