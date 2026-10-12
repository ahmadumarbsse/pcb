"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black font-serif text-foreground">Password Recovery</h1>
          <p className="text-xs text-muted-foreground">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {submitted ? (
            <Alert variant="success" className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <AlertTitle className="font-bold">Recovery Link Dispatched</AlertTitle>
              <AlertDescription className="text-xs">
                If an account matches <strong>{email}</strong>, a secure password recovery link has been dispatched. Please check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Registered Email Address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="fan@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-cricket-primary hover:bg-emerald-800 text-white font-bold h-10 text-xs">
                Send Recovery Instructions
              </Button>
            </form>
          )}

          <div className="text-center pt-2">
            <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-cricket-primary font-bold hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
