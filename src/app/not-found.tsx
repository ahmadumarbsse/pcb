import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-cricket-primary flex items-center justify-center mx-auto border border-emerald-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground font-serif">404 - Over Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The page, fixture, or ticket you are looking for has been bowled out or moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button className="w-full bg-cricket-primary hover:bg-cricket-dark text-white gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Pavilion</span>
            </Button>
          </Link>
          <Link href="/matches">
            <Button variant="outline" className="w-full gap-2 border-slate-300">
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Matches</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
