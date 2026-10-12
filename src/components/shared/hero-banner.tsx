import Link from "next/link";
import { Ticket, Sparkles, Shield, Trophy, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#031d0e] via-[#083e1e] to-[#041a0d] text-white py-16 lg:py-24 border-b border-emerald-900/50">
      {/* Subtle stadium texture / background accents */}
      <div className="absolute inset-0 opacity-20 stadium-pitch-pattern" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cricket-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-cricket-gold animate-ping" />
              <span>OFFICIAL MATCHDAY TICKETING PORTAL</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-serif text-white">
              FEEL THE THRILL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cricket-gold via-amber-200 to-amber-400">
                FROM THE STANDS
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/80 max-w-xl leading-relaxed">
              Secure official match passes, VIP enclosures, and corporate hospitality for international tests, ODIs, T20s, and high-voltage domestic cricket clashes across Pakistan.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/matches">
                <Button
                  size="lg"
                  className="bg-cricket-gold hover:bg-amber-400 text-stone-950 font-bold px-8 shadow-lg shadow-amber-900/20 gap-2 border border-amber-300"
                >
                  <Ticket className="w-5 h-5 text-stone-950" />
                  <span>Buy Match Tickets</span>
                </Button>
              </Link>
              <Link href="/premium">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-500/60 text-white hover:bg-emerald-800/40 font-semibold gap-2 bg-emerald-950/40"
                >
                  <Sparkles className="w-4 h-4 text-cricket-gold" />
                  <span>VIP &amp; Hospitality</span>
                </Button>
              </Link>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-900/60 max-w-lg text-xs text-emerald-200/90">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cricket-gold shrink-0" />
                <span>100% Genuine Encrypted Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cricket-gold shrink-0" />
                <span>Instant Mobile QR Issuance</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-cricket-gold shrink-0" />
                <span>Fair Pricing &amp; Price Locks</span>
              </div>
            </div>
          </div>

          {/* Marquee Featured Match Banner Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-emerald-700/60 bg-gradient-to-b from-emerald-950/90 to-cricket-dark/95 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" className="text-[10px]">FEATURED MARQUEE</Badge>
                  <span className="text-xs text-stone-300 font-semibold">T20 International Series</span>
                </div>
                <span className="text-xs font-bold text-cricket-gold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  SELLING FAST
                </span>
              </div>

              {/* Teams Display */}
              <div className="py-6 flex items-center justify-between gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-700/30 border-2 border-emerald-400 flex items-center justify-center font-black text-xl text-white shadow-lg mb-2">
                    PAK
                  </div>
                  <span className="font-bold text-base text-white">Pakistan</span>
                  <span className="text-xs text-emerald-400">National Team</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-cricket-gold bg-emerald-900 px-3 py-1 rounded-full border border-emerald-700">
                    VS
                  </span>
                  <span className="text-[10px] text-stone-400 mt-2">1st T20I</span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-stone-700/30 border-2 border-amber-400/80 flex items-center justify-center font-black text-xl text-white shadow-lg mb-2">
                    ENG
                  </div>
                  <span className="font-bold text-base text-white">England</span>
                  <span className="text-xs text-stone-300">Tour of Pak</span>
                </div>
              </div>

              {/* Venue & Date Details */}
              <div className="bg-emerald-950/80 rounded-xl p-3 border border-emerald-900 space-y-1.5 text-xs text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-medium">Stadium:</span>
                  <span className="font-bold text-white">Gaddafi Stadium, Lahore</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-medium">Date &amp; Time:</span>
                  <span className="font-bold text-white">Friday, Nov 14 &bull; 7:00 PM PKT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-medium">Stands Open:</span>
                  <span className="text-white">General, Premium &amp; Wasim Akram Enclosure</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5">
                <Link href="/matches">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-cricket-primary hover:from-emerald-500 hover:to-emerald-700 text-white font-bold h-11 text-sm shadow-md justify-between px-5">
                    <span>Book Tickets from PKR 1,000</span>
                    <ArrowRight className="w-4 h-4 text-cricket-gold" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
