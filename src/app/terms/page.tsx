export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
            Terms &amp; Conditions of Sale and Stadium Entry
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Conditions Governing Match Tickets, Admissions, and Stadium Conduct
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">1. Ticket Purchase Agreement</h2>
            <p>
              By purchasing or using an electronic match ticket, you agree to comply with all rules and regulations of the Pakistan Cricket Board, stadium authorities, and local law enforcement. Tickets are revocable licenses that may be withdrawn upon breach of these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">2. Anti-Scalping &amp; Unofficial Resale</h2>
            <p>
              Tickets may not be resold above face value, bartered, or used for commercial promotional contests without formal written authorization. Tickets obtained through unapproved brokers or scalpers are subject to immediate cryptographic invalidation without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">3. Admission &amp; Physical Inspection</h2>
            <p>
              Holders must enter through their assigned turnstile and present valid original photographic identification (CNIC or Passport). Stadium security reserves the right to search bags and inspect persons prior to entry.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">4. Inclement Weather &amp; Match Abandonment</h2>
            <p>
              In accordance with official playing conditions, if a fixture is abandoned due to weather before the toss without a ball bowled, tickets are eligible for full face-value refunds. If a match is commenced and curtailed after play begins, the PCB refund scale applies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
