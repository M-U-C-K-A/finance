# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FinAnalytics is a SaaS platform for automated financial market analysis that generates personalized reports on ETFs, indices, and markets. The platform uses a hybrid monetization model combining subscriptions (with API access) and one-time credit purchases.

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build the application
pnpm build

# Run linting
pnpm lint

# Start production server
pnpm start

# Database operations (Prisma)
pnpm prisma generate
pnpm prisma db push
pnpm prisma studio
pnpm prisma migrate dev
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui components
- **Authentication**: Better Auth with Google, GitHub, and email/password providers
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Polar integration for subscriptions and one-time purchases
- **Report Generation**: Python workers (separate from web app)

### Key Directories
- `app/` - Next.js 15 App Router pages and API routes
  - `(app)/` - Protected dashboard pages (requires auth)
  - `(home)/` - Public pages (landing, auth)
  - `api/` - API routes including Better Auth
- `src/components/` - Reusable UI components organized by feature
- `src/lib/` - Utilities, auth configuration, database client
- `prisma/` - Database schema and migrations
- `pdf/` - Python scripts for report generation (separate service)

### Authentication System
- Uses Better Auth with Prisma adapter
- Supports Google, GitHub, and email/password authentication
- Session management with 30-day expiration
- Custom styled password reset emails via Resend

### Database Schema
The application uses a multi-schema approach:
- **Core schema** (`schema.prisma`): Users, sessions, accounts, verification
- **Subscriptions schema** (`schema/subscriptions.prisma`): Subscription plans, credits, transactions

### Business Logic
- **Credit System**: Users consume credits to generate reports
- **API Access**: Exclusive to subscription users (`apiAccess = true`)
- **Plans**: FREE, STARTER, PROFESSIONAL, ENTERPRISE with different credit allocations
- **Dual Monetization**: Subscriptions (with API) vs one-time credit purchases (no API)

## Key Patterns

### Authentication Flow
- Use `getUser()` from `src/lib/auth.ts` for server-side auth checks
- Client-side auth via `authClient` from `src/lib/auth-client.ts`
- Protected routes should check user authentication and subscription status

### Credit Management
- Always verify user has sufficient credits before report generation
- Debit credits atomically with report request creation
- API access requires both credits AND active subscription

### Component Organization
- UI components in `src/components/ui/` (shadcn/ui)
- Feature-specific components grouped by domain (auth, dashboard, reports, settings)
- Consistent use of TypeScript and Zod for validation

### API Routes
- Follow Next.js 15 App Router conventions
- Use middleware pattern for credit verification and API access control
- Return appropriate HTTP status codes (401, 402, 403) for different error scenarios

## Important Notes
- The Python report generation system is decoupled from the web application
- Polar webhooks handle subscription lifecycle and credit allocation
- Rate limiting and audit logging should be implemented for API endpoints
- The application supports both French and English content (primarily French)