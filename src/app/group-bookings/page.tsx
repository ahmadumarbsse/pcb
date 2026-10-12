import { GroupBookingForm } from "@/components/forms/group-booking-form";
import { Users, School, Building2, Trophy, ShieldCheck, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GroupBookingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-14 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3">
          <Badge variant="gold" className="text-xs uppercase font-bold px-3 py-1">
            <Users className="w-3.5 h-3.5 mr-1" />
            GROUP &amp; CORPORATE QUOTATIONS
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-white">
            Bulk Matchday Allocations
          </h1>
          <p className="text-sm sm:text-base text-stone-300">
            Specialized ticket booking, corporate billing, invoice generation, and designated block seating for schools, colleges, cricket academies, and corporate enterprises.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-8">
            <GroupBookingForm />
          </div>

          {/* Right Column: Group Policy and Help */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-foreground">Why Book as a Group?</h3>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Adjacent Seating Blocks:</strong> Ensure your entire group or school cohort sits together in connected rows.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Official Invoicing:</strong> Direct bank transfer options with formal tax invoices for accounts departments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <School className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Student &amp; Youth Rates:</strong> Discounted general enclosure quotas for verified educational institutions.</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-950 p-6 rounded-2xl border border-emerald-800 text-white space-y-3">
              <h4 className="font-bold text-sm text-cricket-gold">Dedicated Corporate Desk</h4>
              <p className="text-xs text-stone-300">
                For urgent enquiries or packages exceeding 200 tickets, contact our direct corporate relations managers:
              </p>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cricket-gold" />
                  <span>+92 42 111-22-722 (Ext. 401)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cricket-gold" />
                  <span>groups@pcb-cricket.demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
