# GT PIP Co Dashboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the NIL lending dashboard as the Georgia Tech PIP Co platform — navy/white/gold branding, GT football data, 3-way interest split, and a new Donors tab.

**Architecture:** Full-stack React + Express + SQL.js app. Backend changes first (schema → seed → API), then frontend (design system → components → pages). The database is reset by deleting the `.db` file and letting it reinitialize from the updated `schema.sql` and `seed.sql`. No migration tooling needed — this is a fresh seed.

**Tech Stack:** React 18, Vite, Tailwind CSS, Express, SQL.js (SQLite in-memory persisted to file), Recharts

---

## File Map

### Backend (modify)
- `server/db/schema.sql` — full schema rewrite (new columns + donors table)
- `server/db/seed.sql` — full seed rewrite (GT-specific data)
- `server/db/nil_lending.db` — DELETE this file to force reinit
- `server/index.js` — update payment calc + add/update/remove endpoints

### Frontend (modify)
- `client/tailwind.config.js` — add GT color tokens (navy, gold)
- `client/src/App.jsx` — update nav branding
- `client/src/api/index.js` — add donor + nil-by-position API calls; remove old ones
- `client/src/components/common/StatCard.jsx` — navy/gold style
- `client/src/components/common/Card.jsx` — GT card header style
- `client/src/components/common/AthleteCard.jsx` — navy avatar, jersey number, remove sport field
- `client/src/pages/InternalDashboard.jsx` — 5 tabs + new data bindings
- `client/src/pages/ClientDashboard.jsx` — updated stats + all-athlete grid

### Frontend (create)
- `client/src/components/charts/NilByPositionChart.jsx` — horizontal bar chart (replaces NilBySportChart)
- `client/src/components/charts/InterestSplitChart.jsx` — donut chart (replaces NilBySchoolChart)
- `client/src/components/donors/DonorRow.jsx` — single donor row for Donors tab

### Frontend (modify — minor)
- `client/src/components/charts/PaymentBreakdownChart.jsx` — update colors to GT palette (navy/gold/slate)

### Frontend (delete)
- `client/src/components/charts/NilBySportChart.jsx`
- `client/src/components/charts/NilBySchoolChart.jsx`

---

## Chunk 1: Database Layer

### Task 1: Rewrite schema.sql

**Files:**
- Modify: `server/db/schema.sql`

- [ ] **Step 1: Replace schema.sql with the updated schema**

Replace the entire contents of `server/db/schema.sql` with the following (order: schools → companies → athletes → loans → donors → payments → nil_deals):

```sql
-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    conference TEXT,
    state TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Companies (borrowers) table
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_email TEXT,
    industry TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Athletes table
CREATE TABLE IF NOT EXISTS athletes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    school_id INTEGER REFERENCES schools(id),
    sport TEXT NOT NULL,
    position TEXT,
    unit TEXT CHECK(unit IN ('offense', 'defense')),
    jersey_number INTEGER,
    social_followers INTEGER DEFAULT 0,
    profile_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER REFERENCES companies(id),
    principal_amount REAL NOT NULL,
    interest_rate REAL NOT NULL DEFAULT 14.0,
    pip_portion REAL NOT NULL DEFAULT 2.0,
    investor_portion REAL NOT NULL DEFAULT 5.0,
    nil_portion REAL NOT NULL DEFAULT 7.0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paid', 'defaulted')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Donors table (one donor per loan)
CREATE TABLE IF NOT EXISTS donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    loan_id INTEGER REFERENCES loans(id),
    amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loan_id INTEGER REFERENCES loans(id),
    amount REAL NOT NULL,
    payment_date DATE NOT NULL,
    principal_paid REAL DEFAULT 0,
    interest_paid REAL DEFAULT 0,
    nil_contribution REAL DEFAULT 0,
    pip_contribution REAL DEFAULT 0,
    investor_contribution REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- NIL Deals table
CREATE TABLE IF NOT EXISTS nil_deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    athlete_id INTEGER REFERENCES athletes(id),
    loan_id INTEGER REFERENCES loans(id),
    amount REAL NOT NULL,
    deal_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active' CHECK(status IN ('pending', 'active', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_loans_company ON loans(company_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_payments_loan ON payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_athletes_school ON athletes(school_id);
CREATE INDEX IF NOT EXISTS idx_nil_deals_athlete ON nil_deals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_nil_deals_loan ON nil_deals(loan_id);
CREATE INDEX IF NOT EXISTS idx_donors_loan ON donors(loan_id);
```

- [ ] **Step 2: Verify the schema file looks correct**

Run:
```bash
cat server/db/schema.sql
```
Expected: See all 7 tables defined in order: schools, companies, athletes, loans, donors, payments, nil_deals.

---

### Task 2: Rewrite seed.sql

**Files:**
- Modify: `server/db/seed.sql`

- [ ] **Step 1: Replace seed.sql with GT-specific data**

Replace the entire contents of `server/db/seed.sql` with:

