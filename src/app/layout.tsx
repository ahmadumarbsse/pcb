import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "PCB Cricket Tickets | Official Matchday Portal (Demo)",
  description:
    "Book official cricket match tickets, VIP hospitalities, and stadium seats for international fixtures and domestic competitions in Pakistan.",
  keywords: [
    "Cricket Tickets Pakistan",
    "PCB Tickets",
    "Gaddafi Stadium Tickets",
    "National Bank Stadium Karachi",
    "Cricket Match Booking",
    "VIP Cricket Hospitality",
  ],
  authors: [{ name: "PCB Cricket Ticket System Demo" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="min-flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans flex">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
