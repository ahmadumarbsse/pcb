import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/permissions";
import { getUserTickets, getUserOrders } from "@/services/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Ticket, ShoppingBag, Shield, LogOut, Calendar, MapPin, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AccountPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = session.user as any;
  const [ticketsList, ordersList] = await Promise.all([
    getUserTickets(user.id),
    getUserOrders(user.id),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-800 border-2 border-cricket-gold flex items-center justify-center font-bold text-2xl text-white shadow-md">
                {user.name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black font-serif text-white">{user.name}</h1>
                  <Badge variant="gold" className="text-[10px] uppercase">
                    {user.role || "Fan"}
                  </Badge>
                </div>
                <p className="text-xs text-stone-300">{user.email}</p>
                {user.cnic && (
                  <p className="text-[11px] font-mono text-emerald-300">CNIC: {user.cnic}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/account/tickets">
                <Button size="sm" className="bg-cricket-gold hover:bg-amber-400 text-stone-950 font-bold text-xs">
                  <Ticket className="w-4 h-4 mr-1.5" />
                  View Passes ({ticketsList.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-cricket-primary border border-emerald-100">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Active Tickets</span>
                <span className="text-2xl font-black text-foreground">{ticketsList.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-cricket-primary border border-emerald-100">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Total Orders</span>
                <span className="text-2xl font-black text-foreground">{ordersList.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-cricket-primary border border-emerald-100">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Account Security</span>
                <span className="text-sm font-bold text-emerald-700">Verified &bull; CNIC Bound</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tickets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent Match Tickets</h2>
            <Link href="/account/tickets" className="text-xs text-cricket-primary font-semibold hover:underline">
              View All ({ticketsList.length}) &rarr;
            </Link>
          </div>

          {ticketsList.length === 0 ? (
            <Card className="bg-white border-slate-200 p-8 text-center space-y-3">
              <p className="text-xs text-muted-foreground">You have not booked any match tickets yet.</p>
              <Link href="/matches">
                <Button size="sm" className="bg-cricket-primary text-white text-xs">
                  Browse Upcoming Matches
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ticketsList.slice(0, 2).map((t) => (
                <Card key={t.id} className="bg-white border-slate-200 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cricket-primary">{t.ticketNumber}</span>
                    <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{t.matchTitle}</h4>
                    <p className="text-xs text-muted-foreground">{t.venueName}, {t.city}</p>
                  </div>
                  <div className="text-xs text-stone-600 flex justify-between pt-2 border-t border-slate-100">
                    <span>Gate: {t.gateAssigned || "Gate 2"}</span>
                    <span>Seat: {t.seatCode || "General"}</span>
                  </div>
                  <Link href="/account/tickets" className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View QR Pass
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