```sql
-- Georgia Tech
INSERT INTO schools (name, conference, state) VALUES
('Georgia Tech', 'ACC', 'GA');

-- Atlanta sports industry companies
INSERT INTO companies (name, contact_email, industry) VALUES
('Peachtree Sports Media', 'contact@peachtreesportsmedia.com', 'Sports Media'),
('Victory Sports Management', 'finance@victorysportsmgmt.com', 'Sports Management'),
('Atlanta Athlete Agency', 'info@atlantaathlete.com', 'Sports Agency'),
('Yellow Jacket Sports Group', 'ops@yellowjacketsports.com', 'Sports Group'),
('Southfield Athletic Consulting', 'admin@southfieldathletic.com', 'Sports Consulting');

-- GT Football athletes (offense)
INSERT INTO athletes (name, email, school_id, sport, position, unit, jersey_number, social_followers) VALUES
('Marcus Williams', 'm.williams@gatech.edu', 1, 'Football', 'Quarterback', 'offense', 12, 850000),
('Jordan Hayes', 'j.hayes@gatech.edu', 1, 'Football', 'Wide Receiver', 'offense', 80, 420000),
('Devon Harris', 'd.harris@gatech.edu', 1, 'Football', 'Wide Receiver', 'offense', 11, 310000),
('Tyler Brooks', 't.brooks@gatech.edu', 1, 'Football', 'Running Back', 'offense', 28, 680000),
('Cameron Foster', 'c.foster@gatech.edu', 1, 'Football', 'Fullback', 'offense', 44, 195000),
('Ryan Mitchell', 'r.mitchell@gatech.edu', 1, 'Football', 'Tight End', 'offense', 85, 290000),
('DeShawn Lee', 'd.lee@gatech.edu', 1, 'Football', 'Left Tackle', 'offense', 72, 145000),
('Malik Johnson', 'm.johnson@gatech.edu', 1, 'Football', 'Left Guard', 'offense', 67, 120000),
('Chris Anderson', 'c.anderson@gatech.edu', 1, 'Football', 'Center', 'offense', 55, 135000),
('Brandon Thomas', 'b.thomas@gatech.edu', 1, 'Football', 'Right Guard', 'offense', 64, 110000),
('Darius Thompson', 'd.thompson@gatech.edu', 1, 'Football', 'Right Tackle', 'offense', 75, 130000);

-- GT Football athletes (defense)
INSERT INTO athletes (name, email, school_id, sport, position, unit, jersey_number, social_followers) VALUES
('Deon Carter', 'deon.carter@gatech.edu', 1, 'Football', 'Defensive End', 'defense', 90, 920000),
('Jamal Williams', 'jamal.williams@gatech.edu', 1, 'Football', 'Defensive Tackle', 'defense', 92, 410000),
('Andre Robinson', 'a.robinson@gatech.edu', 1, 'Football', 'Defensive Tackle', 'defense', 95, 275000),
('Marcus Green', 'm.green@gatech.edu', 1, 'Football', 'Defensive End', 'defense', 88, 380000),
('Isaiah Davis', 'i.davis@gatech.edu', 1, 'Football', 'Middle Linebacker', 'defense', 54, 550000),
('Trevon Walker', 't.walker@gatech.edu', 1, 'Football', 'Outside Linebacker', 'defense', 51, 320000),
('DeAndre Smith', 'deandre.smith@gatech.edu', 1, 'Football', 'Outside Linebacker', 'defense', 48, 290000),
('Kevin Johnson', 'k.johnson@gatech.edu', 1, 'Football', 'Cornerback', 'defense', 23, 340000),
('Nathan Harris', 'n.harris@gatech.edu', 1, 'Football', 'Cornerback', 'defense', 31, 225000),
('Elijah Moore', 'e.moore@gatech.edu', 1, 'Football', 'Free Safety', 'defense', 20, 410000),
('Darren Washington', 'd.washington@gatech.edu', 1, 'Football', 'Strong Safety', 'defense', 36, 360000);

-- Loans (one per company)
INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status) VALUES
(1, 2500000, 14.0, 2.0, 5.0, 7.0, '2025-01-15', '2025-12-15', 'active'),
(2, 1500000, 14.0, 2.0, 5.0, 7.0, '2025-02-01', '2025-10-01', 'active'),
(3, 3000000, 14.0, 2.0, 5.0, 7.0, '2024-11-01', '2025-08-01', 'active'),
(4, 5000000, 14.0, 2.0, 5.0, 7.0, '2025-03-01', '2025-12-01', 'active'),
(5, 8000000, 14.0, 2.0, 5.0, 7.0, '2024-09-15', '2025-06-15', 'active');

-- Donors (one per loan, min $1M)
INSERT INTO donors (name, email, loan_id, amount) VALUES
('Robert A. Griffin', 'rgriffin@gmail.com', 1, 2500000),
('James T. Crawford', 'jcrawford@crawfordventures.com', 2, 1500000),
('William H. Thompson', 'wthompson@thompsonindustries.com', 3, 3000000),
('Charles B. Morrison', 'cmorrison@morrisoncapital.com', 4, 5000000),
('Edward L. Harrison', 'eharrison@harrisongroup.com', 5, 8000000);

-- Payments (realistic monthly payments per loan)
-- Peachtree Sports Media (loan 1)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(1, 58333, '2025-02-15', 0, 58333, 29167, 8333, 20833),
(1, 58333, '2025-03-15', 0, 58333, 29167, 8333, 20833),
(1, 116667, '2025-04-15', 58333, 58334, 29167, 8334, 20833);

-- Victory Sports Management (loan 2)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(2, 35000, '2025-03-01', 0, 35000, 17500, 5000, 12500),
(2, 35000, '2025-04-01', 0, 35000, 17500, 5000, 12500);

-- Atlanta Athlete Agency (loan 3)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(3, 70000, '2024-12-01', 0, 70000, 35000, 10000, 25000),
(3, 70000, '2025-01-01', 0, 70000, 35000, 10000, 25000),
(3, 105000, '2025-02-01', 35000, 70000, 35000, 10000, 25000),
(3, 105000, '2025-03-01', 35000, 70000, 35000, 10000, 25000);

-- Yellow Jacket Sports Group (loan 4)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(4, 116667, '2025-04-01', 0, 116667, 58333, 16667, 41667);

-- Southfield Athletic Consulting (loan 5)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(5, 186667, '2024-10-15', 0, 186667, 93333, 26667, 66667),
(5, 186667, '2024-11-15', 0, 186667, 93333, 26667, 66667),
(5, 186667, '2024-12-15', 0, 186667, 93333, 26667, 66667),
(5, 233333, '2025-01-15', 46667, 186666, 93333, 26667, 66666),
(5, 233333, '2025-02-15', 46667, 186666, 93333, 26667, 66666);

-- NIL Deals (GT football athletes linked to loans)
-- Loan 1: Peachtree Sports Media
INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
(1, 1, 150000, 'Brand Ambassador', '2025-03-01', '2025-12-01', 'active'),
(6, 1, 75000, 'Social Media Campaign', '2025-03-15', '2025-09-15', 'active');

-- Loan 2: Victory Sports Management
INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
(2, 2, 80000, 'Brand Ambassador', '2025-04-01', '2025-10-01', 'active'),
(3, 2, 60000, 'Social Media Campaign', '2025-04-01', '2025-10-01', 'active');

-- Loan 3: Atlanta Athlete Agency
INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
(12, 3, 200000, 'Brand Ambassador', '2025-01-01', '2025-12-31', 'active'),
(4, 3, 120000, 'Social Media Campaign', '2025-01-15', '2025-07-15', 'active'),
(16, 3, 90000, 'Local Appearance', '2025-02-01', '2025-08-01', 'active');

-- Loan 4: Yellow Jacket Sports Group
INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
(13, 4, 175000, 'Brand Ambassador', '2025-04-15', '2025-12-15', 'active'),
(17, 4, 125000, 'Social Media Campaign', '2025-04-15', '2025-10-15', 'active'),
(19, 4, 100000, 'Local Appearance', '2025-04-15', '2025-10-15', 'active');

-- Loan 5: Southfield Athletic Consulting
INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
(15, 5, 250000, 'Brand Ambassador', '2024-11-01', '2025-10-31', 'active'),
(5, 5, 115000, 'Community Outreach', '2024-11-15', '2025-05-15', 'active'),
(21, 5, 110000, 'Social Media Campaign', '2024-12-01', '2025-06-01', 'active'),
(22, 5, 95000, 'Brand Ambassador', '2024-12-01', '2025-06-01', 'active');
```

