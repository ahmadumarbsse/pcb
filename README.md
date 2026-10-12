# PCB Cricket Ticket Booking System (Demo Platform)

A full-stack, enterprise-grade cricket ticket booking platform inspired by Pakistan Cricket Board (PCB) matchday operations. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, Better Auth, and Redis.

> **Demonstration Notice:** This software is a realistic engineering demonstration. It is not affiliated with or endorsed by the official Pakistan Cricket Board (PCB). All match fixtures, team logos, and pricing examples are strictly mock demo data.

---

## 🏏 Visual Identity & Design System

- **Primary Colors:** Deep Cricket Pitch Green (`#052e16`, `#0b5c2c`), Crisp Clean Whites & Greys
- **Accent Color:** Restrained Trophy Gold (`#d4af37`, `#fef3c7`)
- **Supporting:** Pitch Charcoal (`#18181b`)
- **Layouts:** Fully responsive across mobile, tablet, and widescreen desktop.
- **Localization:** English (LTR) and Urdu (اردو, RTL) toggle support.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components & Server Actions)
- **Language:** TypeScript with strict type checking
- **Styling:** Tailwind CSS & custom accessible component system
- **Database:** PostgreSQL with Drizzle ORM & Drizzle Kit (with embedded PGlite driver fallback for zero-setup local dev & tests)
- **Authentication:** Better Auth with role-based permissions (Fan, Box Office, Gate Staff, Venue Manager, Admin)
- **Caching & Locks:** Redis concurrency locks with in-memory fallback
- **Validation:** Zod schemas for all forms & server endpoints
- **Testing:** Vitest & React Testing Library

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`

### 2. Installation
```bash
git clone <repo-url>
cd PCB
npm install --legacy-peer-deps
```

### 3. Environment Setup
Copy the sample environment configuration:
```bash
cp .env.example .env
```
Default values in `.env` are configured to run automatically out-of-the-box in local development with embedded PGlite and in-memory locks.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on port 3000 |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Starts Next.js production server |
| `npm run typecheck` | Validates TypeScript types across entire repository |
| `npm run lint` | Runs Next.js ESLint checks |
| `npm test` | Runs Vitest automated unit and integration tests |
| `npm run db:generate` | Generates Drizzle database migrations |
| `npm run db:migrate` | Applies migrations to PostgreSQL database |
| `npm run db:seed` | Populates database with sample stadiums, fixtures & categories |

---

## 📂 Project Architecture

```
PCB/
├── src/
│   ├── app/                    # Next.js 15 App Router pages & API routes
│   │   ├── layout.tsx          # Root layout with Header and Footer
│   │   ├── page.tsx            # Polished Homepage with Hero & Match cards
│   │   ├── globals.css         # Cricket green & gold theme tokens
│   │   ├── not-found.tsx       # Cricket 404 page
│   │   └── error.tsx           # Error boundary
│   ├── components/
│   │   ├── layout/             # Header, Footer, Mobile Navigation
│   │   ├── shared/             # MatchCard, VenueCard, HeroBanner, LanguageToggle
│   │   └── ui/                 # Accessible Button, Card, Badge, Alert, Skeleton, Table, etc.
│   ├── db/                     # Drizzle schema, migrations, and seed scripts
│   ├── lib/                    # Utilities, authentication, QR cryptotools
│   ├── services/               # Inventory locking, pricing, payment adapters
│   └── validators/             # Zod validation schemas
├── tests/                      # Automated unit and integration tests
├── .env.example                # Example environment variables template
├── drizzle.config.ts           # Drizzle ORM configuration
├── tailwind.config.ts          # Tailwind theme configuration
├── tsconfig.json               # Strict TypeScript configuration
└── vitest.config.ts            # Test runner configuration
```
