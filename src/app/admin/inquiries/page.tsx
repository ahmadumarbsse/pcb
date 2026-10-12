import { getAdminInquiries } from "@/services/admin";
import { InquiriesClient } from "./inquiries-client";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black font-serif text-white tracking-tight">
          Group &amp; Corporate Inquiries
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review corporate hospitality requests, school allocations, and provide box office quotations
        </p>
      </div>

      <InquiriesClient initialInquiries={inquiries} />
    </div>
  );
}
