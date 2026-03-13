import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = join(__dirname, 'db', 'nil_lending.db');

// Initialize SQL.js and database
let db;
const SQL = await initSqlJs();

if (existsSync(dbPath)) {
  const buffer = readFileSync(dbPath);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
  // Initialize schema and seed data
  const schema = readFileSync(join(__dirname, 'db', 'schema.sql'), 'utf-8');
  const seed = readFileSync(join(__dirname, 'db', 'seed.sql'), 'utf-8');
  db.run(schema);
  db.run(seed);
  saveDb();
  console.log('Database initialized with schema and seed data');
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
}

// Helper to run queries and return results as array of objects
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function runSql(sql, params = []) {
  db.run(sql, params);
  saveDb();
  return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] };
}

// ============ COMPANIES ============
app.get('/api/companies', (req, res) => {
  const companies = queryAll('SELECT * FROM companies');
  res.json(companies);
});

app.get('/api/companies/:id', (req, res) => {
  const company = queryOne('SELECT * FROM companies WHERE id = ?', [req.params.id]);
  if (!company) return res.status(404).json({ error: 'Company not found' });
  res.json(company);
});

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

// ============ LOANS ============
app.get('/api/loans', (req, res) => {
  const loans = queryAll(`
    SELECT l.*,
      c.name as company_name,
      d.name as donor_name,
      SUBSTR(d.name, 1, 1) || '. ' || SUBSTR(d.name, INSTR(d.name, ' ') + 1) as donor_display_name
    FROM loans l
    JOIN companies c ON l.company_id = c.id
    LEFT JOIN donors d ON d.loan_id = l.id
    ORDER BY l.created_at DESC
  `);
  res.json(loans);
});

app.get('/api/loans/:id', (req, res) => {
  const loan = queryOne(`
    SELECT l.*,
      c.name as company_name,
      d.name as donor_name,
      SUBSTR(d.name, 1, 1) || '. ' || SUBSTR(d.name, INSTR(d.name, ' ') + 1) as donor_display_name
    FROM loans l
    JOIN companies c ON l.company_id = c.id
    LEFT JOIN donors d ON d.loan_id = l.id
    WHERE l.id = ?
  `, [req.params.id]);
  if (!loan) return res.status(404).json({ error: 'Loan not found' });
  res.json(loan);
});

app.get('/api/companies/:id/loans', (req, res) => {
  const loans = queryAll(`
    SELECT * FROM loans WHERE company_id = ?
  `, [req.params.id]);
  res.json(loans);
});

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

// ============ PAYMENTS ============
app.get('/api/loans/:id/payments', (req, res) => {
  const payments = queryAll(`
    SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date DESC
  `, [req.params.id]);
  res.json(payments);
});

app.post('/api/payments', (req, res) => {
  const { loan_id, amount, payment_date, principal_paid } = req.body;
  const interest_paid = amount - principal_paid;

  // 3-way split: nil=7/14, investor=5/14, pip=2/14
  const nil_contribution = interest_paid * (7 / 14);
  const investor_contribution = interest_paid * (5 / 14);
  const pip_contribution = interest_paid * (2 / 14);

  const result = runSql(`
    INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution]);

  res.json({ id: result.lastInsertRowid });
});

// ============ ATHLETES ============
app.get('/api/athletes', (req, res) => {
  const athletes = queryAll(`
    SELECT a.*, s.name as school_name, s.conference
    FROM athletes a
    JOIN schools s ON a.school_id = s.id
    ORDER BY a.name
  `);
  res.json(athletes);
});

app.get('/api/athletes/:id', (req, res) => {
  const athlete = queryOne(`
    SELECT a.*, s.name as school_name, s.conference
    FROM athletes a
    JOIN schools s ON a.school_id = s.id
    WHERE a.id = ?
  `, [req.params.id]);
  if (!athlete) return res.status(404).json({ error: 'Athlete not found' });
  res.json(athlete);
});

// ============ NIL DEALS ============
app.get('/api/nil-deals', (req, res) => {
  const deals = queryAll(`
    SELECT nd.*, a.name as athlete_name, a.sport, a.position, s.name as school_name
    FROM nil_deals nd
    JOIN athletes a ON nd.athlete_id = a.id
    JOIN schools s ON a.school_id = s.id
    ORDER BY nd.created_at DESC
  `);
  res.json(deals);
});

app.get('/api/nil-deals/:id', (req, res) => {
  const deal = queryOne(`
    SELECT nd.*, a.name as athlete_name, a.sport, s.name as school_name
    FROM nil_deals nd
    JOIN athletes a ON nd.athlete_id = a.id
    JOIN schools s ON a.school_id = s.id
    WHERE nd.id = ?
  `, [req.params.id]);
  if (!deal) return res.status(404).json({ error: 'NIL deal not found' });
  res.json(deal);
});

app.post('/api/nil-deals', (req, res) => {
  const { athlete_id, loan_id, amount, deal_type, start_date, end_date } = req.body;

  const result = runSql(`
    INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `, [athlete_id, loan_id || null, amount, deal_type, start_date, end_date]);

  res.json({ id: result.lastInsertRowid });
});

// ============ SCHOOLS ============
app.get('/api/schools', (req, res) => {
  const schools = queryAll('SELECT * FROM schools ORDER BY name');
  res.json(schools);
});

// ============ DASHBOARD STATS ============
app.get('/api/stats/portfolio', (req, res) => {
  const stats = {
    total_loans_outstanding: queryOne(`
      SELECT COALESCE(SUM(principal_amount), 0) as value FROM loans WHERE status = 'active'
    `)?.value || 0,

    total_nil_collected: queryOne(`
      SELECT COALESCE(SUM(nil_contribution), 0) as value FROM payments
    `)?.value || 0,

    total_nil_allocated: queryOne(`
      SELECT COALESCE(SUM(amount), 0) as value FROM nil_deals WHERE status = 'active'
    `)?.value || 0,

    pip_revenue: queryOne(`
      SELECT COALESCE(SUM(pip_contribution), 0) as value FROM payments
    `)?.value || 0,

    donor_returns: queryOne(`
      SELECT COALESCE(SUM(investor_contribution), 0) as value FROM payments
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

app.get('/api/stats/company/:id', (req, res) => {
  const companyId = req.params.id;

  const stats = {
    total_borrowed: queryOne(`
      SELECT COALESCE(SUM(principal_amount), 0) as value FROM loans WHERE company_id = ?
    `, [companyId])?.value || 0,

    total_paid: queryOne(`
      SELECT COALESCE(SUM(p.principal_paid + p.interest_paid), 0) as value
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
