"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function GroupBookingForm() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ inquiryId: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessData(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      organizationName: formData.get("organizationName") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      requestedQuantity: parseInt(formData.get("requestedQuantity") as string, 10),
      categoryPreference: formData.get("categoryPreference") as string,
      organizationType: formData.get("organizationType") as string,
      notes: formData.get("notes") as string,
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please check form inputs.");
      }

      setSuccessData({ inquiryId: data.inquiryId, message: data.message });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
      {successData ? (
        <Alert variant="success" className="mb-6">
          <CheckCircle2 className="w-5 h-5" />
          <AlertTitle className="text-base font-bold">Inquiry Successfully Registered!</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>{successData.message}</p>
            <div className="text-xs font-mono bg-emerald-100/80 p-2 rounded text-emerald-900 w-fit">
              Reference ID: <strong>{successData.inquiryId}</strong>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSuccessData(null)}
              className="mt-2 text-xs"
            >
              Submit Another Inquiry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="organizationName">Organization / School / Company Name *</Label>
              <Input
                id="organizationName"
                name="organizationName"
                placeholder="e.g. Lahore Grammar School / Engro Corp"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactName">Primary Contact Person *</Label>
              <Input
                id="contactName"
                name="contactName"
                placeholder="e.g. Bilal Ahmed"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Official Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="corporate@domain.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Contact Telephone / Mobile *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0300 1234567"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="requestedQuantity">Estimated Number of Passes *</Label>
              <Input
                id="requestedQuantity"
                name="requestedQuantity"
                type="number"
                min="10"
                max="2000"
                defaultValue="25"
                required
              />
              <span className="text-[11px] text-muted-foreground">Minimum group allocation is 10</span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="organizationType">Organization Category *</Label>
              <select
                id="organizationType"
                name="organizationType"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cricket-primary"
                required
              >
                <option value="CORPORATE">Corporate Business</option>
                <option value="SCHOOL">School / College / University</option>
                <option value="CRICKET_CLUB">Registered Cricket Club</option>
                <option value="COMMUNITY">Community / NGO</option>
                <option value="OTHER">Other Delegation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryPreference">Seating Enclosure Preference</Label>
              <select
                id="categoryPreference"
                name="categoryPreference"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cricket-primary"
              >
                <option value="HOSPITALITY">Private Luxury Suite (VIP)</option>
                <option value="PREMIUM">Premium Covered Enclosure</option>
                <option value="FIRST_CLASS">First Class Grandstand</option>
                <option value="GENERAL">General Admission Bleachers</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Additional Requirements or Special Dates</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Specify fixture dates, catering requirements, coach parking, or student group needs..."
              className="flex w-full rounded-lg border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cricket-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cricket-primary hover:bg-emerald-800 text-white font-bold h-11 text-sm shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Group Inquiry...
              </>
            ) : (
              "Submit Group Booking Quotation Request"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
