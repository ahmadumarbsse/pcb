import { getAdminUsers } from "@/services/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Shield, UserPlus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers(100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black font-serif text-white tracking-tight">
            Staff &amp; Registered Users Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Role-based access management across Fans, Box Office, Gate Turnstile, and Administrative Staff
          </p>
        </div>

        <Link href="/auth/register?staff=true">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Onboard New Staff Member
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-white shadow-lg">
        <CardContent className="p-0 overflow-x-auto">
          {users.length > 0 ? (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">CNIC</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => {
                  let roleBadgeClass = "bg-slate-800 text-slate-300 border-slate-700";
                  if (u.role === "super_admin") {
                    roleBadgeClass = "bg-amber-950 text-amber-300 border-amber-800";
                  } else if (u.role === "ticketing_admin") {
                    roleBadgeClass = "bg-emerald-950 text-emerald-300 border-emerald-800";
                  } else if (u.role === "box_office_staff") {
                    roleBadgeClass = "bg-purple-950 text-purple-300 border-purple-800";
                  } else if (u.role === "gate_staff") {
                    roleBadgeClass = "bg-blue-950 text-blue-300 border-blue-800";
                  } else if (u.role === "venue_manager") {
                    roleBadgeClass = "bg-teal-950 text-teal-300 border-teal-800";
                  }

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className={`text-[10px] uppercase font-mono ${roleBadgeClass}`}>
                          {u.role.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {u.phoneNumber || "-"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {u.cnic || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No users found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
