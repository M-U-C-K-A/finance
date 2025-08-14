# 📍 FinAnalytics — Roadmap

## Phase 1 — Foundations
🛠 Goal: Set up the core technical structure of the SaaS.

- [ ] **Authentication & User Management**
  - [ ] Integrate Better Auth with:
    - [ ] Google login
    - [ ] GitHub login (temporary)
    - [ ] Email/password
  - [ ] Store profiles & subscription plans in Prisma
  - [ ] Prepare 2FA activation (optional for v1)

- [ ] **App Structure (Next.js 15 + Tailwind + shadcn/ui)**
  - [ ] Dashboard
  - [ ] Reports pages (History / Generate / Recurring / Purchase)
  - [ ] Subscription pages (Current Plan / Upgrade / Billing)
  - [ ] Credits pages (Buy / History)
  - [ ] Settings

- [ ] **Database Setup**
  - [ ] PostgreSQL + Prisma
  - [ ] Models: Users, Reports, Subscriptions, Credits, RecurringReports, PaymentHistory
  - [ ] Seed test data

- [ ] **Internal API**
  - [ ] Endpoints for:
    - [ ] Report generation
    - [ ] Report list
    - [ ] Remaining credits
    - [ ] Subscription details
  - [ ] Middleware for quota & permissions

---

## Phase 2 — Report Engine
⚙️ Goal: End-to-end flow from submission → processing → delivery.

- [ ] **Python Worker**
  - [ ] Scripts to fetch market, index, ETF data (API or scraping)
  - [ ] Basic analysis + options (custom pricer, deep analysis…)
  - [ ] Save results to storage (S3/local)
  - [ ] Update DB with report status

- [ ] **Workflow**
  - [ ] Report form in UI
  - [ ] API → Prisma → Worker → Storage → UI
  - [ ] Polling or WebSocket for progress

---

## Phase 3 — Monetization
💰 Goal: Enable payments & usage control.

- [ ] **Plans & Credits**
  - [ ] Subscription plans (Starter / Pro / Enterprise)
  - [ ] Credit packs (100 / 500 / 2000)
  - [ ] Credits as add-on to subscription
  - [ ] Metered pricing for API (future)

- [ ] **Payment Integration**
  - [ ] Polar (or Stripe)
  - [ ] Checkout page + webhook
  - [ ] Payment history in dashboard

---

## Phase 4 — Recurring Reports & Public API
🔄 Goal: Automate & allow integrations.

- [ ] **Recurring Reports**
  - [ ] UI to schedule recurring reports
  - [ ] Cron job to trigger automatically
  - [ ] Auto-credit consumption

- [ ] **External API (subscription required)**
  - [ ] API key per account
  - [ ] Endpoints:
    - [ ] Generate report
    - [ ] Retrieve reports
    - [ ] Check credits

---

## Phase 5 — Marketing & Advanced Features
🚀 Goal: Grow user base & increase value.

- [ ] **Marketing**
  - [ ] Landing page with clear product pitch
  - [ ] Instagram campaign + affiliation system
  - [ ] Blog SEO content

- [ ] **Advanced Features**
  - [ ] Multi-asset comparison
  - [ ] News integration
  - [ ] Advanced export formats (CSV enriched, XLSX)