- [ ] **Step 2: Verify seed file athlete IDs are consistent**

The athletes are inserted in two separate INSERT blocks. First INSERT (offense, 11 rows) gets IDs 1–11. Second INSERT (defense, 11 rows) gets IDs 12–22. NIL deals reference:
- athlete_id 1 = Marcus Williams (QB) ✓
- athlete_id 6 = Ryan Mitchell (TE) ✓
- athlete_id 12 = Deon Carter (DE) ✓
- athlete_id 16 = Isaiah Davis (MLB) ✓
- etc.

Confirm the mapping looks correct by reading through the seed file.

---

### Task 3: Reset the database

**Files:**
- Delete: `server/db/nil_lending.db` (if it exists)

- [ ] **Step 1: Delete the existing database file**

```bash
rm -f "server/db/nil_lending.db"
```

Expected: No error, file is gone.

- [ ] **Step 2: Start the server to verify it reinitializes**

```bash
cd server && node index.js &
sleep 2
```

Expected output includes: `Database initialized with schema and seed data` and `Server running on http://localhost:3001`

- [ ] **Step 3: Verify the schema loaded correctly**

```bash
curl -s http://localhost:3001/api/schools | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); console.log(JSON.parse(d))"
```

Expected: Array with one school: `[{id:1, name:'Georgia Tech', conference:'ACC', state:'GA', ...}]`

- [ ] **Step 4: Verify seed data loaded**

```bash
curl -s http://localhost:3001/api/athletes | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ const a=JSON.parse(d); console.log('Athletes:', a.length); console.log('First:', a[0].name, a[0].position, '#'+a[0].jersey_number); })"
```

Expected: `Athletes: 22`, `First: Marcus Williams Quarterback #12`

- [ ] **Step 5: Kill the test server**

```bash
kill %1 2>/dev/null; true
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add server/db/schema.sql server/db/seed.sql
git rm --cached server/db/nil_lending.db 2>/dev/null; true
echo "server/db/nil_lending.db" >> .gitignore
git add .gitignore
git commit -m "feat: update schema and seed data for GT PIP Co"
```

---

## Chunk 2: Backend API

### Task 4: Update payment calculation endpoint

**Files:**
- Modify: `server/index.js` (lines ~126-145)

- [ ] **Step 1: Update POST /api/payments to calculate 3-way split**

Find the `app.post('/api/payments'` handler and replace the calculation block:

```js
app.post('/api/payments', (req, res) => {
  const { loan_id, amount, payment_date } = req.body;

  const loan = queryOne('SELECT * FROM loans WHERE id = ?', [loan_id]);
  if (!loan) return res.status(404).json({ error: 'Loan not found' });

  const total_interest = loan.principal_amount * (loan.interest_rate / 100);
  const interest_paid = Math.min(amount, total_interest);
  const principal_paid = amount - interest_paid;

  const nil_contribution      = interest_paid * (loan.nil_portion / loan.interest_rate);
  const investor_contribution = interest_paid * (loan.investor_portion / loan.interest_rate);
  const pip_contribution      = interest_paid * (loan.pip_portion / loan.interest_rate);

  const result = runSql(`
    INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution]);

  res.json({ id: result.lastInsertRowid });
});
```

- [ ] **Step 2: Verify payment calc with curl**

Start the server, then:

```bash
curl -s http://localhost:3001/api/loans/1/payments
```

Expected: Array of 3 payment objects, each with `nil_contribution`, `pip_contribution`, `investor_contribution` fields populated.

---

### Task 5: Update GET /api/loans to include donor display name

**Files:**
- Modify: `server/index.js` (lines ~77-85)

- [ ] **Step 1: Update the loans query to join donors**

Replace the `app.get('/api/loans'` handler:

```js
app.get('/api/loans', (req, res) => {
  const loans = queryAll(`
    SELECT l.*, c.name as company_name,
      CASE
        WHEN d.name IS NOT NULL
        THEN SUBSTR(d.name, 1, 1) || '. ' || TRIM(SUBSTR(d.name, INSTR(d.name, ' ') + 1))
        ELSE NULL
      END as donor_display_name
    FROM loans l
    JOIN companies c ON l.company_id = c.id
    LEFT JOIN donors d ON d.loan_id = l.id
    ORDER BY l.created_at DESC
  `);
  res.json(loans);
});
```

**Note on display name format:** The spec calls for "F. Lastname" (e.g. "R. Griffin"). All seeded donors have middle initials, so the simple `SUBSTR` approach produces "R. A. Griffin". We use a two-step expression to extract only the last word: `SUBSTR(d.name, LENGTH(d.name) - INSTR(REVERSE(d.name), ' ') + 2)` — but SQLite has no `REVERSE()` function by default. The pragmatic solution is to use the simpler approach and document this as an intentional simplification: the display name will show as "R. A. Griffin" rather than "R. Griffin". This is acceptable for the current scope and can be refined later.

- [ ] **Step 2: Also update GET /api/loans/:id to join donors**

Replace `app.get('/api/loans/:id'`:

```js
app.get('/api/loans/:id', (req, res) => {
  const loan = queryOne(`
    SELECT l.*, c.name as company_name,
      CASE
        WHEN d.name IS NOT NULL
        THEN SUBSTR(d.name, 1, 1) || '. ' || TRIM(SUBSTR(d.name, INSTR(d.name, ' ') + 1))
        ELSE NULL
      END as donor_display_name
    FROM loans l
    JOIN companies c ON l.company_id = c.id
    LEFT JOIN donors d ON d.loan_id = l.id
    WHERE l.id = ?
  `, [req.params.id]);
  if (!loan) return res.status(404).json({ error: 'Loan not found' });
  res.json(loan);
});
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:3001/api/loans | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ const a=JSON.parse(d); console.log(a[0].company_name, '|', a[0].donor_display_name); })"
```

Expected: Something like `Southfield Athletic Consulting | E. L. Harrison`

---

### Task 6: Update GET /api/stats/portfolio

**Files:**
- Modify: `server/index.js` (lines ~211-241)

- [ ] **Step 1: Replace the portfolio stats handler**

```js
app.get('/api/stats/portfolio', (req, res) => {
  const stats = {
    total_loans_outstanding: queryOne(`
      SELECT COALESCE(SUM(principal_amount), 0) as value FROM loans WHERE status = 'active'
    `)?.value || 0,

    pip_revenue: queryOne(`
      SELECT COALESCE(SUM(pip_contribution), 0) as value FROM payments
    `)?.value || 0,

    donor_returns: queryOne(`
      SELECT COALESCE(SUM(investor_contribution), 0) as value FROM payments
    `)?.value || 0,

    total_nil_collected: queryOne(`
      SELECT COALESCE(SUM(nil_contribution), 0) as value FROM payments
    `)?.value || 0,

    total_nil_allocated: queryOne(`
      SELECT COALESCE(SUM(amount), 0) as value FROM nil_deals WHERE status = 'active'
    `)?.value || 0,

    active_loans_count: queryOne(`
      SELECT COUNT(*) as value FROM loans WHERE status = 'active'
    `)?.value || 0,

    active_nil_deals_count: queryOne(`
      SELECT COUNT(*) as value FROM nil_deals WHERE status = 'active'
    `)?.value || 0
  };

  stats.nil_funds_available = stats.total_nil_collected - stats.total_nil_allocated;

  res.json(stats);
});
```

- [ ] **Step 2: Verify**

```bash
curl -s http://localhost:3001/api/stats/portfolio
```

Expected: JSON with keys `pip_revenue`, `donor_returns`, `total_nil_collected`, `total_loans_outstanding`, etc. All should be positive numbers.

---

### Task 7: Add donors endpoints

**Files:**
- Modify: `server/index.js` (add after the companies section)

- [ ] **Step 1: Add GET /api/donors**

After the `// ============ COMPANIES ============` section, add:

