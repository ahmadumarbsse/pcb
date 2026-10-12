"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, Loader2, AlertCircle, Shield, Sparkles, Building, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        throw new Error(res.error.message || "Invalid email or password.");
      }

      const userRole = (res.data?.user as any)?.role || "fan";

      // Smart Redirect based on role
      if (["super_admin", "ticketing_admin", "venue_manager"].includes(userRole)) {
        router.push("/admin");
      } else if (userRole === "box_office_staff") {
        router.push("/staff");
      } else if (userRole === "gate_staff") {
        router.push("/gate");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand / Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-950 border-2 border-cricket-gold flex items-center justify-center mx-auto shadow-md">
            <span className="text-sm font-black text-cricket-gold">PCB</span>
          </div>
          <h1 className="text-2xl font-black font-serif text-foreground">Sign In to Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Official portal for fans, box office operations, gate turnstiles, and administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-[11px] text-cricket-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cricket-primary hover:bg-emerald-800 text-white font-bold h-10 text-xs shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill for all 6 roles */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                One-Click Role Quick Logins
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Live Neon DB Seeded
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials("superadmin@pcb.demo", "SuperAdmin@2026!")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground group-hover:text-emerald-800">Super Admin</span>
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span className="text-[10px] text-stone-400 block truncate">superadmin@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("ticketingadmin@pcb.demo", "TicketAdmin@2026!")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground group-hover:text-emerald-800">Ticketing Admin</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-stone-400 block truncate">ticketingadmin@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("venuemanager@pcb.demo", "VenueManager@2026!")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground group-hover:text-emerald-800">Venue Manager</span>
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[10px] text-stone-400 block truncate">venuemanager@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("boxoffice@pcb.demo", "BoxOffice@2026!")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground group-hover:text-emerald-800">Box Office</span>
                  <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-[10px] text-stone-400 block truncate">boxoffice@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("gatestaff@pcb.demo", "GateStaff@2026!")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground group-hover:text-emerald-800">Gate Staff</span>
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-stone-400 block truncate">gatestaff@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("fan@pcb.demo", "FanUser@2026!")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground group-hover:text-emerald-800">Cricket Fan</span>
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <span className="text-[10px] text-stone-400 block truncate">fan@pcb.demo</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>Don&apos;t have an account?</span>
            <div className="space-x-3">
              <Link href="/auth/register" className="text-cricket-primary font-bold hover:underline">
                Register Fan
              </Link>
              <span>&bull;</span>
              <Link href="/auth/register?staff=true" className="text-emerald-700 font-bold hover:underline">
                Staff Onboarding
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
