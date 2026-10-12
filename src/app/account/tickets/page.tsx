import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/permissions";
import { getUserTickets } from "@/services/account";
import { TicketsView } from "@/components/account/tickets-view";
import { Ticket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AccountTicketsPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = session.user as any;
  const ticketsList = await getUserTickets(user.id);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-3 text-xs text-emerald-300">
            <Link href="/account" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account</span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black font-serif text-white">My Match Tickets</h1>
              <p className="text-xs text-stone-300">
                Official encrypted digital passes ready for gate turnstile scanning
              </p>
            </div>
            <Link href="/matches">
              <Button size="sm" className="bg-cricket-gold hover:bg-amber-400 text-stone-950 font-bold text-xs">
                Buy More Tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        <TicketsView tickets={ticketsList as any} />
      </div>
    </div>
  );
}