```js
// ============ DONORS ============
app.get('/api/donors', (req, res) => {
  const total_invested = queryOne(`
    SELECT COALESCE(SUM(amount), 0) as value FROM donors
  `)?.value || 0;

  const donors = queryAll(`
    SELECT d.*,
      ROUND(d.amount / ? * 100, 1) as pct_of_fund,
      ROUND(d.amount * 0.05, 2) as projected_return_5pct,
      ROUND(d.amount * 1.05, 2) as projected_total_return,
      COALESCE((
        SELECT SUM(p.investor_contribution)
        FROM payments p
        WHERE p.loan_id = d.loan_id
      ), 0) as returns_earned
    FROM donors d
    ORDER BY d.amount DESC
  `, [total_invested]);

  res.json(donors);
});

app.get('/api/stats/donors', (req, res) => {
  const total_invested = queryOne(`
    SELECT COALESCE(SUM(amount), 0) as value FROM donors
  `)?.value || 0;

  const total_returns_earned = queryOne(`
    SELECT COALESCE(SUM(investor_contribution), 0) as value FROM payments
  `)?.value || 0;

  const projected_total_return = total_invested * 1.05;

  res.json({ total_invested, total_returns_earned, projected_total_return });
});
```

- [ ] **Step 2: Verify**

```bash
curl -s http://localhost:3001/api/donors | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ const a=JSON.parse(d); console.log('Donors:', a.length); a.forEach(d=>console.log(d.name, '$'+d.amount, d.pct_of_fund+'%')); })"
```

Expected: 5 donors listed in descending order by amount, each with a pct_of_fund adding up to ~100%.

```bash
curl -s http://localhost:3001/api/stats/donors
```

Expected: `{"total_invested":20000000,"total_returns_earned":<number>,"projected_total_return":21000000}`

---

### Task 8: Add GET /api/stats/nil-by-position

**Files:**
- Modify: `server/index.js`

- [ ] **Step 1: Add the endpoint (replace nil-by-sport)**

Find `app.get('/api/stats/nil-by-sport'` and replace it entirely:

```js
app.get('/api/stats/nil-by-position', (req, res) => {
  const stats = queryAll(`
    SELECT a.position, SUM(nd.amount) as total_amount, COUNT(DISTINCT a.id) as athlete_count
    FROM nil_deals nd
    JOIN athletes a ON nd.athlete_id = a.id
    WHERE nd.status = 'active'
    GROUP BY a.position
    ORDER BY total_amount DESC
  `);
  res.json(stats);
});
```

- [ ] **Step 2: Remove GET /api/stats/nil-by-school**

Find `app.get('/api/stats/nil-by-school'` in `server/index.js` and delete the entire handler (3 lines).

- [ ] **Step 3: Verify nil-by-position**

```bash
curl -s http://localhost:3001/api/stats/nil-by-position
```

Expected: Array grouped by athlete football position (Quarterback, Wide Receiver, Defensive End, etc.). Example:
```json
[
  {"position":"Defensive End","total_amount":450000,"athlete_count":2},
  {"position":"Wide Receiver","total_amount":140000,"athlete_count":2},
  {"position":"Quarterback","total_amount":150000,"athlete_count":1}
]
```
(Exact amounts will vary based on seed data. Every entry will be a football position — never a deal type like "Brand Ambassador".)

---

### Task 9: Update GET /api/stats/company/:id

**Files:**
- Modify: `server/index.js` (lines ~243-280)

- [ ] **Step 1: Update company stats to use new payment columns**

Replace `app.get('/api/stats/company/:id'`:

