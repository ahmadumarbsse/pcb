"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  ShieldAlert,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Scan,
  Sparkles,
  History,
  RotateCcw,
} from "lucide-react";

interface GateScannerClientProps {
  matches: any[];
  initialRecentScans: any[];
}

export function GateScannerClient({ matches, initialRecentScans }: GateScannerClientProps) {
  const [selectedMatchId, setSelectedMatchId] = React.useState(matches[0]?.id || "");
  const [gateName, setGateName] = React.useState("Gate 1 (Wasim Akram Enclosure)");
  const [tokenInput, setTokenInput] = React.useState("");
  const [scanning, setScanning] = React.useState(false);
  const [lastScanResult, setLastScanResult] = React.useState<any | null>(null);
  const [recentScans, setRecentScans] = React.useState(initialRecentScans);

  // Sound feedback simulation (Web Audio API synthetic chime)
  function playBeep(success: boolean) {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (success) {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 chime
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // Low buzz
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  async function executeScan(tokenToScan: string) {
    if (!tokenToScan.trim() || !selectedMatchId) return;

    setScanning(true);
    setLastScanResult(null);

    try {
      const res = await fetch("/api/gate/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenOrTicketNumber: tokenToScan.trim(),
          matchId: selectedMatchId,
          gateName,
          deviceInfo: "Turnstile Gate Scanner #01",
        }),
      });

      const data = await res.json();
      setLastScanResult(data);
      playBeep(data.success);

      // Add to recent scans log
      const newScanItem = {
        id: `scan-${Date.now()}`,
        scanResult: data.result,
        gateName,
        scannedAt: new Date(),
        rejectionReason: data.success ? null : data.message,
        matchTitle: matches.find((m) => m.id === selectedMatchId)?.title || "Match",
        ticketNumber: data.ticketNumber || tokenToScan.slice(0, 16),
        holderName: data.holderName || "Unknown",
      };

      setRecentScans((prev) => [newScanItem, ...prev]);
      setTokenInput("");
    } catch (err: any) {
      setLastScanResult({
        success: false,
        result: "ERROR",
        message: "Network or server connection error.",
      });
      playBeep(false);
    } finally {
      setScanning(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    executeScan(tokenInput);
  }

  // Quick Demo Testing Handlers
  const testValidTicket = () => executeScan("TCK-GDF-789012");
  const testDuplicateScan = () => executeScan("TCK-GDF-789012");
  const testInvalidToken = () => executeScan("PCB_FAKE_TOKEN_XYZ999");

  // Summary Metrics
  const totalScans = recentScans.length;
  const validScans = recentScans.filter((s) => s.scanResult === "VALID").length;
  const rejectedScans = totalScans - validScans;

  return (
    <div className="space-y-8">
      {/* Turnstile Configuration Bar */}
      <Card className="bg-slate-900 border-slate-800 text-white shadow-md">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300">Active Match Fixture</Label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full text-xs rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} — {m.venueCity}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300">Turnstile Gate Position</Label>
            <select
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              className="w-full text-xs rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold text-cricket-gold"
            >
              <option value="Gate 1 (Wasim Akram Enclosure)">Gate 1 (Wasim Akram Enclosure)</option>
              <option value="Gate 2 (Fazal Mahmood Stand)">Gate 2 (Fazal Mahmood Stand)</option>
              <option value="Gate 3 (VIP & Hospitality Lounge)">Gate 3 (VIP &amp; Hospitality Lounge)</option>
              <option value="Gate 4 (General Enclosure East)">Gate 4 (General Enclosure East)</option>
              <option value="Gate 5 (Imran Khan Enclosure)">Gate 5 (Imran Khan Enclosure)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scanner Terminal */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Scanner Box */}
          <Card className="bg-slate-900 border-emerald-900/40 text-white shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800 bg-gradient-to-r from-emerald-950/60 to-slate-900">
              <CardTitle className="text-base font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-cricket-gold animate-pulse" />
                  Turnstile Scanner Console
                </span>
                <Badge className="bg-emerald-950 border-emerald-700 text-emerald-300 text-xs font-mono">
                  {gateName.split("(")[0].trim()}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Point handheld scanner at the fan&apos;s digital HMAC QR code pass or enter ticket code
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Scan Form Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <QrCode className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                  <Input
                    placeholder="Scan QR Barcode or Enter Ticket # (e.g. TCK-GDF-789012)"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="pl-10 h-12 bg-slate-950 border-slate-700 text-sm font-mono text-white tracking-wider"
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  disabled={scanning || !tokenInput.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-sm shadow-lg"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying Cryptographic Pass...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Verify Turnstile Admission
                    </>
                  )}
                </Button>
              </form>

              {/* Quick-Test Buttons */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Demo Verification Triggers
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={testValidTicket}
                    disabled={scanning}
                    className="border-emerald-700/60 text-emerald-300 hover:bg-emerald-950 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Test Seeded Pass (TCK-GDF-789012)
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={testDuplicateScan}
                    disabled={scanning}
                    className="border-amber-700/60 text-amber-300 hover:bg-amber-950 text-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    Test Duplicate Scan (Simulate Pass-back)
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={testInvalidToken}
                    disabled={scanning}
                    className="border-red-700/60 text-red-300 hover:bg-red-950 text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1 text-red-400" />
                    Test Fraudulent Pass
                  </Button>
                </div>
              </div>

              {/* High-Impact Visual Result Banner */}
              {lastScanResult && (
                <div
                  className={`p-6 rounded-2xl border-2 text-center space-y-3 animate-in zoom-in-95 duration-200 ${
                    lastScanResult.success
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-2xl shadow-emerald-900/40"
                      : "bg-red-950/80 border-red-500 text-red-100 shadow-2xl shadow-red-900/40"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {lastScanResult.success ? (
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                    ) : (
                      <ShieldAlert className="w-12 h-12 text-red-400 animate-pulse" />
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-serif">
                    {lastScanResult.message}
                  </h2>

                  {lastScanResult.success ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-emerald-800/80 text-xs text-left">
                      <div className="bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-700/60">
                        <span className="text-[10px] text-emerald-300 block">Holder</span>
                        <span className="font-bold text-white truncate block">
                          {lastScanResult.holderName}
                        </span>
                      </div>
                      <div className="bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-700/60">
                        <span className="text-[10px] text-emerald-300 block">Enclosure</span>
                        <span className="font-bold text-white truncate block">
                          {lastScanResult.categoryName}
                        </span>
                      </div>
                      <div className="bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-700/60">
                        <span className="text-[10px] text-emerald-300 block">Seat #</span>
                        <span className="font-mono font-bold text-cricket-gold">
                          {lastScanResult.seatCode}
                        </span>
                      </div>
                      <div className="bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-700/60">
                        <span className="text-[10px] text-emerald-300 block">Gate</span>
                        <span className="font-bold text-white">
                          {lastScanResult.gateAssigned}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-900/40 rounded-xl border border-red-800 text-xs text-red-200">
                      {lastScanResult.result === "ALREADY_USED" && (
                        <div>
                          <p className="font-bold text-amber-300">
                            FRAUD WARNING: Turnstile pass-back detected!
                          </p>
                          <p className="text-[11px] mt-1 text-red-300">
                            Ticket {lastScanResult.ticketNumber} registered entry earlier at{" "}
                            {lastScanResult.previousScanTime}.
                          </p>
                        </div>
                      )}
                      {lastScanResult.result === "WRONG_MATCH" && (
                        <p>{lastScanResult.message}</p>
                      )}
                      {lastScanResult.result === "INVALID_TOKEN" && (
                        <p>Token signature check failed. Turnstile remains locked.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Turnstile Metrics & Recent Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Turnstile Live Metrics */}
          <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-white">Live Gate Telemetry</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Total Scans</span>
                <span className="text-xl font-mono font-bold text-white">{totalScans}</span>
              </div>
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60">
                <span className="text-[10px] text-emerald-400 uppercase block">Valid Entries</span>
                <span className="text-xl font-mono font-bold text-emerald-400">{validScans}</span>
              </div>
              <div className="p-3 bg-red-950/40 rounded-xl border border-red-800/60">
                <span className="text-[10px] text-red-400 uppercase block">Rejections</span>
                <span className="text-xl font-mono font-bold text-red-400">{rejectedScans}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans Stream */}
          <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Live Turnstile Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5 max-h-[360px] overflow-y-auto">
              {recentScans.length > 0 ? (
                recentScans.map((s, idx) => {
                  const isValid = s.scanResult === "VALID";
                  return (
                    <div
                      key={s.id || idx}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isValid ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          <span className="font-mono font-bold text-white truncate">
                            {s.ticketNumber || "Token"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {s.holderName || "Unknown"} &bull; {s.gateName}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <Badge
                          className={`text-[9px] ${
                            isValid
                              ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                              : "bg-red-950 border-red-700 text-red-300"
                          }`}
                        >
                          {s.scanResult}
                        </Badge>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {new Date(s.scannedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No turnstile scans recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
