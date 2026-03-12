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
   - `investor_portion` REAL DEFAULT 5.0 (new)
   - `nil_portion` REAL DEFAULT 7.0 (update from 7.5)
   - `interest_rate` REAL DEFAULT 14.0 (update from 15.0)

2. **`donors` table** (new):
   ```sql
   CREATE TABLE donors (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     loan_id INTEGER REFERENCES loans(id),
     amount REAL NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```
   - One donor per loan, minimum $1,000,000 investment
   - Donor is always a named individual (high net-worth GT alumni/supporter)

3. **`schools` table** — seed with Georgia Tech only

4. **`athletes` table** — seed with 22 male GT football players only (11 offense, 11 defense starters)

5. **`companies` table** — seed with 5 Atlanta-area sports industry businesses

### Seed data:

**School:** Georgia Tech (ACC, GA) — only school

**Companies (borrowers):**
1. Peachtree Sports Media
2. Victory Sports Management
3. Atlanta Athlete Agency
4. Yellow Jacket Sports Group
5. Southfield Athletic Consulting

**Donors (GT high net-worth individuals):**
1. Robert A. Griffin — $2,500,000
2. James T. Crawford — $1,500,000
3. William H. Thompson — $3,000,000
4. Charles B. Morrison — $5,000,000
5. Edward L. Harrison — $8,000,000

**Athletes — Offense (11):**
1. Marcus Williams — QB — #12
2. Jordan Hayes — WR — #80
3. Devon Harris — WR — #11
4. Tyler Brooks — RB — #28
5. Cameron Foster — FB — #44
6. Ryan Mitchell — TE — #85
7. DeShawn Lee — LT — #72
8. Malik Johnson — LG — #67
9. Chris Anderson — C — #55
10. Brandon Thomas — RG — #64
11. Darius Thompson — RT — #75

**Athletes — Defense (11):**
12. Deon Carter — DE — #90
13. Jamal Williams — DT — #92
14. Andre Robinson — DT — #95
15. Marcus Green — DE — #88
16. Isaiah Davis — MLB — #54
17. Trevon Walker — OLB — #51
18. DeAndre Smith — OLB — #48
19. Kevin Johnson — CB — #23
20. Nathan Harris — CB — #31
21. Elijah Moore — FS — #20
22. Darren Washington — SS — #36

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
2. PIP Co Revenue (2%) — PIP Co's earned interest from payments
3. Donor Returns (5%) — interest paid out to donors
4. NIL Collected (7%) — NIL interest collected from payments
5. NIL Allocated — total active NIL deal amounts
6. NIL Available — NIL Collected minus NIL Allocated

**Charts (2):**
- NIL by Position (horizontal bar, navy/gold alternating)
- Interest Split Breakdown (pie/donut: 2% navy, 5% gold, 7% gray)

**Recent activity tables (2):**
- Recent Loans: Company, Amount, Donor name (first initial + last), Status
- Recent NIL Deals: Athlete, Position, Amount

### Loans Tab
Table: Company, Principal, Interest Rate (14%), Start Date, End Date, Status badge

### NIL Deals Tab
Summary stats (3 cards): NIL Collected, NIL Allocated, NIL Available
Table: Athlete, Position, Amount, Deal Type, Status

### Athletes Tab
Search bar (filter by name or position)
Grid of 22 athlete cards (navy avatar circle with gold initials, name, position, jersey number, social followers, NIL deal amount if active)

### Donors Tab

**Summary stats (3 cards, all navy/gold):**
1. Total Invested
2. Total Returns Earned (5% paid out)
3. Projected Total Return (principal + 5%)

**Donor rows (one per donor):**
Columns: Name | Invested | % of Fund | 5% Return | Total Return
No company/loan references shown on donor cards.

---

## Client Portal

### Layout
- Same top nav, "Client Portal" active
- Company selector dropdown (top right)
- No tabs — single scrollable page

### Stat cards (4, all navy/gold):
1. Total Borrowed
2. Total Paid
3. NIL Contributed (7%) — with subtitle "Supporting GT athletes"
4. Active Loans

### Athlete Grid
All 22 GT football athletes displayed (not filtered by company).
Each card: navy avatar with gold initials, name, position, jersey number, NIL deal amount.

### Tables
- Loan details table
- Payment history table: Date, Amount, Principal Paid, Interest Paid, NIL Contribution

---

## API Changes

### New endpoints needed:
- `GET /api/donors` — all donors with calculated fields
- `GET /api/donors/:id` — single donor
- `GET /api/stats/donors` — aggregate: total invested, total returns earned, projected total return

### Updated endpoints:
- `GET /api/stats/portfolio` — add `pip_revenue`, `donor_returns` fields; update NIL split to 7%
- `GET /api/stats/company/:id` — update NIL contribution calc to 7%
- `POST /api/loans` — accept `pip_portion`, `investor_portion`, `nil_portion`; default 2/5/7

### Payment calculation update:
```
nil_contribution = interest_paid * (7 / 14)       // 50% of interest
pip_contribution = interest_paid * (2 / 14)        // ~14.3%
investor_contribution = interest_paid * (5 / 14)   // ~35.7%
```

---

## Out of Scope (deferred)
- Authentication / login
- Loan origination workflow (create new loans from UI)
- Export/reporting
- Real-time data / websockets