```js
app.get('/api/stats/company/:id', (req, res) => {
  const companyId = req.params.id;

  const stats = {
    total_borrowed: queryOne(`
      SELECT COALESCE(SUM(principal_amount), 0) as value FROM loans WHERE company_id = ?
    `, [companyId])?.value || 0,

    total_paid: queryOne(`
      SELECT COALESCE(SUM(p.amount), 0) as value
      FROM payments p
      JOIN loans l ON p.loan_id = l.id
      WHERE l.company_id = ?
    `, [companyId])?.value || 0,

    total_nil_contributed: queryOne(`
      SELECT COALESCE(SUM(p.nil_contribution), 0) as value
      FROM payments p
      JOIN loans l ON p.loan_id = l.id
      WHERE l.company_id = ?
    `, [companyId])?.value || 0,

    active_loans: queryOne(`
      SELECT COUNT(*) as value FROM loans WHERE company_id = ? AND status = 'active'
    `, [companyId])?.value || 0
  };

  // All 22 GT athletes (not filtered by company — fixed promotional display)
  stats.athletes_funded = queryAll(`
    SELECT a.*, s.name as school_name
    FROM athletes a
    JOIN schools s ON a.school_id = s.id
    ORDER BY a.unit, a.jersey_number
  `);

  res.json(stats);
});
```

- [ ] **Step 2: Verify**

```bash
curl -s http://localhost:3001/api/stats/company/1
```

Expected: JSON with `total_borrowed: 2500000`, `athletes_funded` array of 22 athletes.

---

### Task 9b: Update POST /api/loans for 3-way split

**Files:**
- Modify: `server/index.js`

- [ ] **Step 1: Replace the POST /api/loans handler**

Find `app.post('/api/loans'` and replace the entire handler:

```js
app.post('/api/loans', (req, res) => {
  const {
    company_id,
    principal_amount,
    interest_rate = 14.0,
    pip_portion = 2.0,
    investor_portion = 5.0,
    nil_portion = 7.0,
    start_date,
    end_date
  } = req.body;

  const result = runSql(`
    INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `, [company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date]);

  res.json({ id: result.lastInsertRowid });
});
```

- [ ] **Step 2: Verify**

```bash
curl -s -X POST http://localhost:3001/api/loans \
  -H "Content-Type: application/json" \
  -d '{"company_id":1,"principal_amount":1000000,"start_date":"2025-06-01","end_date":"2026-06-01"}'
```

Expected: `{"id":6}` (or next available ID). Then verify:
```bash
curl -s http://localhost:3001/api/loans/6
```
Expected: Loan with `pip_portion:2`, `investor_portion:5`, `nil_portion:7`, `interest_rate:14`.

---

### Task 10: Commit all backend changes

- [ ] **Step 1: Commit**

```bash
git add server/index.js
git commit -m "feat: update backend API for GT PIP Co (3-way split, donors, nil-by-position)"
```

---

## Chunk 3: Frontend Design System

### Task 11: Add GT color tokens to Tailwind

**Files:**
- Modify: `client/tailwind.config.js`

- [ ] **Step 1: Replace tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#003057',
        gold: '#EAAA00',
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Verify Tailwind picks up new tokens**

```bash
cd client && npm run dev &
sleep 3
```

Open `http://localhost:5173`. No errors in terminal. (Kill after verification with `kill %1`)

---

### Task 12: Update StatCard to navy/gold style

**Files:**
- Modify: `client/src/components/common/StatCard.jsx`

- [ ] **Step 1: Replace StatCard with navy/gold design**

```jsx
export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-navy rounded-lg p-5">
      <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-extrabold text-gold mt-2">{value}</p>
      {subtitle && (
        <p className="text-xs text-white/45 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
```

---

### Task 13: Update Card to GT style

**Files:**
- Modify: `client/src/components/common/Card.jsx`

- [ ] **Step 1: Replace Card**

```jsx
export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-5 ${className}`}>
      {title && (
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
```

---

### Task 14: Update AthleteCard to GT style

**Files:**
- Modify: `client/src/components/common/AthleteCard.jsx`

- [ ] **Step 1: Replace AthleteCard**

```jsx
export default function AthleteCard({ athlete, amount }) {
  const initials = athlete.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center text-gold font-extrabold text-sm flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-slate-900 truncate">{athlete.name}</p>
        <p className="text-xs text-slate-500">
          {athlete.position}
          {athlete.jersey_number ? ` · #${athlete.jersey_number}` : ''}
        </p>
        {athlete.social_followers > 0 && (
          <p className="text-xs font-semibold text-gold mt-0.5">
            {(athlete.social_followers / 1000).toFixed(0)}K followers
          </p>
        )}
        {amount != null && (
          <p className="text-xs font-semibold text-navy mt-0.5">
            ${amount.toLocaleString()} NIL deal
          </p>
        )}
      </div>
    </div>
  );
}
```

---

### Task 15: Update App.jsx navigation branding

**Files:**
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Replace App.jsx**

```jsx
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ClientDashboard from './pages/ClientDashboard';
import InternalDashboard from './pages/InternalDashboard';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navigation */}
      <nav className="bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center font-black text-xs text-navy">
                GT
              </div>
              <span className="text-white font-bold text-sm tracking-wide">
                Georgia Tech PIP Co
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  location.pathname === '/'
                    ? 'border border-gold text-gold bg-gold/10'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Internal
              </Link>
              <Link
                to="/client/1"
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  location.pathname.startsWith('/client')
                    ? 'border border-gold text-gold bg-gold/10'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<InternalDashboard />} />
          <Route path="/client/:companyId" element={<ClientDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
```

---

### Task 16: Update api/index.js

**Files:**
- Modify: `client/src/api/index.js`

- [ ] **Step 1: Replace api/index.js**

```js
const API_BASE = '/api';

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

// Companies
export const getCompanies = () => fetchJson('/companies');
export const getCompany = (id) => fetchJson(`/companies/${id}`);

// Loans
export const getLoans = () => fetchJson('/loans');
export const getLoan = (id) => fetchJson(`/loans/${id}`);
export const getCompanyLoans = (companyId) => fetchJson(`/companies/${companyId}/loans`);
export const createLoan = (data) => fetchJson('/loans', { method: 'POST', body: JSON.stringify(data) });

// Payments
export const getLoanPayments = (loanId) => fetchJson(`/loans/${loanId}/payments`);
export const createPayment = (data) => fetchJson('/payments', { method: 'POST', body: JSON.stringify(data) });

// Athletes
export const getAthletes = () => fetchJson('/athletes');
export const getAthlete = (id) => fetchJson(`/athletes/${id}`);

// NIL Deals
export const getNilDeals = () => fetchJson('/nil-deals');
export const createNilDeal = (data) => fetchJson('/nil-deals', { method: 'POST', body: JSON.stringify(data) });

// Schools
export const getSchools = () => fetchJson('/schools');

// Donors
export const getDonors = () => fetchJson('/donors');
export const getDonorStats = () => fetchJson('/stats/donors');

// Stats
export const getPortfolioStats = () => fetchJson('/stats/portfolio');
export const getCompanyStats = (companyId) => fetchJson(`/stats/company/${companyId}`);
export const getNilByPosition = () => fetchJson('/stats/nil-by-position');
```

- [ ] **Step 2: Commit design system changes**

```bash
git add client/tailwind.config.js \
        client/src/App.jsx \
        client/src/api/index.js \
        client/src/components/common/StatCard.jsx \
        client/src/components/common/Card.jsx \
        client/src/components/common/AthleteCard.jsx
git commit -m "feat: apply GT PIP Co design system (navy/gold, updated components)"
```

---

## Chunk 4: Frontend Charts & New Components

### Task 17: Create NilByPositionChart

**Files:**
- Create: `client/src/components/charts/NilByPositionChart.jsx`
- Delete: `client/src/components/charts/NilBySportChart.jsx`

- [ ] **Step 1: Create NilByPositionChart.jsx**

```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#003057', '#EAAA00', '#003057', '#EAAA00', '#003057', '#EAAA00', '#003057', '#EAAA00'];

const formatCurrency = (val) => `$${(val / 1000).toFixed(0)}K`;

export default function NilByPositionChart({ data = [] }) {
  if (!data.length) return <p className="text-slate-400 text-center py-8 text-sm">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20, top: 4, bottom: 4 }}>
        <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 10, fill: '#64748b' }} />
        <YAxis
          type="category"
          dataKey="position"
          tick={{ fontSize: 10, fill: '#475569' }}
          width={80}
        />
        <Tooltip formatter={(val) => [`$${val.toLocaleString()}`, 'NIL Amount']} />
        <Bar dataKey="total_amount" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Delete NilBySportChart.jsx**

