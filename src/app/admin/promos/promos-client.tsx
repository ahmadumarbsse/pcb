"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Plus, Loader2, CheckCircle2 } from "lucide-react";

export function PromosClient({ initialPromos }: { initialPromos: any[] }) {
  const [promos, setPromos] = React.useState(initialPromos);
  const [showCreate, setShowCreate] = React.useState(false);

  // Form state
  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = React.useState(15);
  const [minOrder, setMinOrder] = React.useState(1000);
  const [maxDiscount, setMaxDiscount] = React.useState(2500);
  const [usageLimit, setUsageLimit] = React.useState(500);
  const [creating, setCreating] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue,
          minOrderAmountPkr: minOrder,
          maxDiscountPkr: maxDiscount,
          usageLimit,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPromos((prev) => [
          {
            id: data.id,
            code: data.code,
            discountType,
            discountValue,
            minOrderAmountPkr: minOrder,
            maxDiscountPkr: maxDiscount,
            usageLimit,
            usedCount: 0,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
          },
          ...prev,
        ]);
        setShowCreate(false);
        setCode("");
      } else {
        setErrorMsg(data.error || "Failed to create promo code");
      }
    } catch {
      setErrorMsg("Network error creating promo code");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {showCreate ? "Cancel" : "Create New Promo Code"}
        </Button>
      </div>

      {showCreate && (
        <Card className="bg-slate-900 border-cricket-gold/60 text-white shadow-xl animate-in fade-in duration-150">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-cricket-gold" />
              Issue New Discount Code
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Set discount criteria, minimum cart thresholds, and maximum discount caps in PKR
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleCreate} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Voucher Code (uppercase)</Label>
                  <Input
                    placeholder="e.g. PCB2026"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="bg-slate-950 border-slate-700 text-xs font-mono uppercase text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Discount Type</Label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">
                    Discount Value {discountType === "PERCENTAGE" ? "(%)" : "(PKR)"}
                  </Label>
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Min Order Amount (PKR)</Label>
                  <Input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Max Discount Cap (PKR)</Label>
                  <Input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Usage Quota (Max Orders)</Label>
                  <Input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                  Save Promo Code
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Promos Table */}
      <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
        <CardContent className="p-0 overflow-x-auto">
          {promos.length > 0 ? (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Order</th>
                  <th className="py-3 px-4">Max Cap</th>
                  <th className="py-3 px-4">Redemptions</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {promos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cricket-gold">
                      {p.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.discountType === "PERCENTAGE"
                        ? `${p.discountValue}% OFF`
                        : `PKR ${p.discountValue} OFF`}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      PKR {p.minOrderAmountPkr?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {p.maxDiscountPkr ? `PKR ${p.maxDiscountPkr.toLocaleString()}` : "No limit"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {p.usedCount} / {p.usageLimit}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(p.validUntil).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                          Disabled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No promotional codes configured.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
