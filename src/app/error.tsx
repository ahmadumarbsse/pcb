"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-red-200 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Play Stopped by Technical Difficulty</h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred while loading this page. Please try again or return to the main lobby.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="bg-cricket-primary hover:bg-cricket-dark text-white gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
