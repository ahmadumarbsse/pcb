import Link from "next/link";
import { Shield, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cricket-dark text-white border-t border-emerald-950/60 mt-auto">
      {/* Sponsor Showcase Band */}
      <div className="border-b border-emerald-900/40 bg-emerald-950/50 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/80">
              Official Partners &amp; Sponsors (Placeholder)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 items-center justify-center opacity-70">
            <div className="h-10 rounded border border-emerald-800/60 bg-emerald-900/30 flex items-center justify-center text-xs font-semibold text-emerald-200">
              NATIONAL BANK
            </div>
            <div className="h-10 rounded border border-emerald-800/60 bg-emerald-900/30 flex items-center justify-center text-xs font-semibold text-emerald-200">
              TELECOM PARTNER
            </div>
            <div className="h-10 rounded border border-emerald-800/60 bg-emerald-900/30 flex items-center justify-center text-xs font-semibold text-emerald-200">
              APPARREL CO.
            </div>
            <div className="h-10 rounded border border-emerald-800/60 bg-emerald-900/30 flex items-center justify-center text-xs font-semibold text-emerald-200">
              BEVERAGE SPONSOR
            </div>
            <div className="h-10 rounded border border-emerald-800/60 bg-emerald-900/30 hidden md:flex items-center justify-center text-xs font-semibold text-emerald-200">
              AIRWAYS PARTNER
            </div>
            <div className="h-10 rounded border border-emerald-800/60 bg-emerald-900/30 hidden md:flex items-center justify-center text-xs font-semibold text-emerald-200">
              BROADCAST NETWORK
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-950 border-2 border-cricket-gold flex items-center justify-center">
                <span className="text-xs font-black text-cricket-gold">PCB</span>
              </div>
              <span className="text-lg font-black tracking-wider text-white font-serif uppercase">
                PCB <span className="text-cricket-gold">TICKETS</span>
              </span>
            </div>
            <p className="text-sm text-stone-300 max-w-sm leading-relaxed">
              Experience the roar of the crowd, the crack of the bat, and the thrill of international cricket. Book official match tickets, VIP hospitalities, and premium stadium seating.
            </p>
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-xs text-emerald-300/90 leading-normal">
              <strong>Demonstration Notice:</strong> This software is a realistic, non-commercial engineering demo of a cricket ticketing architecture. It is not affiliated with or endorsed by the Pakistan Cricket Board.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cricket-gold mb-4">
              Ticketing
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/matches" className="hover:text-cricket-gold transition-colors">
                  Upcoming Matches
                </Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-cricket-gold transition-colors">
                  Series &amp; Tournaments
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-cricket-gold transition-colors">
                  Stadiums &amp; Venues
                </Link>
              </li>
              <li>
                <Link href="/premium" className="hover:text-cricket-gold transition-colors">
                  VIP &amp; Hospitality
                </Link>
              </li>
              <li>
                <Link href="/group-bookings" className="hover:text-cricket-gold transition-colors">
                  Group Allocations
                </Link>
              </li>
              <li>
                <Link href="/account/tickets" className="hover:text-cricket-gold transition-colors">
                  Download E-Tickets
                </Link>
              </li>
            </ul>
          </div>

          {/* Venues & Stadia */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cricket-gold mb-4">
              Iconic Grounds
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/venues" className="hover:text-cricket-gold transition-colors">
                  Gaddafi Stadium, Lahore
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-cricket-gold transition-colors">
                  National Bank Stadium, Karachi
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-cricket-gold transition-colors">
                  Rawalpindi Cricket Stadium
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-cricket-gold transition-colors">
                  Multan Cricket Stadium
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-cricket-gold transition-colors">
                  Bugti Stadium, Quetta
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Box Office */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cricket-gold mb-4">
              Help &amp; Box Office
            </h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cricket-gold shrink-0" />
                <span>+92 42 111-22-722 (PCB)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cricket-gold shrink-0" />
                <span>tickets@pcb-cricket.demo</span>
              </li>
              <li>
                <Link href="/help" className="hover:text-cricket-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cricket-gold transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-cricket-gold text-xs text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Staff Gate Scanner
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="mt-12 pt-8 border-t border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/help" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
            <Link href="/help#code-of-conduct" className="hover:text-white transition-colors">
              Stadium Code of Conduct
            </Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} PCB Ticket Booking Platform (Demo Architecture). All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
