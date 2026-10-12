/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ShieldCheck, Ticket, User, MapPin, Calendar, Clock } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    ticketNumber: string;
    matchTitle: string;
    venueName: string;
    city: string;
    gateAssigned?: string | null;
    seatCode?: string | null;
    seatNumber?: string | null;
    holderName: string;
    holderCnic?: string | null;
    categoryName: string;
    tier: string;
    pricePkr: number;
    matchDate: Date | string;
    startTime: string;
    qrSignatureToken: string;
    status: string;
  };
}

export function QrModal({ isOpen, onClose, ticket }: QrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (ticket.qrSignatureToken) {
      QRCode.toDataURL(ticket.qrSignatureToken, {
        width: 260,
        margin: 2,
        color: {
          dark: "#052e16",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [ticket.qrSignatureToken]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-emerald-800">
        {/* Ticket Header Art */}
        <div className="bg-gradient-to-r from-emerald-950 via-cricket-dark to-emerald-950 p-5 text-white text-center relative">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-800/60 text-xs">
            <span className="font-bold text-cricket-gold tracking-widest uppercase">Official Match Pass</span>
            <Badge variant="gold" className="text-[10px]">{ticket.tier}</Badge>
          </div>
          <h3 className="font-serif font-black text-lg text-white mt-2 leading-tight">
            {ticket.matchTitle}
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            {ticket.venueName}, {ticket.city}
          </p>
        </div>

        {/* QR Code Centerpiece */}
        <div className="p-6 flex flex-col items-center text-center bg-slate-50 border-b border-dashed border-slate-200">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Pass for ${ticket.ticketNumber}`}
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-400">
                Generating QR Token...
              </div>
            )}
          </div>

          <div className="mt-3">
            <span className="text-[10px] font-mono text-muted-foreground block">Pass Reference</span>
            <span className="font-mono text-xs font-bold text-cricket-primary">{ticket.ticketNumber}</span>
          </div>
        </div>

        {/* Attendee & Seating Details */}
        <div className="p-5 space-y-3 text-xs bg-white">
          <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
            <div>
              <span className="text-muted-foreground block text-[10px]">Gate Assignment</span>
              <span className="font-bold text-foreground">{ticket.gateAssigned || "Gate 2 (General)"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Seat Number</span>
              <span className="font-bold text-cricket-primary">{ticket.seatCode || ticket.seatNumber || "General"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground block text-[10px]">Pass Holder</span>
              <span className="font-semibold text-foreground truncate block">{ticket.holderName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">CNIC Reference</span>
              <span className="font-mono text-stone-600">{ticket.holderCnic || "On File"}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-slate-200"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="bg-cricket-primary hover:bg-emerald-800 text-white text-xs gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
