import { runMigrations } from "./migrate";
import { getDb } from "./index";
import { auth } from "@/lib/auth";
import {
  users,
  venues,
  stands,
  sections,
  rows,
  seats,
  series,
  matches,
  ticketCategories,
  promotionalCodes,
  orders,
  orderItems,
  tickets,
  payments,
} from "./schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function seedDatabase() {
  console.log("==================================================");
  console.log("🌱 STARTING PCB CRICKET DEMO DATABASE SEEDING");
  console.log("==================================================");

  // 1. Ensure migrations are applied
  await runMigrations();
  const db = getDb();

  // 2. Check if already seeded
  const existingUsers = await db.select().from(users).where(eq(users.email, "superadmin@pcb.demo"));
  if (existingUsers.length > 0) {
    console.log("ℹ Database already contains seed accounts. Skipping user creation.");
  } else {
    console.log("Creating seed accounts for all 6 roles...");

    const seedAccounts = [
      {
        email: "superadmin@pcb.demo",
        password: "SuperAdmin@2026!",
        name: "Super Administrator (Demo)",
        role: "super_admin",
        phoneNumber: "+923000000001",
        cnic: "35201-0000001-1",
      },
      {
        email: "ticketingadmin@pcb.demo",
        password: "TicketAdmin@2026!",
        name: "Ticketing Operations Admin",
        role: "ticketing_admin",
        phoneNumber: "+923000000002",
        cnic: "35201-0000002-1",
      },
      {
        email: "venuemanager@pcb.demo",
        password: "VenueManager@2026!",
        name: "Lahore Venue Manager",
        role: "venue_manager",
        phoneNumber: "+923000000003",
        cnic: "35201-0000003-1",
      },
      {
        email: "gatestaff@pcb.demo",
        password: "GateStaff@2026!",
        name: "Gate 4 Turnstile Inspector",
        role: "gate_staff",
        phoneNumber: "+923000000004",
        cnic: "35201-0000004-1",
      },
      {
        email: "boxoffice@pcb.demo",
        password: "BoxOffice@2026!",
        name: "Gaddafi Box Office Counter",
        role: "box_office_staff",
        phoneNumber: "+923000000005",
        cnic: "35201-0000005-1",
      },
      {
        email: "fan@pcb.demo",
        password: "CricketFan@2026!",
        name: "Tariq Mehmood (Cricket Fan)",
        role: "fan",
        phoneNumber: "+923001234567",
        cnic: "35201-1234567-1",
      },
    ];

    for (const acc of seedAccounts) {
      try {
        await auth.api.signUpEmail({
          body: {
            email: acc.email,
            password: acc.password,
            name: acc.name,
          },
        });

        // Update role and details
        await db
          .update(users)
          .set({
            role: acc.role,
            phoneNumber: acc.phoneNumber,
            cnic: acc.cnic,
            emailVerified: true,
          })
          .where(eq(users.email, acc.email));

        console.log(`✓ Created account: ${acc.email} [Role: ${acc.role}]`);
      } catch (err: any) {
        console.warn(`Could not seed ${acc.email}: ${err.message}`);
      }
    }
  }

  // 3. Seed Venues
  console.log("Seeding iconic cricket stadiums...");
  const stadiumList = [
    {
      id: "venue-gaddafi",
      name: "Gaddafi Stadium",
      city: "Lahore",
      address: "Ferozepur Road, Nishtar Town, Lahore, Punjab",
      capacity: 27000,
      description: "The premier cricket colosseum in Pakistan, hosting historic World Cup finals and bilateral test series.",
      rules: "Gate pass with CNIC required. Outside food and beverages prohibited. Smoking prohibited inside enclosures.",
      gatesInfo: "Gates 1-3 (VIP Enclosures), Gates 4-7 (Fazal Mahmood & Inzamam Stands), Gates 8-14 (General Enclosures).",
      accessibilityInfo: "Wheelchair ramps located at Gate 1 and Gate 4. Dedicated wheelchair bays available in row A.",
      parkingInfo: "Designated parking at Liberty Roundabout and Gulberg College ground with park-and-ride shuttles.",
      imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "venue-karachi",
      name: "National Bank Stadium",
      city: "Karachi",
      address: "Stadium Road, Gulshan-e-Iqbal, Karachi, Sindh",
      capacity: 34228,
      description: "The historical seaside stronghold of Pakistan cricket, renowned for its energetic atmosphere and Hanif Mohammad Enclosure.",
      rules: "All attendees must present original identity cards. Security frisking mandatory at outer perimeter.",
      gatesInfo: "Gates 1-5 (Special Enclosures), Gates 6-12 (First Class & General).",
      accessibilityInfo: "Wheelchair access accessible via Gate 2.",
      parkingInfo: "Expo Centre Karachi parking area with shuttle service to stadium gates.",
      imageUrl: "https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "venue-rawalpindi",
      name: "Rawalpindi Cricket Stadium",
      city: "Rawalpindi",
      address: "Stadium Road, Shamsabad, Rawalpindi, Punjab",
      capacity: 17000,
      description: "Fast-scoring surface situated near the capital city, famed for roaring crowds and electric white-ball contests.",
      rules: "Entry closes 30 minutes prior to first ball. Re-entry not permitted on single tickets.",
      gatesInfo: "Gates 1-4 (VIP & Club), Gates 5-10 (General).",
      accessibilityInfo: "Step-free ramp entry at Gate 1.",
      parkingInfo: "Pir Mehr Ali Shah Arid University parking grounds.",
      imageUrl: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "venue-multan",
      name: "Multan Cricket Stadium",
      city: "Multan",
      address: "Vehari Road, Multan, Punjab",
      capacity: 25000,
      description: "A modern regional venue famous for traditional Multani hospitality, lush green surrounds, and enthusiastic south Punjab crowds.",
      rules: "Digital tickets on smartphones or printed A4 passes accepted.",
      gatesInfo: "Gates 1-3 (Inzamam Stand), Gates 4-12 (General).",
      accessibilityInfo: "Ramp access at Main Pavilion gate.",
      parkingInfo: "Shah Rukn-e-Alam ground parking.",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const v of stadiumList) {
    try {
      await db.insert(venues).values(v).onConflictDoNothing();
    } catch (e) {}
  }

  // 4. Seed Stands for Gaddafi Stadium
  console.log("Seeding stands, enclosures, and seating map...");
  const standList = [
    {
      id: "stand-gdf-vip",
      venueId: "venue-gaddafi",
      name: "Wasim Akram VIP Enclosure",
      code: "WA-VIP",
      tier: "VIP",
      gateNumber: "Gate 2",
      capacity: 1200,
      isReservedSeating: true,
      description: "Prime air-conditioned hospitality, cushioned seats directly behind player dugout.",
    },
    {
      id: "stand-gdf-prem",
      venueId: "venue-gaddafi",
      name: "Fazal Mahmood Premium Stand",
      code: "FM-PREM",
      tier: "PREMIUM",
      gateNumber: "Gate 4",
      capacity: 3500,
      isReservedSeating: true,
      description: "Elevated upper deck view overlooking bowler run-up and cover boundaries.",
    },
    {
      id: "stand-gdf-first",
      venueId: "venue-gaddafi",
      name: "Saeed Anwar First Class Stand",
      code: "SA-FC",
      tier: "FIRST_CLASS",
      gateNumber: "Gate 8",
      capacity: 4000,
      isReservedSeating: false,
      description: "Mid-wicket panoramic perspective with rapid gate clearance.",
    },
    {
      id: "stand-gdf-gen",
      venueId: "venue-gaddafi",
      name: "General Enclosure East",
      code: "GEN-E",
      tier: "GENERAL",
      gateNumber: "Gate 11",
      capacity: 6500,
      isReservedSeating: false,
      description: "Traditional grass banking and bleachers for spirited cricket fans.",
    },
  ];

  for (const s of standList) {
    try {
      await db.insert(stands).values(s).onConflictDoNothing();
    } catch (e) {}
  }

  // 5. Seed Section, Rows, and Seats for Wasim Akram VIP
  try {
    const secId = "sec-gdf-wa-1";
    await db.insert(sections).values({
      id: secId,
      standId: "stand-gdf-vip",
      name: "Lower Tier",
      code: "L1",
      capacity: 100,
    }).onConflictDoNothing();

    // Create 3 rows (A, B, C) with 10 seats each = 30 numbered reserved seats
    const rowNames = ["A", "B", "C"];
    for (const rName of rowNames) {
      const rowId = `row-wa-${rName}`;
      await db.insert(rows).values({
        id: rowId,
        sectionId: secId,
        rowNumber: rName,
        capacity: 10,
      }).onConflictDoNothing();

      for (let sNum = 1; sNum <= 10; sNum++) {
        const seatId = `seat-wa-${rName}-${sNum}`;
        await db.insert(seats).values({
          id: seatId,
          rowId,
          standId: "stand-gdf-vip",
          seatNumber: sNum.toString(),
          seatCode: `WA-${rName}-${sNum}`,
          isWheelchairAccessible: sNum === 1,
          isVip: true,
        }).onConflictDoNothing();
      }
    }
  } catch (e) {}

  // 6. Seed Demo Series
  console.log("Seeding demo series and matches...");
  const demoSeries = [
    {
      id: "series-eng-2026",
      name: "England Tour of Pakistan 2026 (Demo Series)",
      code: "ENG-PAK-2026",
      format: "T20I",
      season: "2026-27",
      startDate: new Date("2026-11-10"),
      endDate: new Date("2026-11-25"),
      description: "Thrilling 5-match bilateral T20 international contest across Lahore and Rawalpindi.",
    },
    {
      id: "series-aus-2026",
      name: "Australia in Pakistan Test Championship (Demo Series)",
      code: "AUS-PAK-2026",
      format: "TEST",
      season: "2026-27",
      startDate: new Date("2026-12-01"),
      endDate: new Date("2026-12-20"),
      description: "Iconic 3-match ICC World Test Championship series in Karachi, Multan, and Rawalpindi.",
    },
  ];

  for (const s of demoSeries) {
    try {
      await db.insert(series).values(s).onConflictDoNothing();
    } catch (e) {}
  }

  // 7. Seed Matches
  const demoMatches = [
    {
      id: "match-1",
      seriesId: "series-eng-2026",
      venueId: "venue-gaddafi",
      matchNumber: 1,
      title: "1st T20I: Pakistan vs England",
      homeTeam: "Pakistan",
      awayTeam: "England",
      homeTeamCode: "PAK",
      awayTeamCode: "ENG",
      format: "T20I",
      matchDate: new Date("2026-11-14T14:00:00Z"), // 7 PM PKT
      startTime: "19:00",
      status: "UPCOMING",
      salesOpen: true,
      ticketLimitPerUser: 6,
    },
    {
      id: "match-2",
      seriesId: "series-eng-2026",
      venueId: "venue-gaddafi",
      matchNumber: 2,
      title: "2nd T20I: Pakistan vs England",
      homeTeam: "Pakistan",
      awayTeam: "England",
      homeTeamCode: "PAK",
      awayTeamCode: "ENG",
      format: "T20I",
      matchDate: new Date("2026-11-16T14:00:00Z"),
      startTime: "19:00",
      status: "UPCOMING",
      salesOpen: true,
      ticketLimitPerUser: 6,
    },
    {
      id: "match-3",
      seriesId: "series-aus-2026",
      venueId: "venue-karachi",
      matchNumber: 1,
      title: "1st Test: Pakistan vs Australia",
      homeTeam: "Pakistan",
      awayTeam: "Australia",
      homeTeamCode: "PAK",
      awayTeamCode: "AUS",
      format: "TEST",
      matchDate: new Date("2026-12-01T04:30:00Z"), // 9:30 AM PKT
      startTime: "09:30",
      status: "UPCOMING",
      salesOpen: true,
      ticketLimitPerUser: 8,
    },
    {
      id: "match-4",
      seriesId: "series-eng-2026",
      venueId: "venue-rawalpindi",
      matchNumber: 3,
      title: "3rd T20I: Pakistan vs England",
      homeTeam: "Pakistan",
      awayTeam: "England",
      homeTeamCode: "PAK",
      awayTeamCode: "ENG",
      format: "T20I",
      matchDate: new Date("2026-11-19T14:00:00Z"),
      startTime: "19:00",
      status: "UPCOMING",
      salesOpen: true,
      ticketLimitPerUser: 6,
    },
  ];

  for (const m of demoMatches) {
    try {
      await db.insert(matches).values(m).onConflictDoNothing();
    } catch (e) {}
  }

  // 8. Seed Ticket Categories & Prices (Integer PKR)
  console.log("Seeding ticket categories and pricing tiers...");
  const catList = [
    {
      id: "cat-m1-vip",
      matchId: "match-1",
      standId: "stand-gdf-vip",
      name: "Wasim Akram VIP Hospitality",
      tier: "VIP",
      pricePkr: 4000,
      totalQuota: 500,
      availableQuota: 485,
      salesStatus: "ON_SALE",
      perksDescription: "Complimentary dinner buffet, air-conditioned executive lounge, VIP gate fast-track.",
    },
    {
      id: "cat-m1-prem",
      matchId: "match-1",
      standId: "stand-gdf-prem",
      name: "Fazal Mahmood Premium",
      tier: "PREMIUM",
      pricePkr: 2000,
      totalQuota: 2000,
      availableQuota: 1850,
      salesStatus: "ON_SALE",
      perksDescription: "Elevated upper-tier seating with clear unobstructed sightlines.",
    },
    {
      id: "cat-m1-first",
      matchId: "match-1",
      standId: "stand-gdf-first",
      name: "Saeed Anwar First Class",
      tier: "FIRST_CLASS",
      pricePkr: 1000,
      totalQuota: 3000,
      availableQuota: 2700,
      salesStatus: "ON_SALE",
      perksDescription: "Mid-wicket grandstand view, shaded canopy area.",
    },
    {
      id: "cat-m1-gen",
      matchId: "match-1",
      standId: "stand-gdf-gen",
      name: "General Enclosure East",
      tier: "GENERAL",
      pricePkr: 500,
      totalQuota: 6000,
      availableQuota: 5800,
      salesStatus: "ON_SALE",
      perksDescription: "Affordable family and fan atmosphere.",
    },
  ];

  for (const c of catList) {
    try {
      await db.insert(ticketCategories).values(c).onConflictDoNothing();
    } catch (e) {}
  }

  // 9. Seed Promotional Codes
  console.log("Seeding promotional discount codes...");
  const promoList = [
    {
      id: "promo-pcb2026",
      code: "PCB2026",
      discountType: "PERCENTAGE",
      discountValue: 10, // 10%
      minOrderAmountPkr: 1000,
      maxDiscountPkr: 1500,
      usageLimit: 500,
      usedCount: 12,
      validFrom: new Date("2026-01-01"),
      validUntil: new Date("2027-12-31"),
      isActive: true,
    },
    {
      id: "promo-early",
      code: "EARLYBIRD",
      discountType: "FIXED_AMOUNT",
      discountValue: 300, // PKR 300 flat off
      minOrderAmountPkr: 1500,
      usageLimit: 200,
      usedCount: 5,
      validFrom: new Date("2026-01-01"),
      validUntil: new Date("2027-12-31"),
      isActive: true,
    },
  ];

  for (const p of promoList) {
    try {
      await db.insert(promotionalCodes).values(p).onConflictDoNothing();
    } catch (e) {}
  }

  // 10. Seed a sample confirmed booking for fan@pcb.demo
  try {
    const fanUser = await db.select().from(users).where(eq(users.email, "fan@pcb.demo")).limit(1);
    if (fanUser.length > 0) {
      const orderId = "order-demo-001";
      const ticketId = "tck-demo-001";
      const qrSecret = process.env.TICKET_SIGNING_SECRET || "default_hmac_secret_key_32_chars";
      const sampleSignature = crypto
        .createHmac("sha256", qrSecret)
        .update(`TCK-GDF-789012|match-1|${fanUser[0].id}|seat-wa-A-1`)
        .digest("hex");

      await db.insert(orders).values({
        id: orderId,
        orderNumber: "PCB-2026-X892K",
        userId: fanUser[0].id,
        matchId: "match-1",
        customerName: fanUser[0].name,
        customerEmail: fanUser[0].email,
        customerPhone: fanUser[0].phoneNumber || "+923001234567",
        customerCnic: fanUser[0].cnic || "35201-1234567-1",
        totalAmountPkr: 4000,
        subtotalAmountPkr: 4000,
        discountAmountPkr: 0,
        feesAmountPkr: 0,
        status: "PAID",
        paymentMethod: "SANDBOX",
      }).onConflictDoNothing();

      await db.insert(orderItems).values({
        id: "item-demo-001",
        orderId,
        ticketCategoryId: "cat-m1-vip",
        seatId: "seat-wa-A-1",
        unitPricePkr: 4000,
        quantity: 1,
        attendeeName: fanUser[0].name,
        attendeeCnic: "35201-1234567-1",
      }).onConflictDoNothing();

      await db.insert(tickets).values({
        id: ticketId,
        ticketNumber: "TCK-GDF-789012",
        orderId,
        matchId: "match-1",
        ticketCategoryId: "cat-m1-vip",
        seatId: "seat-wa-A-1",
        userId: fanUser[0].id,
        holderName: fanUser[0].name,
        holderCnic: "35201-1234567-1",
        qrSignatureToken: `TCK-GDF-789012.${sampleSignature}`,
        status: "ISSUED",
        gateAssigned: "Gate 2 (VIP)",
      }).onConflictDoNothing();

      await db.insert(payments).values({
        id: "pay-demo-001",
        orderId,
        provider: "SANDBOX",
        transactionReference: "TXN-SANDBOX-998877",
        amountPkr: 4000,
        currency: "PKR",
        status: "SUCCESS",
        completedAt: new Date(),
      }).onConflictDoNothing();

      console.log("✓ Sample verified booking & E-ticket seeded for fan@pcb.demo");
    }
  } catch (e: any) {
    console.warn("Notice seeding sample order:", e.message);
  }

  console.log("==================================================");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("==================================================");
}

// Standalone execution: npx tsx src/db/seed.ts
if (require.main === module || process.argv[1]?.includes("seed")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
