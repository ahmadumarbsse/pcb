import Link from "next/link";
import { Sparkles, Check, Users, Coffee, ShieldCheck, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PremiumPage() {
  const packages = [
    {
      title: "Executive Corporate Box",
      tagline: "Private 15 to 25 Guest Suite with Glass Balcony",
      priceRange: "PKR 150,000 - 350,000 / Match",
      description: "Dedicated private air-conditioned suite with elevated panoramic straight-drive pitch views, private attendant service, and live TV monitors.",
      perks: [
        "Private suite for 15-25 guests with company branding",
        "5-star multi-course buffet & live snack stations",
        "Private VIP Gate entry with security priority clearance",
        "Designated VIP vehicle parking passes (up to 4 cars)",
        "Complimentary matchday souvenir programs",
        "Air-conditioned interior with cushioned exterior balcony seats",
      ],
      cta: "Enquire for Corporate Suite",
    },
    {
      title: "Wasim Akram VIP Lounge",
      tagline: "Individual Premium Hospitality Seating",
      priceRange: "PKR 4,000 - 7,500 / Seat",
      description: "Individually bookable luxury seats located immediately adjacent to team dugouts with access to air-conditioned dining lounge.",
      perks: [
        "Extra-wide ergonomic cushioned stadium armchairs",
        "Continuous high tea, snacks, and chilled beverages",
        "Direct sightline behind bowler run-up and team benches",
        "Fast-track Gate 2 access corridor",
        "Exclusive restroom and prayer facilities",
        "Matchday lanyard and commemorative pass",
      ],
      cta: "Book VIP Lounge Pass",
    },
    {
      title: "Chairman's Pavilion Terrace",
      tagline: "Ultra-Premium Outdoor Covered Enclosure",
      priceRange: "PKR 3,500 - 5,000 / Seat",
      description: "Elevated first-tier pavilion perspective favored by cricket legends, offering breezy shade and supreme pitch elevation.",
      perks: [
        "Elevated historic pavilion terrace viewing angle",
        "Complimentary meal box and refreshments voucher",
        "Dedicated Gate 1 turnstile lane",
        "Covered roof canopy shielding from sun and rain",
        "Access to commemorative cricket heritage gallery",
      ],
      cta: "Book Pavilion Terrace",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-16 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-4">
          <Badge variant="gold" className="text-xs uppercase font-bold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            VIP HOSPITALITY &amp; LUXURY SUITES
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black font-serif tracking-tight text-white">
            Experience Cricket at the Pinnacle of Hospitality
          </h1>
          <p className="text-base text-stone-300 leading-relaxed">
            Host valued corporate clients, celebrate milestones with family, or savor international cricket in an atmosphere of refined comfort, gourmet dining, and prime sightlines.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <Card
              key={pkg.title}
              className={`bg-white border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                idx === 0 ? "border-amber-400/80 shadow-md ring-1 ring-amber-400/30" : "border-slate-200"
              }`}
            >
              <div>
                <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                  {idx === 0 && (
                    <Badge variant="gold" className="w-fit text-[10px] mb-2 font-bold">
                      MOST PRESTIGIOUS
                    </Badge>
                  )}
                  <CardTitle className="text-xl font-bold font-serif">{pkg.title}</CardTitle>
                  <p className="text-xs text-muted-foreground font-medium pt-1">{pkg.tagline}</p>
                  <div className="text-lg font-black text-cricket-primary pt-3">
                    {pkg.priceRange}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Package Inclusions:
                    </span>
                    <ul className="space-y-2 text-xs text-stone-700">
                      {pkg.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>

              <div className="p-6 pt-0">
                <Link href={idx === 0 ? "/group-bookings" : "/matches"} className="block w-full">
                  <Button
                    className={`w-full text-xs font-bold h-11 justify-between ${
                      idx === 0
                        ? "bg-cricket-gold hover:bg-amber-400 text-stone-950 border border-amber-300"
                        : "bg-cricket-primary hover:bg-emerald-800 text-white"
                    }`}
                  >
                    <span>{pkg.cta}</span>
                    <ArrowRight className="w-4 h-4" />
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
