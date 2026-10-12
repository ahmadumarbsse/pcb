import { getDb } from "@/db";
import { venues, stands, matches, series } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

const FALLBACK_VENUES = [
  {
    id: "venue-gaddafi",
    name: "Gaddafi Stadium",
    city: "Lahore",
    address: "Ferozepur Road, Nishtar Town, Lahore, Punjab",
    capacity: 27000,
    standCount: 14,
    description: "The premier cricket colosseum in Pakistan, hosting historic World Cup finals and bilateral test series.",
    rules: "Gate pass with CNIC required. Outside food and beverages prohibited.",
    gatesInfo: "Gates 1-3 VIP, Gates 4-7 Premium, Gates 8-14 General.",
    accessibilityInfo: "Wheelchair ramps located at Gate 1 and Gate 4.",
    parkingInfo: "Designated parking at Liberty Roundabout and Gulberg College ground.",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    upcomingMatchCount: 4,
  },
  {
    id: "venue-karachi",
    name: "National Bank Stadium",
    city: "Karachi",
    address: "Stadium Road, Gulshan-e-Iqbal, Karachi, Sindh",
    capacity: 34228,
    standCount: 16,
    description: "The historical seaside stronghold of Pakistan cricket, renowned for its energetic atmosphere.",
    rules: "All attendees must present original identity cards.",
    gatesInfo: "Gates 1-5 Special Enclosures, Gates 6-12 General.",
    accessibilityInfo: "Wheelchair access accessible via Gate 2.",
    parkingInfo: "Expo Centre Karachi parking area with shuttle service.",
    imageUrl: "https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80",
    upcomingMatchCount: 3,
  },
  {
    id: "venue-rawalpindi",
    name: "Rawalpindi Cricket Stadium",
    city: "Rawalpindi",
    address: "Stadium Road, Shamsabad, Rawalpindi, Punjab",
    capacity: 17000,
    standCount: 10,
    description: "Fast-scoring surface situated near the capital city, famed for roaring crowds.",
    rules: "Entry closes 30 minutes prior to first ball.",
    gatesInfo: "Gates 1-4 VIP & Club, Gates 5-10 General.",
    accessibilityInfo: "Step-free ramp entry at Gate 1.",
    parkingInfo: "Pir Mehr Ali Shah Arid University parking grounds.",
    imageUrl: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80",
    upcomingMatchCount: 2,
  },
  {
    id: "venue-multan",
    name: "Multan Cricket Stadium",
    city: "Multan",
    address: "Vehari Road, Multan, Punjab",
    capacity: 25000,
    standCount: 12,
    description: "A modern regional venue famous for traditional Multani passion and green outfields.",
    rules: "Digital tickets on smartphones or printed A4 passes accepted.",
    gatesInfo: "Gates 1-3 Inzamam Stand, Gates 4-12 General.",
    accessibilityInfo: "Ramp access at Main Pavilion gate.",
    parkingInfo: "Shah Rukn-e-Alam ground parking.",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    upcomingMatchCount: 2,
  },
];

export async function getVenues() {
  try {
    const db = getDb();
    const allVenues = await db.select().from(venues).where(eq(venues.isActive, true));
    if (allVenues.length === 0) return FALLBACK_VENUES;

    const allStands = await db.select().from(stands);
    const allMatches = await db.select().from(matches);

    return allVenues.map((v) => {
      const vStands = allStands.filter((s) => s.venueId === v.id);
      const vMatches = allMatches.filter((m) => m.venueId === v.id);
      return {
        ...v,
        standCount: vStands.length,
        upcomingMatchCount: vMatches.length,
      };
    });
  } catch (err) {
    return FALLBACK_VENUES;
  }
}

export async function getVenueById(id: string) {
  try {
    const db = getDb();
    const venueRows = await db.select().from(venues).where(eq(venues.id, id)).limit(1);

    if (venueRows.length === 0) {
      const fallback = FALLBACK_VENUES.find((v) => v.id === id);
      if (!fallback) return null;
      return {
        ...fallback,
        stands: [
          {
            id: "stand-gdf-vip",
            venueId: fallback.id,
            name: "Wasim Akram VIP Enclosure",
            code: "WA-VIP",
            tier: "VIP",
            gateNumber: "Gate 2",
            capacity: 1200,
            isReservedSeating: true,
            description: "Prime air-conditioned hospitality, cushioned seats.",
          },
          {
            id: "stand-gdf-prem",
            venueId: fallback.id,
            name: "Fazal Mahmood Premium Stand",
            code: "FM-PREM",
            tier: "PREMIUM",
            gateNumber: "Gate 4",
            capacity: 3500,
            isReservedSeating: true,
            description: "Elevated upper deck view.",
          },
        ],
        matches: [],
      };
    }

    const venue = venueRows[0];
    const venueStands = await db.select().from(stands).where(eq(stands.venueId, id));

    const venueMatches = await db
      .select({
        id: matches.id,
        title: matches.title,
        homeTeam: matches.homeTeam,
        awayTeam: matches.awayTeam,
        homeTeamCode: matches.homeTeamCode,
        awayTeamCode: matches.awayTeamCode,
        format: matches.format,
        matchDate: matches.matchDate,
        startTime: matches.startTime,
        status: matches.status,
        seriesName: series.name,
      })
      .from(matches)
      .innerJoin(series, eq(matches.seriesId, series.id))
      .where(eq(matches.venueId, id))
      .orderBy(asc(matches.matchDate));

    return {
      ...venue,
      stands: venueStands,
      matches: venueMatches.map((m) => ({
        ...m,
        date: m.matchDate.toISOString().split("T")[0],
        time: m.startTime,
      })),
    };
  } catch (err) {
    const fallback = FALLBACK_VENUES.find((v) => v.id === id);
    if (!fallback) return null;
    return {
      ...fallback,
      stands: [],
      matches: [],
    };
  }
}
