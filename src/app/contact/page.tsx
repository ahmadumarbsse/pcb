import { Phone, Mail, MapPin, Clock, Shield, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
            Contact Support &amp; Box Office
          </h1>
          <p className="text-sm text-stone-300">
            Have questions regarding matchday access, ticket delivery, or corporate inquiries? Reach our ticketing desks across Pakistan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Support Channels */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Helpline &amp; Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-cricket-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Customer Care Hotline</span>
                    <span>+92 42 111-22-722 (PCB)</span>
                    <span className="block text-stone-400">Available Monday - Saturday, 9 AM to 6 PM PKT</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-cricket-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Ticketing Inquiries</span>
                    <span>tickets@pcb-cricket.demo</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-cricket-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Matchday Box Office Counter</span>
                    <span>Gaddafi Stadium Gate 10 &bull; 8:00 AM until start of 2nd innings</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-950 text-white border-emerald-800 shadow-sm">
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="font-bold text-cricket-gold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Anti-Fraud &amp; Counterfeit Warning
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Only tickets purchased through this official portal or verified stadium box offices are genuine. Beware of unauthorized secondary scalpers or social media sellers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Send an Electronic Inquiry</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-name">Full Name</Label>
                      <Input id="c-name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-email">Email Address</Label>
                      <Input id="c-email" type="email" placeholder="email@domain.com" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c-sub">Subject / Order Reference</Label>
                    <Input id="c-sub" placeholder="e.g. Order PCB-2026-X892K Inquiry" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c-msg">Message</Label>
                    <textarea
                      id="c-msg"
                      rows={4}
                      placeholder="Describe your inquiry or question..."
                      className="flex w-full rounded-lg border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cricket-primary"
                      required
                    />
                  </div>

                  <Button type="button" className="w-full bg-cricket-primary hover:bg-emerald-800 text-white font-bold h-10 text-xs">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
