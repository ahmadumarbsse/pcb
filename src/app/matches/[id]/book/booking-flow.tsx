"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Armchair,
  Sparkles,
  Tag,
  ShieldAlert,
  Loader2,
  Trash2,
  ChevronRight,
  Info,
} from "lucide-react";

interface Category {
  id: string;
  standId: string;
  name: string;
  tier: string;
  pricePkr: number;
  totalQuota: number;
  availableQuota: number;
  salesStatus: string;
  perksDescription: string | null;
  standName: string;
  standCode: string;
  gateNumber: string;
  isReservedSeating: boolean;
}

interface SeatItem {
  id: string;
  seatNumber: string;
  seatCode: string;
  rowNumber: string;
  sectionName: string;
  isWheelchairAccessible: boolean;
  isVip: boolean;
  status: "AVAILABLE" | "HELD" | "BOOKED" | "BLOCKED";
}

interface BookingFlowProps {
  match: {
    id: string;
    title: string;
    ticketLimitPerUser: number;
    salesOpen: boolean;
  };
  categories: Category[];
  stands: any[];
}

export function BookingFlow({ match, categories, stands }: BookingFlowProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<Category>(categories[0] || null);
  const [seats, setSeats] = React.useState<SeatItem[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = React.useState<string[]>([]);
  const [generalQuantity, setGeneralQuantity] = React.useState<number>(1);
  const [loadingSeats, setLoadingSeats] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Hold State
  const [holdToken, setHoldToken] = React.useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = React.useState<Date | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = React.useState<number>(0);
  const [isHolding, setIsHolding] = React.useState(false);
  const [holdConfirmed, setHoldConfirmed] = React.useState(false);

  // Attendee state
  const [attendees, setAttendees] = React.useState<Array<{ name: string; cnic: string }>>([
    { name: "", cnic: "" },
  ]);

  // Promo code state
  const [promoCode, setPromoCode] = React.useState("");
  const [promoDiscountPkr, setPromoDiscountPkr] = React.useState(0);
  const [promoMessage, setPromoMessage] = React.useState<string | null>(null);
  const [validatingPromo, setValidatingPromo] = React.useState(false);

  // Fetch seats when category changes
  React.useEffect(() => {
    if (!selectedCategory) return;
    if (selectedCategory.isReservedSeating) {
      setLoadingSeats(true);
      setErrorMsg(null);
      fetch(`/api/bookings/seats?matchId=${match.id}&standId=${selectedCategory.standId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setSeats(data.seats || []);
          } else {
            setErrorMsg(data.error || "Failed to load seating map");
          }
        })
        .catch(() => setErrorMsg("Network error loading seats"))
        .finally(() => setLoadingSeats(false));
    } else {
      setSeats([]);
    }
    // Reset selection when changing category
    setSelectedSeatIds([]);
  }, [selectedCategory, match.id]);

  // Countdown timer for seat hold
  React.useEffect(() => {
    if (!holdExpiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((holdExpiresAt.getTime() - now) / 1000));
      setTimeLeftSeconds(diff);

      if (diff <= 0) {
        clearInterval(interval);
        setHoldToken(null);
        setHoldExpiresAt(null);
        setHoldConfirmed(false);
        setErrorMsg("Your 10-minute seat hold has expired. The seats have been released.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  // Sync attendees array length with number of selected seats
  const ticketCount = selectedCategory?.isReservedSeating
    ? selectedSeatIds.length
    : generalQuantity;

  React.useEffect(() => {
    setAttendees((prev) => {
      const next = [...prev];
      while (next.length < ticketCount) {
        next.push({ name: "", cnic: "" });
      }
      return next.slice(0, Math.max(1, ticketCount));
    });
  }, [ticketCount]);

  function handleSeatToggle(seat: SeatItem) {
    if (seat.status !== "AVAILABLE") return;
    if (holdToken) {
      setErrorMsg("Release your existing hold before changing seat selection.");
      return;
    }

    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      } else {
        if (prev.length >= match.ticketLimitPerUser) {
          setErrorMsg(`Limit reached: Maximum ${match.ticketLimitPerUser} tickets allowed per user.`);
          return prev;
        }
        setErrorMsg(null);
        return [...prev, seat.id];
      }
    });
  }

  // Create Seat Hold
  async function handleLockSeats() {
    if (ticketCount === 0) {
      setErrorMsg("Please select at least one seat.");
      return;
    }

    setIsHolding(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/bookings/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          categoryId: selectedCategory.id,
          seatIds: selectedCategory.isReservedSeating ? selectedSeatIds : undefined,
          quantity: selectedCategory.isReservedSeating ? undefined : generalQuantity,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHoldToken(data.holdToken);
        const exp = new Date(data.expiresAt);
        setHoldExpiresAt(exp);
        setTimeLeftSeconds(Math.floor((exp.getTime() - Date.now()) / 1000));
        setHoldConfirmed(true);
      } else {
        setErrorMsg(data.error || "Failed to hold seats");
      }
    } catch {
      setErrorMsg("Network error creating seat hold");
    } finally {
      setIsHolding(false);
    }
  }

  // Release Seat Hold
  async function handleReleaseHold() {
    if (!holdToken) return;
    setIsHolding(true);
    try {
      await fetch(`/api/bookings/hold?holdToken=${holdToken}`, { method: "DELETE" });
      setHoldToken(null);
      setHoldExpiresAt(null);
      setHoldConfirmed(false);
      setSelectedSeatIds([]);
      setPromoDiscountPkr(0);
      setPromoMessage(null);
    } catch {
      // Ignored
    } finally {
      setIsHolding(false);
    }
  }

  // Validate Promo Code
  async function handleApplyPromo() {
    if (!promoCode.trim()) return;
    setValidatingPromo(true);
    setPromoMessage(null);

    const subtotal = (selectedCategory?.pricePkr || 0) * ticketCount;

    try {
      const res = await fetch("/api/promos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, subtotalPkr: subtotal }),
      });

      const data = await res.json();
      if (data.valid) {
        setPromoDiscountPkr(data.discountPkr);
        setPromoMessage(data.message);
      } else {
        setPromoDiscountPkr(0);
        setPromoMessage(data.message || "Invalid promo code");
      }
    } catch {
      setPromoMessage("Error validating promo code");
    } finally {
      setValidatingPromo(false);
    }
  }

  // Financial calculations
  const unitPrice = selectedCategory?.pricePkr || 0;
  const subtotalPkr = unitPrice * ticketCount;
  const arenaFeePkr = ticketCount > 0 ? 150 : 0;
  const finalTotalPkr = Math.max(0, subtotalPkr - promoDiscountPkr + arenaFeePkr);

  // Format countdown mm:ss
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedCountdown = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      {/* Active Hold Countdown Banner */}
      {holdToken && (
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 border-2 border-cricket-gold/60 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cricket-gold/20 border border-cricket-gold flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-cricket-gold animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Seats Held in Database</span>
                <Badge className="bg-cricket-gold text-slate-950 font-bold">10-Min Hold</Badge>
              </div>
              <p className="text-xs text-emerald-200/90">
                These seats are locked specifically for you. Complete your attendee details below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Time Remaining</span>
              <span className="text-2xl font-mono font-black text-cricket-gold tracking-widest">
                {formattedCountdown}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReleaseHold}
              disabled={isHolding}
              className="border-red-500/40 text-red-300 hover:bg-red-950/60 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Release
            </Button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-950/60 border border-red-800 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Enclosures & Interactive Seat Map */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Enclosure & Tier Selection */}
          <Card className="bg-slate-900 border-emerald-900/40 text-white shadow-lg">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-xs flex items-center justify-center font-mono">
                      1
                    </span>
                    Select Enclosure & Stand Tier
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-1">
                    Choose from VIP Hospitality, Premium Cushioned, or General Enclosures
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (!holdToken) {
                        setSelectedCategory(cat);
                      }
                    }}
                    disabled={!!holdToken}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-emerald-950/70 border-cricket-gold shadow-md ring-1 ring-cricket-gold"
                        : "bg-slate-800/60 border-slate-700/60 hover:border-emerald-700/60 hover:bg-slate-800"
                    } ${holdToken ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{cat.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-semibold ${
                          cat.tier === "VIP"
                            ? "border-amber-400 text-amber-300 bg-amber-950/40"
                            : "border-emerald-400 text-emerald-300 bg-emerald-950/40"
                        }`}
                      >
                        {cat.tier}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-400 mb-2">{cat.standName} &bull; {cat.gateNumber}</div>

                    {cat.perksDescription && (
                      <p className="text-[11px] text-slate-300 mb-3 line-clamp-2">
                        {cat.perksDescription}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                      <div className="text-xs text-slate-400">
                        {cat.availableQuota > 0 ? (
                          <span className="text-emerald-400">{cat.availableQuota} available</span>
                        ) : (
                          <span className="text-red-400">Sold out</span>
                        )}
                      </div>
                      <div className="text-right font-bold text-base text-cricket-gold">
                        PKR {cat.pricePkr.toLocaleString()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Step 2: Interactive Seat Map or General Admission Quantity */}
          <Card className="bg-slate-900 border-emerald-900/40 text-white shadow-lg">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-xs flex items-center justify-center font-mono">
                      2
                    </span>
                    {selectedCategory?.isReservedSeating ? "Interactive Seat Map" : "Quantity Selection"}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-1">
                    {selectedCategory?.isReservedSeating
                      ? `Select numbered seats in ${selectedCategory?.name} (${selectedSeatIds.length}/${match.ticketLimitPerUser} selected)`
                      : `Select number of general tickets (Max ${match.ticketLimitPerUser})`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {selectedCategory?.isReservedSeating ? (
                <div>
                  {/* Seat Map Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 mb-6 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded border border-emerald-400 bg-slate-900" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-emerald-600 border border-emerald-400 shadow-sm" />
                      <span className="text-white font-medium">Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-amber-500/80 border border-amber-400" />
                      <span>Held</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-slate-700 opacity-40 cursor-not-allowed" />
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cricket-gold" />
                      <span>VIP</span>
                    </div>
                  </div>

                  {/* Stadium Pitch Direction Indicator */}
                  <div className="text-center mb-6">
                    <div className="inline-block px-8 py-1.5 bg-emerald-950/70 border border-emerald-800/80 rounded-full text-xs text-emerald-300 uppercase tracking-widest font-semibold">
                      🏏 PITCH & PLAYING FIELD
                    </div>
                  </div>

                  {loadingSeats ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-cricket-gold" />
                      <p className="text-sm">Querying real-time seat status from PostgreSQL...</p>
                    </div>
                  ) : seats.length > 0 ? (
                    <div className="space-y-4 max-h-[380px] overflow-y-auto p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                      {/* Group seats by row */}
                      {Array.from(new Set(seats.map((s) => s.rowNumber))).sort().map((rowNum) => {
                        const rowSeats = seats.filter((s) => s.rowNumber === rowNum);
                        return (
                          <div key={rowNum} className="flex items-center gap-3 justify-center">
                            <span className="w-6 text-xs font-mono font-bold text-slate-400 text-right">
                              Row {rowNum}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {rowSeats.map((seat) => {
                                const isSelected = selectedSeatIds.includes(seat.id);
                                const isAvailable = seat.status === "AVAILABLE";
                                const isHeld = seat.status === "HELD";
                                const isBooked = seat.status === "BOOKED";

                                let btnClass = "border-emerald-500/50 bg-slate-800/80 hover:bg-emerald-800 hover:border-emerald-400 text-white";
                                if (isSelected) {
                                  btnClass = "bg-emerald-600 border-emerald-300 text-white font-bold ring-2 ring-emerald-400 scale-105";
                                } else if (isHeld) {
                                  btnClass = "bg-amber-600/70 border-amber-400 text-amber-100 cursor-not-allowed";
                                } else if (isBooked) {
                                  btnClass = "bg-slate-800 text-slate-500 border-slate-700 opacity-40 cursor-not-allowed";
                                }

                                return (
                                  <button
                                    key={seat.id}
                                    type="button"
                                    onClick={() => handleSeatToggle(seat)}
                                    disabled={!isAvailable && !isSelected}
                                    title={`${seat.seatCode} - ${seat.status}${seat.isVip ? " (VIP)" : ""}`}
                                    className={`relative w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center border transition-all ${btnClass}`}
                                  >
                                    {seat.seatNumber}
                                    {seat.isVip && (
                                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cricket-gold" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No reserved seats configured for this stand.
                    </div>
                  )}
                </div>
              ) : (
                /* General Admission Selector */
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div>
                      <p className="font-semibold text-white text-sm">General Admission Passes</p>
                      <p className="text-xs text-slate-400">First come first served seating in enclosure</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={generalQuantity <= 1 || !!holdToken}
                        onClick={() => setGeneralQuantity((q) => Math.max(1, q - 1))}
                        className="h-8 w-8 p-0 border-slate-700 text-white"
                      >
                        -
                      </Button>
                      <span className="font-mono text-base font-bold w-6 text-center text-white">
                        {generalQuantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={generalQuantity >= match.ticketLimitPerUser || !!holdToken}
                        onClick={() => setGeneralQuantity((q) => Math.min(match.ticketLimitPerUser, q + 1))}
                        className="h-8 w-8 p-0 border-slate-700 text-white"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Attendee Details */}
          <Card className="bg-slate-900 border-emerald-900/40 text-white shadow-lg">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-xs flex items-center justify-center font-mono">
                  3
                </span>
                Attendee Information
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Required for security verification & gate entrance matching CNIC
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {attendees.map((attendee, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cricket-gold">
                      Ticket {idx + 1} {selectedSeatIds[idx] ? `(Seat ${selectedSeatIds[idx]})` : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-300">Attendee Full Name</Label>
                      <Input
                        placeholder="e.g. Tariq Mehmood"
                        value={attendee.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAttendees((arr) => {
                            const copy = [...arr];
                            copy[idx] = { ...copy[idx], name: val };
                            return copy;
                          });
                        }}
                        className="bg-slate-900 border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-300">CNIC / B-Form Number</Label>
                      <Input
                        placeholder="35201-1234567-1"
                        value={attendee.cnic}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAttendees((arr) => {
                            const copy = [...arr];
                            copy[idx] = { ...copy[idx], cnic: val };
                            return copy;
                          });
                        }}
                        className="bg-slate-900 border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Pricing Summary & Hold Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-900 border-emerald-900/40 text-white shadow-xl sticky top-24">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-lg font-bold text-white flex items-center justify-between">
                <span>Booking Summary</span>
                <Badge className="bg-emerald-950 border-emerald-700 text-emerald-300 text-xs">
                  {ticketCount} {ticketCount === 1 ? "Ticket" : "Tickets"}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-5">
              {/* Category details */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Enclosure:</span>
                  <span className="font-semibold text-white">{selectedCategory?.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tier:</span>
                  <span className="font-semibold text-white">{selectedCategory?.tier}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Assigned Gate:</span>
                  <span className="font-semibold text-cricket-gold">{selectedCategory?.gateNumber}</span>
                </div>
                {selectedCategory?.isReservedSeating && selectedSeatIds.length > 0 && (
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                    <span>Seats:</span>
                    <span className="font-mono font-semibold text-emerald-300">
                      {selectedSeatIds.length} seat(s) picked
                    </span>
                  </div>
                )}
              </div>

              {/* Promo code box */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cricket-gold" />
                  Promo Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. PCB2026"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="bg-slate-950 border-slate-700 text-xs text-white uppercase font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    disabled={validatingPromo || !promoCode.trim()}
                    className="border-cricket-gold/40 text-cricket-gold hover:bg-cricket-gold/10 text-xs"
                  >
                    {validatingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                  </Button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoDiscountPkr > 0 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>
                    Subtotal ({ticketCount} &times; PKR {unitPrice.toLocaleString()})
                  </span>
                  <span className="font-mono text-white">PKR {subtotalPkr.toLocaleString()}</span>
                </div>

                {promoDiscountPkr > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promotional Discount</span>
                    <span className="font-mono">- PKR {promoDiscountPkr.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>Arena Security & Facility Fee</span>
                  <span className="font-mono text-white">PKR {arenaFeePkr.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span className="text-cricket-gold">Total Amount (PKR)</span>
                  <span className="font-mono text-base text-cricket-gold">
                    PKR {finalTotalPkr.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {!holdToken ? (
                  <Button
                    type="button"
                    onClick={handleLockSeats}
                    disabled={isHolding || ticketCount === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 text-sm rounded-xl shadow-lg transition-transform active:scale-95"
                  >
                    {isHolding ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Armchair className="w-4 h-4 mr-2" />
                    )}
                    Reserve & Hold {ticketCount} {ticketCount === 1 ? "Seat" : "Seats"} (10 Mins)
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-950/60 border border-emerald-600/60 rounded-xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Seats Locked in Database
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Hold Token: <span className="font-mono text-cricket-gold">{holdToken.slice(0, 16)}...</span>
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={handleReleaseHold}
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                    >
                      Cancel Reservation & Release Seats
                    </Button>
                  </div>
                )}
              </div>

              {/* Helpful notice */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
                <Info className="w-4 h-4 text-cricket-gold shrink-0 mt-0.5" />
                <span>
                  Demo ticketing inventory. Real-time PostgreSQL atomic hold locks seats for 10 minutes to prevent concurrent booking conflicts.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
