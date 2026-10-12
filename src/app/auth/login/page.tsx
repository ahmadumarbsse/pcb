"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, Loader2, AlertCircle, Shield, Sparkles } from "lucide-react";

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

      // Check role or redirect to account
      router.push("/account");
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
      <div className="max-w-md w-full space-y-6">
        {/* Brand / Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-950 border-2 border-cricket-gold flex items-center justify-center mx-auto shadow-md">
            <span className="text-sm font-black text-cricket-gold">PCB</span>
          </div>
          <h1 className="text-2xl font-black font-serif text-foreground">Sign In to Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Access your match tickets, booking history, and turnstile entry passes
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
                  placeholder="fan@pcb.demo"
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
                  Verifying Identity...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
              Quick Demo Logins (Click to Autofill)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials("fan@pcb.demo", "CricketFan@2026!")}
                className="text-left p-2 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors text-[11px]"
              >
                <span className="font-bold block text-foreground">Verified Fan</span>
                <span className="text-stone-400 text-[10px]">fan@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("superadmin@pcb.demo", "SuperAdmin@2026!")}
                className="text-left p-2 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors text-[11px]"
              >
                <span className="font-bold block text-foreground">Super Admin</span>
                <span className="text-stone-400 text-[10px]">superadmin@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("gatestaff@pcb.demo", "GateStaff@2026!")}
                className="text-left p-2 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors text-[11px]"
              >
                <span className="font-bold block text-foreground">Gate Staff</span>
                <span className="text-stone-400 text-[10px]">gatestaff@pcb.demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("boxoffice@pcb.demo", "BoxOffice@2026!")}
                className="text-left p-2 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors text-[11px]"
              >
                <span className="font-bold block text-foreground">Box Office</span>
                <span className="text-stone-400 text-[10px]">boxoffice@pcb.demo</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/register" className="text-cricket-primary font-bold hover:underline">
              Register as Fan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
