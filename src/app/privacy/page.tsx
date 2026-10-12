export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16">
      <div className="bg-gradient-to-r from-emerald-950 via-[#07361b] to-cricket-dark text-white py-12 border-b border-emerald-900/60">
        <div className="container mx-auto px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Last Updated: November 2026 &bull; Official Ticketing Platform Security Notice
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
            <p>
              This Privacy Policy explains how our cricket ticketing portal collects, processes, and safeguards personal data submitted by fans, ticket holders, and guests when accessing our online services or attending match fixtures across Pakistan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">2. Data We Collect</h2>
            <p>We collect only the minimum required information necessary for ticket issuance and stadium security:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Contact Information:</strong> Full name, verified email address, and mobile phone number for digital ticket delivery.</li>
              <li><strong>Identity Verification:</strong> Pakistani National Identity Card (CNIC) or Passport number as mandated by local stadium security authorities.</li>
              <li><strong>Transaction Records:</strong> Order IDs, seat coordinates, and payment statuses. We never retain full card numbers or CVV codes.</li>
              <li><strong>Turnstile Telemetry:</strong> Timestamp and turnstile identifier upon gate entry scanning.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">3. How Your Information is Used</h2>
            <p>
              Your data is utilized solely for processing ticket purchases, issuing cryptographically signed entry passes, verifying stadium admission, providing match cancellation alerts, and preventing illicit black-market reselling.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">4. Data Security &amp; Encryption</h2>
            <p>
              All communication is encrypted via TLS 1.3. Ticket tokens are signed with HMAC-SHA256 cryptography and do not expose sensitive customer financial information in raw barcode payloads.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
