"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, Phone, CreditCard, Loader2, AlertCircle, Shield, Key } from "lucide-react";
import { registerSchema } from "@/validators/auth";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isStaffInitial = searchParams.get("staff") === "true";

  const [mode, setMode] = useState<"fan" | "staff">(isStaffInitial ? "staff" : "fan");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [role, setRole] = useState<"box_office_staff" | "gate_staff" | "venue_manager" | "ticketing_admin">("box_office_staff");
  const [staffKey, setStaffKey] = useState("PCB_STAFF_2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "fan") {
      const validation = registerSchema.safeParse({
        name,
        email,
        password,
        phoneNumber,
        cnic,
      });

      if (!validation.success) {
        setError(validation.error.issues[0]?.message || "Please check your form inputs.");
        setLoading(false);
        return;
      }

      try {
        const res = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (res.error) {
          throw new Error(res.error.message || "Registration failed.");
        }

        router.push("/account");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Registration failed. An account with this email may already exist.");
      } finally {
        setLoading(false);
      }
    } else {
      // Staff registration via backend API
      try {
        const res = await fetch("/api/auth/staff-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            phoneNumber,
            cnic,
            role,
            staffKey,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setSuccess("Staff account created! You can now log in.");
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        } else {
          setError(data.error || "Staff onboarding failed.");
        }
      } catch {
        setError("Network error creating staff account.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-950 border-2 border-cricket-gold flex items-center justify-center mx-auto shadow-md">
            <span className="text-sm font-black text-cricket-gold">PCB</span>
          </div>
          <h1 className="text-2xl font-black font-serif text-foreground">
            {mode === "fan" ? "Create Fan Account" : "Staff Onboarding"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === "fan"
              ? "Register to purchase match passes and access digital QR tickets"
              : "Register operational desk, turnstile gate, or venue staff"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode("fan"); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "fan" ? "bg-white text-emerald-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Cricket Fan
          </button>
          <button
            type="button"
            onClick={() => { setMode("staff"); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "staff" ? "bg-white text-emerald-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Staff Onboarding
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <Input
                  id="name"
                  placeholder="e.g. Babar Azam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder={mode === "fan" ? "fan@domain.com" : "staff@pcb.demo"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password (Min 8 characters) *</Label>
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

            {mode === "staff" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Operational Role *</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="box_office_staff">Box Office Desk Staff</option>
                    <option value="gate_staff">Stadium Gate Turnstile Staff</option>
                    <option value="venue_manager">Venue Operations Manager</option>
                    <option value="ticketing_admin">Ticketing Administrator</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="staffKey">Staff Onboarding Authorization Key *</Label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <Input
                      id="staffKey"
                      type="text"
                      placeholder="PCB_STAFF_2026"
                      value={staffKey}
                      onChange={(e) => setStaffKey(e.target.value)}
                      className="pl-9 text-xs font-mono"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Demo default: PCB_STAFF_2026</p>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile (0300...)</Label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <Input
                    id="phone"
                    placeholder="03001234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cnic">CNIC</Label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <Input
                    id="cnic"
                    placeholder="35201-1234567-1"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="pl-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cricket-primary hover:bg-emerald-800 text-white font-bold h-10 text-xs shadow-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : mode === "fan" ? (
                "Create Fan Account"
              ) : (
                "Create Staff Account"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-slate-100">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cricket-primary font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