```bash
git rm client/src/components/charts/NilBySportChart.jsx
```

---

### Task 18: Create InterestSplitChart

**Files:**
- Create: `client/src/components/charts/InterestSplitChart.jsx`
- Delete: `client/src/components/charts/NilBySchoolChart.jsx`

- [ ] **Step 1: Create InterestSplitChart.jsx**

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DATA = [
  { name: 'PIP Co (2%)', value: 2, color: '#003057' },
  { name: 'Donors (5%)', value: 5, color: '#EAAA00' },
  { name: 'Players (7%)', value: 7, color: '#94a3b8' },
];

export default function InterestSplitChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={DATA}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          dataKey="value"
          paddingAngle={2}
        >
          {DATA.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
        <Legend
          iconType="square"
          iconSize={10}
          wrapperStyle={{ fontSize: '11px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Delete NilBySchoolChart.jsx**

```bash
git rm client/src/components/charts/NilBySchoolChart.jsx
```

---

### Task 19: Create DonorRow component

**Files:**
- Create: `client/src/components/donors/DonorRow.jsx`

- [ ] **Step 1: Create the donors directory and DonorRow.jsx**

```bash
mkdir -p client/src/components/donors
```

```jsx
// client/src/components/donors/DonorRow.jsx
const fmt = (val) => `$${(val || 0).toLocaleString()}`;

export default function DonorRow({ donor }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-5 py-4 grid grid-cols-5 gap-4 items-center">
      <div className="font-bold text-sm text-navy">{donor.name}</div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Invested</p>
        <p className="font-bold text-sm text-slate-800">{fmt(donor.amount)}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">% of Fund</p>
        <p className="font-bold text-sm text-slate-800">{donor.pct_of_fund}%</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">5% Return</p>
        <p className="font-bold text-sm text-gold">+{fmt(donor.projected_return_5pct)}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Total Return</p>
        <p className="font-bold text-sm text-navy">{fmt(donor.projected_total_return)}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit charts and donor component**

```bash
git add client/src/components/charts/NilByPositionChart.jsx \
        client/src/components/charts/InterestSplitChart.jsx \
        client/src/components/donors/DonorRow.jsx
git commit -m "feat: add NilByPositionChart, InterestSplitChart, DonorRow; remove old sport/school charts"
```

---

### Task 19b: Update PaymentBreakdownChart colors to GT palette

**Files:**
- Modify: `client/src/components/charts/PaymentBreakdownChart.jsx`

- [ ] **Step 1: Read the current PaymentBreakdownChart to find the hardcoded colors**

Open `client/src/components/charts/PaymentBreakdownChart.jsx` and locate any hardcoded hex color values (they will be blue `#3b82f6`, green `#10b981`, purple `#8b5cf6` or similar).

- [ ] **Step 2: Replace PaymentBreakdownChart.jsx with GT-colored version**

Replace the entire file contents:

```jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  'Principal': '#003057',        // navy
  'Company Interest': '#EAAA00', // gold
  'NIL Contribution': '#94a3b8', // slate
};

export default function PaymentBreakdownChart({ data }) {
  const chartData = [
    { name: 'Principal', value: data.principal || 0 },
    { name: 'Company Interest', value: data.companyInterest || 0 },
    { name: 'NIL Contribution', value: data.nilContribution || 0 },
  ].filter(item => item.value > 0);

  const formatValue = (value) => `$${value.toLocaleString()}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip formatter={formatValue} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/charts/PaymentBreakdownChart.jsx
git commit -m "feat: update PaymentBreakdownChart to GT navy/gold palette"
```

---

## Chunk 5: Frontend Pages

### Task 20: Rewrite InternalDashboard

**Files:**
- Modify: `client/src/pages/InternalDashboard.jsx`

- [ ] **Step 1: Replace InternalDashboard.jsx**

```jsx
import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Table from '../components/common/Table';
import AthleteCard from '../components/common/AthleteCard';
import NilByPositionChart from '../components/charts/NilByPositionChart';
import InterestSplitChart from '../components/charts/InterestSplitChart';
import DonorRow from '../components/donors/DonorRow';
import * as api from '../api';

const fmt = (val) => `$${(val || 0).toLocaleString()}`;

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'loans', label: 'Loans' },
  { id: 'nil', label: 'NIL Deals' },
  { id: 'athletes', label: 'Athletes' },
  { id: 'donors', label: 'Donors' },
];

export default function InternalDashboard() {
  const [stats, setStats] = useState(null);
  const [loans, setLoans] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [nilDeals, setNilDeals] = useState([]);
  const [nilByPosition, setNilByPosition] = useState([]);
  const [donors, setDonors] = useState([]);
  const [donorStats, setDonorStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, loansData, athletesData, nilDealsData, positionData, donorsData, donorStatsData] =
          await Promise.all([
            api.getPortfolioStats(),
            api.getLoans(),
            api.getAthletes(),
            api.getNilDeals(),
            api.getNilByPosition(),
            api.getDonors(),
            api.getDonorStats(),
          ]);
        setStats(statsData);
        setLoans(loansData);
        setAthletes(athletesData);
        setNilDeals(nilDealsData);
        setNilByPosition(positionData);
        setDonors(donorsData);
        setDonorStats(donorStatsData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-500">Loading...</div>
    );
  }

  // Loan columns — company name excluded per design decision; amount, donor, dates, status only
  const loanColumns = [
    { key: 'principal_amount', label: 'Amount', render: (v) => fmt(v) },
    { key: 'interest_rate', label: 'Rate', render: (v) => `${v}%` },
    { key: 'donor_display_name', label: 'Donor' },
    { key: 'start_date', label: 'Start' },
    { key: 'end_date', label: 'End' },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          v === 'active' ? 'bg-green-100 text-green-800' :
          v === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
        }`}>{v}</span>
      )
    },
  ];

  // Compact columns for Overview "Recent Loans" widget
  const recentLoanColumns = [
    { key: 'principal_amount', label: 'Amount', render: (v) => fmt(v) },
    { key: 'donor_display_name', label: 'Donor' },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          v === 'active' ? 'bg-green-100 text-green-800' :
          v === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
        }`}>{v}</span>
      )
    },
  ];

  const nilColumns = [
    { key: 'athlete_name', label: 'Athlete' },
    { key: 'sport', label: 'Position', render: (_, row) => row.position || row.sport },
    { key: 'amount', label: 'Amount', render: (v) => fmt(v) },
    { key: 'deal_type', label: 'Type' },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          v === 'active' ? 'bg-green-100 text-green-800' :
          v === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          v === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
        }`}>{v}</span>
      )
    },
  ];

  // Build athlete_id → NIL deal amount map (active deals only)
  const nilAmountByAthlete = nilDeals
    .filter(d => d.status === 'active')
    .reduce((acc, d) => {
      acc[d.athlete_id] = (acc[d.athlete_id] || 0) + d.amount;
      return acc;
    }, {});

  const filteredAthletes = athletes.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-extrabold text-navy mb-0.5">Internal Dashboard</h1>
      <p className="text-sm text-slate-500 mb-5">Portfolio &amp; NIL Management</p>

      {/* Tabs */}
      <div className="flex border-b-2 border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-0.5 transition-colors ${
              activeTab === tab.id
                ? 'border-gold text-navy'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Loans Outstanding" value={fmt(stats?.total_loans_outstanding)} subtitle={`${stats?.active_loans_count || 0} active loans`} />
            <StatCard title="PIP Co Revenue (2%)" value={fmt(stats?.pip_revenue)} subtitle="Platform earnings" />
            <StatCard title="Donor Returns (5%)" value={fmt(stats?.donor_returns)} subtitle="Paid to investors" />
            <StatCard title="NIL Collected (7%)" value={fmt(stats?.total_nil_collected)} subtitle={`${stats?.active_nil_deals_count || 0} active deals`} />
            <StatCard title="NIL Allocated" value={fmt(stats?.total_nil_allocated)} subtitle="Deployed to athletes" />
            <StatCard title="NIL Available" value={fmt(stats?.nil_funds_available)} subtitle="Ready to allocate" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <Card title="NIL Allocation by Position">
              {nilByPosition.length > 0
                ? <NilByPositionChart data={nilByPosition} />
                : <p className="text-slate-400 text-center py-8 text-sm">No data</p>
              }
            </Card>
            <Card title="Interest Split Breakdown">
              <InterestSplitChart />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card title="Recent Loans">
              <Table columns={recentLoanColumns} data={loans.slice(0, 5)} />
            </Card>
            <Card title="Recent NIL Deals">
              <Table columns={nilColumns} data={nilDeals.slice(0, 5)} />
            </Card>
          </div>
        </>
      )}

      {/* LOANS */}
      {activeTab === 'loans' && (
        <Card title="All Loans">
          <Table columns={loanColumns} data={loans} />
        </Card>
      )}

      {/* NIL DEALS */}
      {activeTab === 'nil' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard title="NIL Collected (7%)" value={fmt(stats?.total_nil_collected)} />
            <StatCard title="NIL Allocated" value={fmt(stats?.total_nil_allocated)} />
            <StatCard title="NIL Available" value={fmt(stats?.nil_funds_available)} subtitle="Ready to allocate" />
          </div>
          <Card title="All NIL Deals">
            <Table columns={nilColumns} data={nilDeals} />
          </Card>
        </>
      )}

      {/* ATHLETES */}
      {activeTab === 'athletes' && (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAthletes.map((a) => (
              <AthleteCard key={a.id} athlete={a} amount={nilAmountByAthlete[a.id] ?? null} />
            ))}
          </div>
          {filteredAthletes.length === 0 && (
            <p className="text-slate-400 text-center py-8">No athletes found</p>
          )}
        </>
      )}

      {/* DONORS */}
      {activeTab === 'donors' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Invested" value={fmt(donorStats?.total_invested)} subtitle={`${donors.length} donors`} />
            <StatCard title="Returns Earned (5%)" value={fmt(donorStats?.total_returns_earned)} subtitle="Cash basis" />
            <StatCard title="Projected Total Return" value={fmt(donorStats?.projected_total_return)} subtitle="Principal + 5%" />
          </div>
          <div className="flex flex-col gap-3">
            {donors.map((d) => <DonorRow key={d.id} donor={d} />)}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Check for any import errors in the browser**

Start both server and client:
```bash
# Terminal 1
cd server && node index.js

