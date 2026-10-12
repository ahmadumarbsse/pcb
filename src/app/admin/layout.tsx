import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Users,
  Tag,
  Inbox,
  ArrowLeft,
  ShieldCheck,
  Armchair,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/matches", label: "Fixtures & Sales", icon: Calendar },
    { href: "/admin/orders", label: "Orders & Passes", icon: ShoppingBag },
    { href: "/admin/inquiries", label: "Group Inquiries", icon: Inbox },
    { href: "/admin/promos", label: "Promotions", icon: Tag },
    { href: "/admin/users", label: "Staff & Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-950 border border-cricket-gold flex items-center justify-center shadow-md">
              <span className="text-xs font-black text-cricket-gold">PCB</span>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-white font-serif uppercase">
                PCB Operations
              </h2>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Administrator Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Operational Shortcuts & Exit */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2 px-2 text-xs">
          <Link
            href="/gate"
            className="flex items-center gap-2 text-slate-400 hover:text-cricket-gold transition-colors py-1"
          >
            <ShieldCheck className="w-4 h-4 text-cricket-gold" />
            <span>Gate Staff Scanner</span>
          </Link>
          <Link
            href="/staff"
            className="flex items-center gap-2 text-slate-400 hover:text-cricket-gold transition-colors py-1"
          >
            <Armchair className="w-4 h-4 text-emerald-400" />
            <span>Box Office Desk</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
