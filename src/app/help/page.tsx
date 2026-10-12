"use client";

import { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Ticket,
  CreditCard,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface FAQItem {
  question: string;
  answer: string;
  category: "booking" | "payments" | "delivery" | "entry" | "refunds";
}

const FAQS: FAQItem[] = [
  {
    category: "booking",
    question: "How many tickets can I purchase per match?",
    answer: "To ensure fair allocation and combat black-market scalping, every registered fan account is limited to a maximum of 6 tickets per international T20/ODI match, or up to 8 tickets for Test matches. For larger groups, please submit a corporate group booking request.",
  },
  {
    category: "booking",
    question: "How does the 10-minute seat hold work?",
    answer: "When you select your seats or stand categories, the system places a 10-minute temporary concurrency hold in our database. During this countdown, no other fan can purchase your selected seats. If payment is not completed before the countdown expires, the seats are automatically returned to public inventory.",
  },
  {
    category: "payments",
    question: "What payment methods are supported on the portal?",
    answer: "We support major local and international payment methods including Pakistani debit/credit cards (1Link, PayPak, Visa, Mastercard), Easypaisa mobile wallets, JazzCash, and direct online banking checkout.",
  },
  {
    category: "payments",
    question: "Are payment transactions and card details stored securely?",
    answer: "Yes. In strict compliance with global PCI-DSS and security guidelines, our platform never receives or stores your full credit card number or CVV code. All transactions are tokenized and processed through secure, bank-grade payment gateway adapters.",
  },
  {
    category: "delivery",
    question: "How will I receive my tickets?",
    answer: "Upon confirmed payment verification, your tickets are generated instantly in your fan account under 'My Tickets'. Each pass contains an encrypted, tamper-resistant QR code token that can be downloaded as a PDF, added to Apple/Google Wallet where supported, or printed.",
  },
  {
    category: "delivery",
    question: "Can I transfer a ticket to a friend or family member?",
    answer: "Yes! You can securely transfer individual tickets from your account dashboard by entering the recipient's name and email address. When the transfer is accepted, your old pass is invalidated immediately and a fresh, securely signed QR token is issued to the recipient.",
  },
  {
    category: "entry",
    question: "What documents must I present at the stadium turnstiles?",
    answer: "All ticket holders aged 18 and older must present their digital or printed E-ticket with a clear QR code alongside an original National Identity Card (CNIC) or Passport matching the attendee name.",
  },
  {
    category: "entry",
    question: "What items are prohibited inside stadium enclosures?",
    answer: "Strictly prohibited items include: glass bottles, metal cans, fireworks, flares, lasers, sharp instruments, political/offensive banners, hard coolers, and professional filming cameras without PCB accreditation. Bags larger than A4 size are discouraged.",
  },
  {
    category: "refunds",
    question: "What is the official match cancellation refund policy?",
    answer: "If an international match is cancelled or abandoned without a single ball bowled due to rain or unforeseen circumstances, all ticket holders are automatically refunded 100% of the face value to their original payment source. Refund requests for rescheduled matches can be submitted via your account dashboard.",
  },
  {
    category: "refunds",
    question: "Can I voluntarily cancel my ticket if I cannot attend?",
    answer: "Voluntary cancellations must be submitted at least 48 hours prior to scheduled matchday gate opening. A 15% administrative restocking fee applies, and the remaining balance is refunded to your account wallet or payment method.",
  },
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory !== "ALL" && faq.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-14 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3">
          <Badge variant="gold" className="text-xs uppercase font-bold px-3 py-1">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            FAN SUPPORT &amp; KNOWLEDGE BASE
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-stone-300">
            Find answers regarding digital passes, turnstile entry protocols, seat holds, payment gateways, and refund guidelines.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4 relative">
            <Search className="w-5 h-5 absolute left-4 top-7 text-stone-400" />
            <input
              type="text"
              placeholder="Search help topics (e.g. refund, CNIC, QR code, payment)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-stone-900 placeholder-stone-400 text-sm border-2 border-emerald-800 focus:outline-none focus:border-cricket-gold shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="container mx-auto px-4 py-10 flex-1 max-w-4xl">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "ALL"
                ? "bg-cricket-primary text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setActiveCategory("booking")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "booking"
                ? "bg-cricket-primary text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Booking &amp; Seat Holds
          </button>
          <button
            onClick={() => setActiveCategory("payments")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "payments"
                ? "bg-cricket-primary text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Payments &amp; Wallets
          </button>
          <button
            onClick={() => setActiveCategory("delivery")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "delivery"
                ? "bg-cricket-primary text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            E-Tickets &amp; QR Delivery
          </button>
          <button
            onClick={() => setActiveCategory("entry")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "entry"
                ? "bg-cricket-primary text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Turnstile Entry &amp; Rules
          </button>
          <button
            onClick={() => setActiveCategory("refunds")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "refunds"
                ? "bg-cricket-primary text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Refunds &amp; Rain Policy
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-muted-foreground">
                No matching answers found for &ldquo;{searchQuery}&rdquo;. Try another search term.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-foreground hover:text-cricket-primary transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-cricket-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Stadium Code of Conduct Anchor */}
        <div id="code-of-conduct" className="mt-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-cricket-primary">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="text-lg font-bold text-foreground">Stadium Spectator Code of Conduct</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Pakistan Cricket Board is committed to providing a safe, welcoming, and family-friendly environment for all spectators. Fans must adhere to standard ground regulations: respect players and officials, occupy only the designated seat stated on their digital pass, refrain from encroaching on the pitch or throwing objects, and follow instructions given by security personnel and police authorities. Violators are subject to immediate expulsion without refund and prosecution under relevant public order legislation.
          </p>
        </div>
      </div>
    </div>
  );
}
