"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Shield,
  Sparkles,
  Users,
  HelpCircle,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [ticketsDropdownOpen, setTicketsDropdownOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const pathname = usePathname();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTicketsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setTicketsDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/matches", label: "Matches" },
    { href: "/series", label: "Series" },
    { href: "/venues", label: "Venues" },
  ];

  const ticketsDropdownItems = [
    {
      href: "/matches",
      label: "Buy Tickets",
      desc: "Upcoming international & domestic fixtures",
      icon: Ticket,
    },
    {
      href: "/premium",
      label: "Premium Experiences",
      desc: "VIP enclosures, corporate hospitality & lounges",
      icon: Sparkles,
    },
    {
      href: "/group-bookings",
      label: "Group Bookings",
      desc: "Bulk allocations for clubs, corporate & schools",
      icon: Users,
    },
    {
      href: "/venues",
      label: "Stadiums & Venues",
      desc: "Seating maps, gate guides & accessibility",
      icon: Building,
    },
    {
      href: "/help",
      label: "Ticketing FAQs",
      desc: "Entry policies, refund terms & digital passes",
      icon: HelpCircle,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/20 bg-cricket-dark text-white shadow-md">
      {/* Top Disclaimer / Notification Bar */}
      <div className="bg-emerald-950/80 px-4 py-1.5 text-xs border-b border-emerald-900/40 text-emerald-200/90">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cricket-gold/20 text-cricket-gold border border-cricket-gold/30">
              DEMO PORTAL
            </span>
            <span className="truncate">
              Realistic PCB-Style Cricket Ticketing Demonstration &bull; Not Affiliated with Official PCB
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/scanner" className="hover:text-cricket-gold flex items-center gap-1 transition-colors">
              <Shield className="w-3 h-3 text-cricket-gold" />
              <span>Gate Staff Scanner</span>
            </Link>
            <Link href="/admin" className="hover:text-cricket-gold flex items-center gap-1 transition-colors">
              <span>Admin Portal</span>
            </Link>
            <div className="h-3 w-[1px] bg-emerald-800" />
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cricket-gold rounded-lg p-1">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 via-cricket-primary to-emerald-950 border-2 border-cricket-gold shadow-sm group-hover:scale-105 transition-transform">
              {/* Cricket Ball & Seam Insignia */}
              <div className="w-4 h-4 rounded-full border border-amber-300/80 flex items-center justify-center">
                <div className="w-2 h-0.5 bg-cricket-gold rotate-45" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white font-serif uppercase">
                PCB <span className="text-cricket-gold">TICKETS</span>
              </span>
              <span className="text-[10px] text-emerald-300/80 tracking-widest uppercase font-medium">
                Official Matchday Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                    isActive
                      ? "text-cricket-gold bg-emerald-900/50"
                      : "text-white/90 hover:text-white hover:bg-emerald-900/30"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Tickets Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setTicketsDropdownOpen(!ticketsDropdownOpen)}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors focus:outline-none",
                  ticketsDropdownOpen
                    ? "text-cricket-gold bg-emerald-900/50"
                    : "text-white/90 hover:text-white hover:bg-emerald-900/30"
                )}
                aria-expanded={ticketsDropdownOpen}
              >
                <span>Tickets</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    ticketsDropdownOpen ? "rotate-180 text-cricket-gold" : ""
                  )}
                />
              </button>

              {ticketsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-cricket-charcoal border border-emerald-800/60 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-emerald-400 tracking-wider uppercase border-b border-emerald-900/50 mb-1">
                    Ticketing Services
                  </div>
                  {ticketsDropdownItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        onClick={() => setTicketsDropdownOpen(false)}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-900/40 transition-colors group mx-1"
                      >
                        <div className="p-1.5 rounded-md bg-emerald-950/80 text-cricket-gold border border-emerald-800 group-hover:border-cricket-gold/50">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-cricket-gold transition-colors">
                            {item.label}
                          </div>
                          <div className="text-xs text-stone-400 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/premium"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5",
                pathname === "/premium"
                  ? "text-cricket-gold bg-emerald-900/50"
                  : "text-white/90 hover:text-white hover:bg-emerald-900/30"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-cricket-gold" />
              <span>Premium</span>
            </Link>

            <Link
              href="/group-bookings"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                pathname === "/group-bookings"
                  ? "text-cricket-gold bg-emerald-900/50"
                  : "text-white/90 hover:text-white hover:bg-emerald-900/30"
              )}
            >
              Group Bookings
            </Link>

            <Link
              href="/help"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                pathname === "/help"
                  ? "text-cricket-gold bg-emerald-900/50"
                  : "text-white/90 hover:text-white hover:bg-emerald-900/30"
              )}
            >
              Help & FAQs
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Bar Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-emerald-950 border border-emerald-700/60 rounded-lg px-2.5 py-1">
                  <Search className="w-4 h-4 text-emerald-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search match or team..."
                    className="bg-transparent text-xs text-white placeholder-emerald-300/60 focus:outline-none w-36 sm:w-48"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        window.location.href = `/matches?q=${encodeURIComponent(searchQuery.trim())}`;
                      }
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-stone-400 hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="text-white/90 hover:text-white hover:bg-white/10"
                  title="Search matches"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* My Tickets / Fan Dashboard */}
            <Link href="/account/tickets" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="border-cricket-gold/60 text-cricket-gold hover:bg-cricket-gold hover:text-black gap-1.5 font-semibold text-xs h-9 bg-transparent"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>My Tickets</span>
              </Button>
            </Link>

            {/* Auth / Account Button */}
            <Link href="/auth/login">
              <Button
                size="sm"
                className="bg-cricket-primary hover:bg-emerald-700 text-white font-semibold text-xs h-9 gap-1.5 border border-emerald-500/40 shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>

            {/* Mobile Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-900 bg-cricket-charcoal px-4 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-4">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/matches?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="flex items-center bg-emerald-950/90 border border-emerald-800 rounded-lg px-3 py-2"
            >
              <Search className="w-4 h-4 text-emerald-400 mr-2" />
              <input
                type="text"
                placeholder="Search match, series, or stadium..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-emerald-400/50 w-full focus:outline-none"
              />
            </form>

            {/* Nav list */}
            <div className="flex flex-col space-y-2 border-b border-emerald-900/60 pb-4">
              <Link
                href="/"
                className="px-3 py-2 text-base font-semibold text-white hover:text-cricket-gold hover:bg-emerald-900/30 rounded-lg"
              >
                Home
              </Link>
              <Link
                href="/matches"
                className="px-3 py-2 text-base font-semibold text-white hover:text-cricket-gold hover:bg-emerald-900/30 rounded-lg flex items-center justify-between"
              >
                <span>Matches & Schedule</span>
                <span className="text-xs bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200">Fixtures</span>
              </Link>
              <Link
                href="/series"
                className="px-3 py-2 text-base font-semibold text-white hover:text-cricket-gold hover:bg-emerald-900/30 rounded-lg"
              >
                Series & Tournaments
              </Link>
              <Link
                href="/venues"
                className="px-3 py-2 text-base font-semibold text-white hover:text-cricket-gold hover:bg-emerald-900/30 rounded-lg"
              >
                Stadiums & Venues
              </Link>
              <Link
                href="/premium"
                className="px-3 py-2 text-base font-semibold text-white hover:text-cricket-gold hover:bg-emerald-900/30 rounded-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cricket-gold" />
                <span>Premium Experiences</span>
              </Link>
              <Link
                href="/group-bookings"
                className="px-3 py-2 text-base font-semibold text-white hover:text-cricket-gold hover:bg-emerald-900/30 rounded-lg"
              >
                Group & Corporate Bookings
              </Link>
              <Link
                href="/help"
                className="px-3 py-2 text-base font-semibold text-white hover:text-cricket-gold hover:bg-emerald-900/30 rounded-lg"
              >
                Help, FAQs & Policy
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/account/tickets" className="w-full">
                <Button variant="outline" className="w-full border-cricket-gold text-cricket-gold justify-center bg-transparent">
                  <Ticket className="w-4 h-4 mr-2" />
                  My Tickets
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full">
                <Button className="w-full bg-cricket-primary hover:bg-emerald-700 text-white justify-center">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-emerald-900/40">
              <Link href="/scanner" className="hover:text-cricket-gold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cricket-gold" />
                Gate Scanner
              </Link>
              <Link href="/admin" className="hover:text-cricket-gold">
                Admin Portal
              </Link>
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
