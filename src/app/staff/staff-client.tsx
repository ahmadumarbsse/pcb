"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Ticket,
  Search,
  Printer,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  CreditCard,
  Phone,
  Banknote,
  QrCode,
} from "lucide-react";
import { QrModal } from "@/components/shared/qr-modal";

interface StaffClientProps {
  matches: any[];
  categories: any[];
  initialRecentTickets: any[];
}

export function StaffClient({ matches, categories, initialRecentTickets }: StaffClientProps) {
  const [activeTab, setActiveTab] = React.useState<"walkin" | "search" | "history">("walkin");
  const [recentTickets, setRecentTickets] = React.useState(initialRecentTickets);

  // Walk-in form state
  const [selectedMatchId, setSelectedMatchId] = React.useState(matches[0]?.id || "");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [customerCnic, setCustomerCnic] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "POS_CARD" | "DIGITAL_WALLET">("CASH");
  const [issuing, setIssuing] = React.useState(false);
  const [issueError, setIssueError] = React.useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<{ tickets: any[]; orders: any[] }>({
    tickets: [],
    orders: [],
  });

  // QR Modal state
  const [modalTicket, setModalTicket] = React.useState<any | null>(null);

  // Filter categories by selected match
  const matchCategories = React.useMemo(() => {
    return categories.filter((c) => c.matchId === selectedMatchId);
  }, [categories, selectedMatchId]);

  // Set default category when match changes
  React.useEffect(() => {
    if (matchCategories.length > 0) {
      setSelectedCategoryId(matchCategories[0].id);
    } else {
      setSelectedCategoryId("");
    }
  }, [matchCategories]);

  const selectedCategoryObj = matchCategories.find((c) => c.id === selectedCategoryId);

  // Handle Walk-in ticket issuance
  async function handleIssueTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMatchId || !selectedCategoryId || !customerName.trim()) {
      setIssueError("Please fill in customer name and choose an enclosure.");
      return;
    }

    setIssuing(true);
    setIssueError(null);

    try {
      const res = await fetch("/api/staff/issue-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatchId,
          categoryId: selectedCategoryId,
          customerName,
          customerCnic: customerCnic || undefined,
          customerPhone: customerPhone || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Open QR Modal
        const currentMatch = matches.find((m) => m.id === selectedMatchId);
        const newTicket = {
          ticketNumber: data.ticketNumber,
          matchTitle: data.matchTitle,
          venueName: currentMatch?.venueName || "Stadium Enclosure",
          city: currentMatch?.venueCity || "Pakistan",
          gateAssigned: data.gateAssigned,
          holderName: data.customerName,
          holderCnic: customerCnic || "Walk-in Desk",
          categoryName: data.enclosure,
          tier: selectedCategoryObj?.tier || "GENERAL",
          pricePkr: data.amountPkr,
          matchDate: currentMatch?.matchDate || new Date(),
          startTime: currentMatch?.startTime || "19:00",
          qrSignatureToken: data.qrSignatureToken,
          status: "ISSUED",
        };

        setModalTicket(newTicket);
        setRecentTickets((prev) => [newTicket, ...prev]);

        // Reset form inputs
        setCustomerName("");
        setCustomerCnic("");
        setCustomerPhone("");
      } else {
        setIssueError(data.error || "Failed to issue pass");
      }
    } catch {
      setIssueError("Network error while issuing pass");
    } finally {
      setIssuing(false);
    }
  }

  // Handle Search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/staff/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults({ tickets: data.tickets || [], orders: data.orders || [] });
      }
    } catch {
      // Ignored
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 text-xs font-semibold gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("walkin")}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "walkin"
              ? "border-cricket-gold text-cricket-gold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Ticket className="w-4 h-4" />
          Walk-In Counter Ticket Issuance
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("search")}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "search"
              ? "border-cricket-gold text-cricket-gold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Search className="w-4 h-4" />
          Customer &amp; Ticket Lookup
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "history"
              ? "border-cricket-gold text-cricket-gold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Printer className="w-4 h-4" />
          Desk Issued Passes ({recentTickets.length})
        </button>
      </div>

      {/* Tab 1: Walk-In Counter Issuance */}
      {activeTab === "walkin" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-emerald-400" />
                  Instant Stadium Pass Issuance
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Issue verified match pass with HMAC QR token directly to counter customers
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {issueError && (
                  <div className="p-3 mb-4 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{issueError}</span>
                  </div>
                )}

                <form onSubmit={handleIssueTicket} className="space-y-5 text-xs">
                  {/* Select Match */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Upcoming Fixture *</Label>
                    <select
                      value={selectedMatchId}
                      onChange={(e) => setSelectedMatchId(e.target.value)}
                      className="w-full text-xs rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {matches.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title} — {m.venueCity} ({new Date(m.matchDate).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Category */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Enclosure &amp; Seating Tier *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchCategories.map((cat) => {
                        const isSelected = selectedCategoryId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`text-left p-3 rounded-xl border transition-all ${
                              isSelected
                                ? "bg-emerald-950/70 border-cricket-gold text-white ring-1 ring-cricket-gold"
                                : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex justify-between font-bold text-xs mb-1">
                              <span>{cat.name}</span>
                              <span className="text-cricket-gold font-mono">
                                PKR {cat.pricePkr.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {cat.standName} &bull; {cat.gateNumber}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Customer Full Name *
                      </Label>
                      <Input
                        placeholder="e.g. Shaheen Shah"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-xs text-white"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        CNIC Number
                      </Label>
                      <Input
                        placeholder="35201-1234567-1"
                        value={customerCnic}
                        onChange={(e) => setCustomerCnic(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Mobile Number
                      </Label>
                      <Input
                        placeholder="03001234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-1.5 pt-2">
                    <Label className="text-xs text-slate-300">Counter Payment Mode</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["CASH", "POS_CARD", "DIGITAL_WALLET"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setPaymentMethod(mode)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            paymentMethod === mode
                              ? "bg-emerald-900/60 border-emerald-400 text-white"
                              : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {mode === "CASH" ? "Cash Received" : mode === "POS_CARD" ? "Card Terminal" : "JazzCash / EasyPaisa"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <Button
                      type="submit"
                      disabled={issuing}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 text-xs shadow-lg"
                    >
                      {issuing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Printing Pass...
                        </>
                      ) : (
                        <>
                          <Printer className="w-4 h-4 mr-2" />
                          Record &amp; Issue E-Ticket Pass
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
              <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-sm font-bold text-white">Desk Pricing Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Enclosure:</span>
                    <span className="font-semibold text-white">{selectedCategoryObj?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gate:</span>
                    <span className="font-semibold text-cricket-gold">{selectedCategoryObj?.gateNumber || "-"}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Remaining Quota:</span>
                    <span className="text-emerald-400 font-bold">{selectedCategoryObj?.availableQuota ?? "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                    <span className="text-white">Amount Due:</span>
                    <span className="font-mono text-cricket-gold">
                      PKR {selectedCategoryObj?.pricePkr ? selectedCategoryObj.pricePkr.toLocaleString() : "0"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>
                    Issuing ticket automatically generates an HMAC tamper-proof digital QR token ready for gate turnstiles.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Customer & Ticket Lookup */}
      {activeTab === "search" && (
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
            <CardContent className="p-5">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <Input
                    placeholder="Search by CNIC (35201...), Ticket Number (TCK-...), Phone, or Customer Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-700 text-xs text-white h-10"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-10 px-6"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search Records"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">
              Found {searchResults.tickets.length} Matching Ticket(s)
            </h3>

            {searchResults.tickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.tickets.map((t) => (
                  <Card key={t.id} className="bg-slate-900 border-slate-800 text-white shadow-md p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-cricket-gold">{t.ticketNumber}</span>
                        <h4 className="font-bold text-sm text-white mt-0.5">{t.holderName}</h4>
                      </div>
                      <Badge className="bg-emerald-950 border-emerald-700 text-emerald-300 text-[10px]">
                        {t.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      <div>{t.matchTitle}</div>
                      <div>Enclosure: {t.categoryName} &bull; {t.gateAssigned || "Gate 1"}</div>
                      {t.holderCnic && <div className="font-mono text-[11px]">CNIC: {t.holderCnic}</div>}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setModalTicket({
                            ticketNumber: t.ticketNumber,
                            matchTitle: t.matchTitle,
                            venueName: "Stadium Enclosure",
                            city: "Pakistan",
                            gateAssigned: t.gateAssigned,
                            holderName: t.holderName,
                            holderCnic: t.holderCnic,
                            categoryName: t.categoryName,
                            tier: "GENERAL",
                            pricePkr: 0,
                            matchDate: t.matchDate,
                            startTime: "19:00",
                            qrSignatureToken: t.qrSignatureToken,
                            status: t.status,
                          })
                        }
                        className="border-slate-700 text-slate-300 text-xs h-7"
                      >
                        <QrCode className="w-3.5 h-3.5 mr-1" />
                        View / Reprint Pass
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No tickets matching &quot;{searchQuery}&quot; found.
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === "history" && (
        <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
          <CardContent className="p-0 overflow-x-auto">
            {recentTickets.length > 0 ? (
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider bg-slate-950/40">
                    <th className="py-3 px-4">Pass #</th>
                    <th className="py-3 px-4">Attendee Name</th>
                    <th className="py-3 px-4">Fixture</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Gate</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Reprint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentTickets.map((t) => (
                    <tr key={t.id || t.ticketNumber} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cricket-gold">
                        {t.ticketNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {t.holderName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {t.matchTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {t.categoryName}
                      </td>
                      <td className="py-3.5 px-4 text-cricket-gold font-mono">
                        {t.gateAssigned || "Gate 1"}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className="bg-emerald-950 border-emerald-700 text-emerald-300 text-[10px]">
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setModalTicket({
                              ticketNumber: t.ticketNumber,
                              matchTitle: t.matchTitle,
                              venueName: "Stadium Enclosure",
                              city: "Pakistan",
                              gateAssigned: t.gateAssigned,
                              holderName: t.holderName,
                              holderCnic: t.holderCnic,
                              categoryName: t.categoryName,
                              tier: "GENERAL",
                              pricePkr: t.pricePkr || 0,
                              matchDate: new Date(),
                              startTime: "19:00",
                              qrSignatureToken: t.qrSignatureToken,
                              status: t.status,
                            })
                          }
                          className="border-slate-700 text-slate-300 text-xs h-7 px-2"
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No tickets issued at counter yet.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* QR Code Pass Modal */}
      {modalTicket && (
        <QrModal
          isOpen={!!modalTicket}
          onClose={() => setModalTicket(null)}
          ticket={modalTicket}
        />
      )}
    </div>
  );
}
