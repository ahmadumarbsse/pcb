"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, Phone, CreditCard, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { registerSchema } from "@/validators/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate using Zod schema
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
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-950 border-2 border-cricket-gold flex items-center justify-center mx-auto shadow-md">
            <span className="text-sm font-black text-cricket-gold">PCB</span>
          </div>
          <h1 className="text-2xl font-black font-serif text-foreground">Create Fan Account</h1>
          <p className="text-xs text-muted-foreground">
            Register to purchase official match passes and access digital QR tickets
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name (as per CNIC / Passport) *</Label>
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
                placeholder="fan@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password (Min 8 chars, 1 uppercase, 1 digit) *</Label>
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
                <Label htmlFor="cnic">CNIC (12345-1234567-1)</Label>
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
                  Creating Fan Profile...
                </>
              ) : (
                "Create Fan Account"
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
