"use client";

import { useState } from "react";
import { QrModal } from "@/components/shared/qr-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Ticket, Calendar, Clock, MapPin, Download } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

interface TicketItem {
  id: string;
  ticketNumber: string;
  orderId: string;
  holderName: string;
  holderCnic?: string | null;
  qrSignatureToken: string;
  status: string;
  gateAssigned?: string | null;
  issuedAt: Date | string;
  matchId: string;
  matchTitle: string;
  homeTeam: string;
  awayTeam: string;
  format: string;
  matchDate: Date | string;
  startTime: string;
  venueName: string;
  city: string;
  categoryName: string;
  tier: string;
  pricePkr: number;
  seatNumber?: string | null;
  seatCode?: string | null;
}

export function TicketsView({ tickets }: { tickets: TicketItem[] }) {
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  if (tickets.length === 0) {
    return (
      <Card className="bg-white border-slate-200 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-cricket-primary flex items-center justify-center mx-auto border border-emerald-200">
          <Ticket className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Tickets Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          You have no issued tickets in your account yet. When you complete a booking, your cryptographically signed QR passes will appear here.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((t) => (
          <Card
            key={t.id}
            className="overflow-hidden border border-slate-200 bg-white hover:border-cricket-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-950 to-cricket-dark p-4 text-white flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-cricket-gold">{t.ticketNumber}</span>
                <Badge variant={t.status === "ISSUED" ? "upcoming" : "secondary"} className="text-[10px]">
                  {t.status}
                </Badge>
              </div>

              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-base text-foreground font-serif">{t.matchTitle}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cricket-primary shrink-0" />
                    <span>{t.venueName}, {t.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cricket-primary" />
                    <span>{formatDate(t.matchDate, "short")}</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cricket-primary" />
                    <span>{formatTime(t.startTime)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Enclosure / Tier</span>
                    <span className="font-bold text-foreground">{t.categoryName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Seat Coordinate</span>
                    <span className="font-bold text-cricket-primary">{t.seatCode || t.seatNumber || "General Admission"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Gate</span>
                    <span className="font-semibold text-foreground">{t.gateAssigned || "Gate 2"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Attendee</span>
                    <span className="font-semibold text-foreground truncate block">{t.holderName}</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-5 pt-0">
              <Button
                onClick={() => setSelectedTicket(t)}
                className="w-full bg-cricket-primary hover:bg-emerald-800 text-white font-bold text-xs h-10 gap-2 shadow-sm"
              >
                <QrCode className="w-4 h-4 text-cricket-gold" />
                <span>Show Turnstile QR Pass</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedTicket && (
        <QrModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          ticket={selectedTicket}
        />
      )}
    </>
  );
}
