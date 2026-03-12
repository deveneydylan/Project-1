# Georgia Tech PIP Co — Dashboard Redesign Spec

**Date:** 2026-03-12
**Project:** NIL Lending Dashboard
**Status:** Approved

---

## Overview

Redesign the existing NIL lending dashboard into a branded **Georgia Tech PIP Co** platform. The platform manages NIL loans for Atlanta-area sports businesses, tracks Georgia Tech donor investments, and surfaces NIL deal data for 22 GT football athletes.

---

## Branding & Visual Design

- **Brand name:** Georgia Tech PIP Co ("PIP" has no defined acronym — it is a brand name)
- **Logo:** "GT" monogram in navy on gold background square
- **Color palette:**
  - Navy: `#003057`
  - Gold: `#EAAA00`
  - White: `#FFFFFF`
  - Light background: `#f1f5f9`
- **Stat cards:** All navy background with gold numbers and white/translucent labels (consistent across all tabs)
- **Tab indicator:** Gold underline on active tab, navy text
- **Charts:** Navy and gold alternating bars

---

## Interest Rate Structure

All loans carry **14% annual interest**, split three ways:

| Recipient | Rate | Description |
|-----------|------|-------------|
| PIP Co | 2% | Platform fee |
| Donors (investors) | 5% | Return to GT donor |
| Players (NIL) | 7% | NIL funds for athletes |

---

## Data Model Changes

### Schema updates required:

1. **`loans` table** — update interest split fields:
   - `pip_portion` REAL DEFAULT 2.0 (replaces `company_portion`)
   - `investor_portion` REAL DEFAULT 5.0 (new, replaces old `company_portion` second half)
   - `nil_portion` REAL DEFAULT 7.0 (update from 7.5)
   - `interest_rate` REAL DEFAULT 14.0 (update from 15.0)

