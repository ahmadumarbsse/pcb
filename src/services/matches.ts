import { getDb } from "@/db";
import { matches, series, venues, ticketCategories, stands } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export interface MatchFilterParams {
  format?: string;
  team?: string;
  venueId?: string;
  city?: string;
  status?: string;
  query?: string;
}

const FALLBACK_MATCHES = [
  {
    id: "match-1",
    seriesId: "series-eng-2026",
    seriesName: "England Tour of Pakistan 2026 (Demo Series)",
    venueId: "venue-gaddafi",
    venueName: "Gaddafi Stadium",
    city: "Lahore",
    matchNumber: 1,
    title: "1st T20I: Pakistan vs England",
    homeTeam: "Pakistan",
    awayTeam: "England",
    homeTeamCode: "PAK",
    awayTeamCode: "ENG",
    format: "T20I",
    matchDate: new Date("2026-11-14T14:00:00Z"),
    startTime: "19:00",
    status: "UPCOMING",
    salesOpen: true,
    ticketLimitPerUser: 6,
    minPrice: 1000,
    date: "2026-11-14",
    time: "19:00",
    categoriesCount: 4,
  },
  {
    id: "match-2",
    seriesId: "series-eng-2026",
    seriesName: "England Tour of Pakistan 2026 (Demo Series)",
    venueId: "venue-gaddafi",
    venueName: "Gaddafi Stadium",
    city: "Lahore",
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
    minPrice: 1000,
    date: "2026-11-16",
    time: "19:00",
    categoriesCount: 4,
  },
  {
    id: "match-3",
    seriesId: "series-aus-2026",
    seriesName: "Australia in Pakistan Test Championship (Demo Series)",
    venueId: "venue-karachi",
    venueName: "National Bank Stadium",
    city: "Karachi",
    matchNumber: 1,
    title: "1st Test: Pakistan vs Australia",
    homeTeam: "Pakistan",
    awayTeam: "Australia",
    homeTeamCode: "PAK",
    awayTeamCode: "AUS",
    format: "TEST",
    matchDate: new Date("2026-12-01T04:30:00Z"),
    startTime: "09:30",
    status: "UPCOMING",
    salesOpen: true,
    ticketLimitPerUser: 8,
    minPrice: 500,
    date: "2026-12-01",
    time: "09:30",
    categoriesCount: 4,
  },
  {
    id: "match-4",
    seriesId: "series-eng-2026",
    seriesName: "England Tour of Pakistan 2026 (Demo Series)",
    venueId: "venue-rawalpindi",
    venueName: "Rawalpindi Cricket Stadium",
    city: "Rawalpindi",
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
    minPrice: 800,
    date: "2026-11-19",
    time: "19:00",
    categoriesCount: 4,
  },
];

function getFallbackMatchDetails(fallback: (typeof FALLBACK_MATCHES)[0]) {
  return {
    ...fallback,
    venueAddress: "Ferozepur Road, Nishtar Town, Lahore, Punjab",
    capacity: 27000,
    venueRules: "CNIC required. Outside food and drink prohibited. Smoking prohibited.",
    venueGatesInfo: "Gates 1-3 VIP Enclosures, Gates 4-7 Premium Stands, Gates 8-14 General.",
    venueAccessibility: "Wheelchair ramps located at Gate 1 and Gate 4.",
    seriesDescription: fallback.seriesName,
    refundPolicyNotes: "100% face-value refund if abandoned without a ball bowled.",
    categories: [
      {
        id: "cat-m1-vip",
        name: "Wasim Akram VIP Hospitality",
        tier: "VIP",
        pricePkr: 4000,
        totalQuota: 500,
        availableQuota: 485,
        salesStatus: "ON_SALE",
        perksDescription: "Complimentary dinner buffet, air-conditioned executive lounge, VIP gate fast-track.",
        standId: "stand-gdf-vip",
        standName: "Wasim Akram Enclosure",
        gateNumber: "Gate 2",
        isReservedSeating: true,
      },
      {
        id: "cat-m1-prem",
        name: "Fazal Mahmood Premium",
        tier: "PREMIUM",
        pricePkr: 2000,
        totalQuota: 2000,
        availableQuota: 1850,
        salesStatus: "ON_SALE",
        perksDescription: "Elevated upper-deck view overlooking pitch.",
        standId: "stand-gdf-prem",
        standName: "Fazal Mahmood Stand",
        gateNumber: "Gate 4",
        isReservedSeating: true,
      },
      {
        id: "cat-m1-first",
        name: "Saeed Anwar First Class",
        tier: "FIRST_CLASS",
        pricePkr: 1000,
        totalQuota: 3000,
        availableQuota: 2700,
        salesStatus: "ON_SALE",
        perksDescription: "Mid-wicket grandstand view, shaded canopy area.",
        standId: "stand-gdf-first",
        standName: "Saeed Anwar First Class Stand",
        gateNumber: "Gate 8",
        isReservedSeating: false,
      },
      {
        id: "cat-m1-gen",
        name: "General Enclosure East",
        tier: "GENERAL",
        pricePkr: 500,
        totalQuota: 6000,
        availableQuota: 5800,
        salesStatus: "ON_SALE",
        perksDescription: "Traditional grass banking and bleachers for spirited cricket fans.",
        standId: "stand-gdf-gen",
        standName: "General Enclosure East",
        gateNumber: "Gate 11",
        isReservedSeating: false,
      },
    ],
  };
}