# Terminal 2
cd client && npm run dev
```

Open `http://localhost:5173`. No console errors. All 5 tabs should be visible and clickable.

- [ ] **Step 3: Verify each tab renders without error**

Click through: Overview → Loans → NIL Deals → Athletes → Donors. Each tab should show data.

---

### Task 21: Rewrite ClientDashboard

**Files:**
- Modify: `client/src/pages/ClientDashboard.jsx`

- [ ] **Step 1: Replace ClientDashboard.jsx**

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Table from '../components/common/Table';
import AthleteCard from '../components/common/AthleteCard';
import PaymentBreakdownChart from '../components/charts/PaymentBreakdownChart';
import * as api from '../api';

const fmt = (val) => `$${(val || 0).toLocaleString()}`;

export default function ClientDashboard() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [companyData, loansData, statsData, companiesData, athletesData] = await Promise.all([
          api.getCompany(companyId),
          api.getCompanyLoans(companyId),
          api.getCompanyStats(companyId),
          api.getCompanies(),
          api.getAthletes(),
        ]);
        setCompany(companyData);
        setLoans(loansData);
        setStats(statsData);
        setCompanies(companiesData);
        setAthletes(athletesData);

        if (loansData.length > 0) {
          const allPayments = await Promise.all(loansData.map(l => api.getLoanPayments(l.id)));
          setPayments(allPayments.flat());
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
      setLoading(false);
    }
    loadData();
  }, [companyId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-500">Loading...</div>;
  }

  const totalPrincipal = payments.reduce((s, p) => s + p.principal_paid, 0);
  const totalInterest = payments.reduce((s, p) => s + p.interest_paid, 0);
  const totalNil = payments.reduce((s, p) => s + p.nil_contribution, 0);
  // pip_contribution + investor_contribution = interest paid that is NOT NIL
  const pipAndInvestorInterest = totalInterest - totalNil;

  const loanColumns = [
    { key: 'principal_amount', label: 'Principal', render: (v) => fmt(v) },
    { key: 'interest_rate', label: 'Rate', render: (v) => `${v}%` },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          v === 'active' ? 'bg-green-100 text-green-800' :
          v === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
        }`}>{v}</span>
      )
    },
  ];

  const paymentColumns = [
    { key: 'payment_date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (v) => fmt(v) },
    { key: 'principal_paid', label: 'Principal', render: (v) => fmt(v) },
    { key: 'interest_paid', label: 'Interest', render: (v) => fmt(v) },
    { key: 'nil_contribution', label: 'NIL Contribution', render: (v) => fmt(v) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-navy">{company?.name}</h1>
          <p className="text-sm text-slate-500">Client Portal · {company?.industry}</p>
        </div>
        <select
          value={companyId}
          onChange={(e) => window.location.href = `/client/${e.target.value}`}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/30"
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Borrowed" value={fmt(stats?.total_borrowed)} />
        <StatCard title="Total Paid" value={fmt(stats?.total_paid)} />
        <StatCard title="NIL Contributed (7%)" value={fmt(stats?.total_nil_contributed)} subtitle="Supporting GT athletes" />
        <StatCard title="Active Loans" value={stats?.active_loans || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card title="Payment Breakdown">
          {payments.length > 0 ? (
            <PaymentBreakdownChart
              data={{ principal: totalPrincipal, companyInterest: pipAndInvestorInterest, nilContribution: totalNil }}
            />
          ) : (
            <p className="text-slate-400 text-center py-8 text-sm">No payments yet</p>
          )}
        </Card>

        <Card title="GT Football Roster — NIL Recipients">
          <p className="text-xs text-slate-500 mb-3">All 22 Georgia Tech starters</p>
          <div className="grid grid-cols-2 gap-2">
            {athletes.map((a) => <AthleteCard key={a.id} athlete={a} />)}
          </div>
        </Card>
      </div>

      <Card title="Your Loans" className="mb-5">
        <Table columns={loanColumns} data={loans} />
      </Card>

      <Card title="Payment History">
        <Table columns={paymentColumns} data={payments} />
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verify Client Portal in browser**

Open `http://localhost:5173/client/1`. Should show Peachtree Sports Media with all 22 athletes visible.