2. **`payments` table** — add two new split columns:
   - `pip_contribution` REAL DEFAULT 0 (PIP Co's 2% share of interest paid)
   - `investor_contribution` REAL DEFAULT 0 (donor's 5% share of interest paid)
   - Existing `nil_contribution` column is retained

3. **`donors` table** (new):
   ```sql
   CREATE TABLE donors (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     email TEXT,
     loan_id INTEGER REFERENCES loans(id),
     amount REAL NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```
   - One donor per loan (1:1 relationship via `loan_id`)
   - Minimum $1,000,000 investment per donor
   - Donor is a named individual (high net-worth GT alumni/supporter)
   - No school_id needed — platform is GT-only by design

4. **`athletes` table** — add columns:
   - `jersey_number` INTEGER
   - `unit` TEXT CHECK(unit IN ('offense', 'defense')) — for grouping starters
   - `email` TEXT
   - Seed with 22 male GT football players only (11 offense, 11 defense starters)

5. **`schools` table** — seed with Georgia Tech only

6. **`companies` table** — seed with 5 Atlanta-area sports industry businesses

### Donor ↔ Loan mapping (seed):

| Donor | loan_id | Amount |
|-------|---------|--------|
| Robert A. Griffin | 1 (Peachtree Sports Media) | $2,500,000 |
| James T. Crawford | 2 (Victory Sports Management) | $1,500,000 |
| William H. Thompson | 3 (Atlanta Athlete Agency) | $3,000,000 |
| Charles B. Morrison | 4 (Yellow Jacket Sports Group) | $5,000,000 |
| Edward L. Harrison | 5 (Southfield Athletic Consulting) | $8,000,000 |

### Seed data:

**School:** Georgia Tech (ACC, GA) — only school

**Companies (borrowers):**
1. Peachtree Sports Media — contact@peachtreesportsmedia.com
2. Victory Sports Management — finance@victorysportsmgmt.com
3. Atlanta Athlete Agency — info@atlantaathlete.com
4. Yellow Jacket Sports Group — ops@yellowjacketsports.com
5. Southfield Athletic Consulting — admin@southfieldathletic.com

**Donors (GT high net-worth individuals):**
1. Robert A. Griffin — rgriffin@gmail.com — $2,500,000 — loan_id: 1
2. James T. Crawford — jcrawford@crawfordventures.com — $1,500,000 — loan_id: 2
3. William H. Thompson — wthompson@thompsonindustries.com — $3,000,000 — loan_id: 3
4. Charles B. Morrison — cmorrison@morrisoncapital.com — $5,000,000 — loan_id: 4
5. Edward L. Harrison — eharrison@harrisongroup.com — $8,000,000 — loan_id: 5

**Athletes — Offense (11), unit='offense':**
1. Marcus Williams — QB — #12 — m.williams@gatech.edu
2. Jordan Hayes — WR — #80 — j.hayes@gatech.edu
3. Devon Harris — WR — #11 — d.harris@gatech.edu
4. Tyler Brooks — RB — #28 — t.brooks@gatech.edu
5. Cameron Foster — FB — #44 — c.foster@gatech.edu
6. Ryan Mitchell — TE — #85 — r.mitchell@gatech.edu
7. DeShawn Lee — LT — #72 — d.lee@gatech.edu
8. Malik Johnson — LG — #67 — m.johnson@gatech.edu
9. Chris Anderson — C — #55 — c.anderson@gatech.edu
10. Brandon Thomas — RG — #64 — b.thomas@gatech.edu
11. Darius Thompson — RT — #75 — d.thompson@gatech.edu

**Athletes — Defense (11), unit='defense':**
12. Deon Carter — DE — #90 — deon.carter@gatech.edu
13. Jamal Williams — DT — #92 — jamal.williams@gatech.edu
14. Andre Robinson — DT — #95 — a.robinson@gatech.edu
15. Marcus Green — DE — #88 — m.green@gatech.edu
16. Isaiah Davis — MLB — #54 — i.davis@gatech.edu
17. Trevon Walker — OLB — #51 — t.walker@gatech.edu
18. DeAndre Smith — OLB — #48 — deandre.smith@gatech.edu
19. Kevin Johnson — CB — #23 — k.johnson@gatech.edu
20. Nathan Harris — CB — #31 — n.harris@gatech.edu
21. Elijah Moore — FS — #20 — e.moore@gatech.edu
22. Darren Washington — SS — #36 — d.washington@gatech.edu

---

## Internal Dashboard

### Navigation
- Top nav bar: navy background, GT gold logo mark, "Georgia Tech PIP Co" in white
- Two nav links: "Internal" (active state: gold border + gold text) and "Client Portal"

### Tabs (5 total, all functional)
`Overview` | `Loans` | `NIL Deals` | `Athletes` | `Donors`

Active tab: gold underline, navy bold text. Inactive: gray text.

### Overview Tab

**Stat cards (6, all navy/gold):**
1. Loans Outstanding — total principal of active loans
2. PIP Co Revenue (2%) — sum of `pip_contribution` from all payments
3. Donor Returns (5%) — sum of `investor_contribution` from all payments
4. NIL Collected (7%) — sum of `nil_contribution` from all payments
5. NIL Allocated — total amount of active NIL deals
6. NIL Available — NIL Collected minus NIL Allocated

**Charts (2):**
- NIL by Position — horizontal bar chart grouped by athlete `position`, navy/gold alternating. Requires new endpoint `GET /api/stats/nil-by-position`
- Interest Split Breakdown — donut chart: 2% navy (PIP Co), 5% gold (Donors), 7% gray (Players). Static proportions, no endpoint needed.

**Recent activity tables (2):**
- Recent Loans (last 5): Company, Amount, Donor name (formatted as first initial + last name, e.g. "R. Griffin"), Status
- Recent NIL Deals (last 5): Athlete, Position, Amount

### Loans Tab
Table: Company, Principal, Interest Rate (14%), Start Date, End Date, Status badge

### NIL Deals Tab
Summary stats (3 cards): NIL Collected, NIL Allocated, NIL Available
Table: Athlete, Position, Amount, Deal Type, Status

### Athletes Tab
Search bar — filter by name or position only (school filter removed; GT-only platform)
Grid of 22 athlete cards: navy avatar circle with gold initials, name, position, jersey number, social followers, NIL deal amount if active

### Donors Tab

**Summary stats (3 cards, all navy/gold):**
1. Total Invested — sum of `donors.amount` for all donors
2. Total Returns Earned — sum of `investor_contribution` from all payments (cash basis, actual payments made)
3. Projected Total Return — sum of `donors.amount * 1.05` (principal + flat 5% over loan term)

**Donor rows (one per donor):**
Columns: Name | Invested | % of Fund | 5% Return | Total Return

- **% of Fund** = `donor.amount / sum(all donors.amount) * 100`
- **5% Return** = `donor.amount * 0.05` (projected)
- **Total Return** = `donor.amount * 1.05` (projected)
- No company/loan references shown on donor cards

---

## Client Portal

### Layout
- Same top nav, "Client Portal" active
- Company selector dropdown (top right)
- No tabs — single scrollable page

### Stat cards (4, all navy/gold):
1. Total Borrowed
2. Total Paid
3. NIL Contributed (7%) — sum of `nil_contribution` from this company's payments; subtitle "Supporting GT athletes"
4. Active Loans

### Athlete Grid
All 22 GT football athletes displayed regardless of company selection. This is a fixed promotional display — athlete cards are not filtered by company.
Each card: navy avatar with gold initials, name, position, jersey number, NIL deal amount.

### Tables
- Loan details table: Principal, Rate, Start Date, End Date, Status
- Payment history table: Date, Amount, Principal Paid, Interest Paid, NIL Contribution

---

## API Changes

### New endpoints:
- `GET /api/donors` — all donors; each row includes: id, name, amount, pct_of_fund, projected_return (amount * 1.05), returns_earned (sum of investor_contribution from payments on their loan)
- `GET /api/stats/donors` — aggregate: total_invested, total_returns_earned, projected_total_return
- `GET /api/stats/nil-by-position` — sum of nil_deals.amount grouped by athlete position

### Updated endpoints:
- `GET /api/loans` — add `donor_display_name` field (join donors, format as "F. Lastname")
- `GET /api/stats/portfolio` — add `pip_revenue` (sum pip_contribution), `donor_returns` (sum investor_contribution); update nil_collected to use 7% split
- `GET /api/stats/company/:id` — update NIL contribution calc to 7%
- `POST /api/loans` — accept `pip_portion` (default 2), `investor_portion` (default 5), `nil_portion` (default 7)

### Removed endpoints:
- `GET /api/stats/nil-by-sport` — replaced by nil-by-position
- `GET /api/stats/nil-by-school` — removed (single school, no longer meaningful)

### Payment calculation (POST /api/payments):
```
interest_paid = amount - principal_paid
nil_contribution      = interest_paid * (7 / 14)   // 0.5
investor_contribution = interest_paid * (5 / 14)   // ~0.357
pip_contribution      = interest_paid * (2 / 14)   // ~0.143
```
All three values stored in the `payments` row.

### Obsolete frontend components to replace:
- `NilBySportChart` → replace with `NilByPositionChart` (horizontal bar, navy/gold)
- `NilBySchoolChart` → replace with `InterestSplitChart` (donut, static proportions)

---

## Out of Scope (deferred)
- Authentication / login
- Loan origination workflow (create new loans from UI)
- Export/reporting
- Real-time data / websockets
- `GET /api/donors/:id` single-donor detail view (no UI for it currently)
