"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Phone, Building, CheckCircle2, MessageSquare } from "lucide-react";

export function InquiriesClient({ initialInquiries }: { initialInquiries: any[] }) {
  const [inquiries, setInquiries] = React.useState(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = React.useState<any | null>(null);
  const [statusVal, setStatusVal] = React.useState("NEW");
  const [notesVal, setNotesVal] = React.useState("");
  const [updating, setUpdating] = React.useState(false);

  function openEdit(inq: any) {
    setSelectedInquiry(inq);
    setStatusVal(inq.status);
    setNotesVal(inq.adminQuotationNotes || "");
  }

  async function handleSave() {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/inquiries/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          status: statusVal,
          notes: notesVal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selectedInquiry.id
              ? { ...i, status: statusVal, adminQuotationNotes: notesVal }
              : i
          )
        );
        setSelectedInquiry(null);
      }
    } catch {
      // Ignored
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Edit Drawer / Modal */}
      {selectedInquiry && (
        <Card className="bg-slate-900 border-cricket-gold/60 text-white shadow-2xl p-5 animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Update Inquiry: {selectedInquiry.organizationName}
                </h3>
                <p className="text-xs text-slate-400">
                  Contact: {selectedInquiry.contactName} ({selectedInquiry.email})
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedInquiry(null)}
                className="border-slate-700 text-slate-400 text-xs h-7"
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Workflow Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cricket-gold"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUOTED">QUOTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="DECLINED">DECLINED</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Admin Quotation Notes</label>
                <Input
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  placeholder="e.g. Sent hospitality quote for 50 passes at PKR 12,000/pass"
                  className="bg-slate-950 border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updating}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                Save Inquiry Update
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
        <CardContent className="p-0 overflow-x-auto">
          {inquiries.length > 0 ? (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Preference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Quotation Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {inq.organizationName}
                      {inq.matchTitle && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          For: {inq.matchTitle}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white">{inq.contactName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" /> {inq.email}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" /> {inq.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                        {inq.organizationType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cricket-gold">
                      {inq.requestedQuantity} passes
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {inq.categoryPreference}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`text-[10px] ${
                          inq.status === "CONFIRMED"
                            ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                            : inq.status === "QUOTED"
                            ? "bg-blue-950 border-blue-700 text-blue-300"
                            : inq.status === "CONTACTED"
                            ? "bg-amber-950 border-amber-700 text-amber-300"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {inq.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                      {inq.adminQuotationNotes || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(inq)}
                        className="text-xs h-7 px-2.5 border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No group inquiries submitted yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