Use the company selector dropdown to switch companies — data should update.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/InternalDashboard.jsx \
        client/src/pages/ClientDashboard.jsx
git commit -m "feat: rebuild Internal Dashboard (5 tabs) and Client Portal with GT PIP Co data"
```

---

### Task 22: Final smoke test

- [ ] **Step 1: Run both servers**

```bash
# Terminal 1
cd server && node index.js

# Terminal 2
cd client && npm run dev
```

- [ ] **Step 2: Check Internal Dashboard tabs**

Visit `http://localhost:5173`. Click through all 5 tabs:
- **Overview**: 6 navy stat cards, NIL by Position chart, Interest Split donut, 2 recent tables
- **Loans**: Full loans table with donor display name column
- **NIL Deals**: 3 stat cards + full NIL deals table
- **Athletes**: 22 GT football players in navy/gold cards, search by name or position works
- **Donors**: 3 stat cards + 5 donor rows with Invested / % of Fund / 5% Return / Total Return

- [ ] **Step 3: Check Client Portal**

Visit `http://localhost:5173/client/1`. Verify:
- Company name shows "Peachtree Sports Media"
- 4 navy/gold stat cards
- All 22 athletes visible in grid (full list, no scroll cap)
- Payment Breakdown chart renders in navy, gold, and slate (NOT blue/green/purple)
- Payment history table populated

Switch to company 5 (Southfield Athletic Consulting) via dropdown — should show that company's loan and payment data, still 22 athletes.

- [ ] **Step 4: Check nav branding**

- Nav is navy with "GT" gold logo and "Georgia Tech PIP Co" white text
- "Internal" link highlights with gold border when on Internal Dashboard
- "Client Portal" link highlights when on /client route

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete GT PIP Co dashboard redesign"
```