export async function getMatches(filters: MatchFilterParams = {}) {
  try {
    const db = getDb();
    const results = await db
      .select({
        id: matches.id,
        seriesId: matches.seriesId,
        seriesName: series.name,
        venueId: matches.venueId,
        venueName: venues.name,
        city: venues.city,
        matchNumber: matches.matchNumber,
        title: matches.title,
        homeTeam: matches.homeTeam,
        awayTeam: matches.awayTeam,
        homeTeamCode: matches.homeTeamCode,
        awayTeamCode: matches.awayTeamCode,
        format: matches.format,
        matchDate: matches.matchDate,
        startTime: matches.startTime,
        status: matches.status,
        salesOpen: matches.salesOpen,
        ticketLimitPerUser: matches.ticketLimitPerUser,
      })
      .from(matches)
      .innerJoin(series, eq(matches.seriesId, series.id))
      .innerJoin(venues, eq(matches.venueId, venues.id))
      .orderBy(asc(matches.matchDate));

    if (results.length === 0) {
      return applyFilters(FALLBACK_MATCHES, filters);
    }

    const categories = await db.select().from(ticketCategories);

    const enriched = results.map((m) => {
      const matchCats = categories.filter((c) => c.matchId === m.id);
      const minPrice = matchCats.length > 0 ? Math.min(...matchCats.map((c) => c.pricePkr)) : 500;
      return {
        ...m,
        minPrice,
        date: m.matchDate.toISOString().split("T")[0],
        time: m.startTime,
        categoriesCount: matchCats.length,
      };
    });

    return applyFilters(enriched, filters);
  } catch (err) {
    return applyFilters(FALLBACK_MATCHES, filters);
  }
}

function applyFilters(items: any[], filters: MatchFilterParams) {
  return items.filter((m) => {
    if (filters.format && filters.format !== "ALL" && m.format.toUpperCase() !== filters.format.toUpperCase()) {
      return false;
    }
    if (filters.status && filters.status !== "ALL" && m.status.toUpperCase() !== filters.status.toUpperCase()) {
      return false;
    }
    if (filters.city && filters.city !== "ALL" && m.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }
    if (filters.venueId && filters.venueId !== "ALL" && m.venueId !== filters.venueId) {
      return false;
    }
    if (filters.team && filters.team !== "ALL") {
      const teamLower = filters.team.toLowerCase();
      if (!m.homeTeam.toLowerCase().includes(teamLower) && !m.awayTeam.toLowerCase().includes(teamLower)) {
        return false;
      }
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matchText = `${m.title} ${m.seriesName} ${m.homeTeam} ${m.awayTeam} ${m.venueName} ${m.city}`.toLowerCase();
      if (!matchText.includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export async function getMatchById(id: string) {
  try {
    const db = getDb();

    const matchRows = await db
      .select({
        id: matches.id,
        seriesId: matches.seriesId,
        seriesName: series.name,
        seriesDescription: series.description,
        venueId: matches.venueId,
        venueName: venues.name,
        venueAddress: venues.address,
        city: venues.city,
        capacity: venues.capacity,
        venueRules: venues.rules,
        venueGatesInfo: venues.gatesInfo,
        venueAccessibility: venues.accessibilityInfo,
        matchNumber: matches.matchNumber,
        title: matches.title,
        homeTeam: matches.homeTeam,
        awayTeam: matches.awayTeam,
        homeTeamCode: matches.homeTeamCode,
        awayTeamCode: matches.awayTeamCode,
        format: matches.format,
        matchDate: matches.matchDate,
        startTime: matches.startTime,
        status: matches.status,
        salesOpen: matches.salesOpen,
        ticketLimitPerUser: matches.ticketLimitPerUser,
        refundPolicyNotes: matches.refundPolicyNotes,
      })
      .from(matches)
      .innerJoin(series, eq(matches.seriesId, series.id))
      .innerJoin(venues, eq(matches.venueId, venues.id))
      .where(eq(matches.id, id))
      .limit(1);

    if (matchRows.length === 0) {
      const fallback = FALLBACK_MATCHES.find((m) => m.id === id);
      if (!fallback) return null;
      return getFallbackMatchDetails(fallback);
    }

    const match = matchRows[0];

    const categories = await db
      .select({
        id: ticketCategories.id,
        name: ticketCategories.name,
        tier: ticketCategories.tier,
        pricePkr: ticketCategories.pricePkr,
        totalQuota: ticketCategories.totalQuota,
        availableQuota: ticketCategories.availableQuota,
        salesStatus: ticketCategories.salesStatus,
        perksDescription: ticketCategories.perksDescription,
        standId: stands.id,
        standName: stands.name,
        gateNumber: stands.gateNumber,
        isReservedSeating: stands.isReservedSeating,
      })
      .from(ticketCategories)
      .innerJoin(stands, eq(ticketCategories.standId, stands.id))
      .where(eq(ticketCategories.matchId, id))
      .orderBy(desc(ticketCategories.pricePkr));

    return {
      ...match,
      date: match.matchDate.toISOString().split("T")[0],
      time: match.startTime,
      categories,
    };
  } catch (err) {
    const fallback = FALLBACK_MATCHES.find((m) => m.id === id);
    if (!fallback) return null;
    return getFallbackMatchDetails(fallback);
  }
}

export async function getSeriesList() {
  try {
    const db = getDb();
    const seriesList = await db.select().from(series).orderBy(asc(series.startDate));
    const allMatches = await db.select().from(matches);

    if (seriesList.length === 0) {
      return [
        {
          id: "series-eng-2026",
          name: "England Tour of Pakistan 2026 (Demo Series)",
          code: "ENG-PAK-2026",
          format: "T20I",
          season: "2026-27",
          startDate: new Date("2026-11-10"),
          endDate: new Date("2026-11-25"),
          description: "Thrilling bilateral T20 series in Lahore and Rawalpindi.",
          matchCount: 3,
        },
        {
          id: "series-aus-2026",
          name: "Australia in Pakistan Test Championship (Demo Series)",
          code: "AUS-PAK-2026",
          format: "TEST",
          season: "2026-27",
          startDate: new Date("2026-12-01"),
          endDate: new Date("2026-12-20"),
          description: "Iconic 3-match ICC World Test Championship series in Karachi.",
          matchCount: 3,
        },
      ];
    }

    return seriesList.map((s) => {
      const sMatches = allMatches.filter((m) => m.seriesId === s.id);
      return {
        ...s,
        matchCount: sMatches.length,
      };
    });
  } catch (err) {
    return [
      {
        id: "series-eng-2026",
        name: "England Tour of Pakistan 2026 (Demo Series)",
        code: "ENG-PAK-2026",
        format: "T20I",
        season: "2026-27",
        startDate: new Date("2026-11-10"),
        endDate: new Date("2026-11-25"),
        description: "Thrilling bilateral T20 series in Lahore and Rawalpindi.",
        matchCount: 3,
      },
    ];
  }
}
