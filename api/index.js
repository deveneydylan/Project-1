import express from 'express';
import initSqlJs from 'sql.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Initialize in-memory DB from schema + seed on each cold start
const SQL = await initSqlJs();
const db = new SQL.Database();
const schema = readFileSync(join(__dirname, '../server/db/schema.sql'), 'utf-8');
const seed = readFileSync(join(__dirname, '../server/db/seed.sql'), 'utf-8');
db.run(schema);
db.run(seed);

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  return queryAll(sql, params)[0] || null;
}

// ============ COMPANIES ============
app.get('/api/companies', (req, res) => {
  res.json(queryAll('SELECT * FROM companies'));
});

app.get('/api/companies/:id', (req, res) => {
  const company = queryOne('SELECT * FROM companies WHERE id = ?', [req.params.id]);
  if (!company) return res.status(404).json({ error: 'Company not found' });
  res.json(company);
});

// ============ DONORS ============
app.get('/api/donors', (req, res) => {
  const total_invested = queryOne('SELECT COALESCE(SUM(amount), 0) as value FROM donors')?.value || 0;
  const donors = queryAll(`
    SELECT d.*,
      ROUND(d.amount / ? * 100, 1) as pct_of_fund,
      ROUND(d.amount * 0.05, 2) as projected_return_5pct,
      ROUND(d.amount * 1.05, 2) as projected_total_return,
      COALESCE((SELECT SUM(p.investor_contribution) FROM payments p WHERE p.loan_id = d.loan_id), 0) as returns_earned
    FROM donors d ORDER BY d.amount DESC
  `, [total_invested]);
  res.json(donors);
});

app.get('/api/stats/donors', (req, res) => {
  const total_invested = queryOne('SELECT COALESCE(SUM(amount), 0) as value FROM donors')?.value || 0;
  const total_returns_earned = queryOne('SELECT COALESCE(SUM(investor_contribution), 0) as value FROM payments')?.value || 0;
  res.json({ total_invested, total_returns_earned, projected_total_return: total_invested * 1.05 });
});

// ============ LOANS ============
app.get('/api/loans', (req, res) => {
  res.json(queryAll(`
    SELECT l.*, c.name as company_name, d.name as donor_name,
      SUBSTR(d.name, 1, 1) || '. ' || SUBSTR(d.name, INSTR(d.name, ' ') + 1) as donor_display_name
    FROM loans l
    JOIN companies c ON l.company_id = c.id
    LEFT JOIN donors d ON d.loan_id = l.id
    ORDER BY l.created_at DESC
  `));
});

app.get('/api/loans/:id', (req, res) => {
  const loan = queryOne(`
    SELECT l.*, c.name as company_name, d.name as donor_name,
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
  res.json(queryAll('SELECT * FROM loans WHERE company_id = ?', [req.params.id]));
});

// ============ PAYMENTS ============
app.get('/api/loans/:id/payments', (req, res) => {
  res.json(queryAll('SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date DESC', [req.params.id]));
});

// ============ ATHLETES ============
app.get('/api/athletes', (req, res) => {
  res.json(queryAll(`
    SELECT a.*, s.name as school_name, s.conference
    FROM athletes a JOIN schools s ON a.school_id = s.id ORDER BY a.name
  `));
});

app.get('/api/athletes/:id', (req, res) => {
  const athlete = queryOne(`
    SELECT a.*, s.name as school_name, s.conference
    FROM athletes a JOIN schools s ON a.school_id = s.id WHERE a.id = ?
  `, [req.params.id]);
  if (!athlete) return res.status(404).json({ error: 'Athlete not found' });
  res.json(athlete);
});

// ============ NIL DEALS ============
app.get('/api/nil-deals', (req, res) => {
  res.json(queryAll(`
    SELECT nd.*, a.name as athlete_name, a.sport, a.position, s.name as school_name
    FROM nil_deals nd
    JOIN athletes a ON nd.athlete_id = a.id
    JOIN schools s ON a.school_id = s.id
    ORDER BY nd.created_at DESC
  `));
});

// ============ SCHOOLS ============
app.get('/api/schools', (req, res) => {
  res.json(queryAll('SELECT * FROM schools ORDER BY name'));
});

// ============ DASHBOARD STATS ============
app.get('/api/stats/portfolio', (req, res) => {
  const total_nil_collected = queryOne('SELECT COALESCE(SUM(nil_contribution), 0) as value FROM payments')?.value || 0;
  const total_nil_allocated = queryOne("SELECT COALESCE(SUM(amount), 0) as value FROM nil_deals WHERE status = 'active'")?.value || 0;
  const stats = {
    total_loans_outstanding: queryOne("SELECT COALESCE(SUM(principal_amount), 0) as value FROM loans WHERE status = 'active'")?.value || 0,
    total_nil_collected,
    total_nil_allocated,
    pip_revenue: queryOne('SELECT COALESCE(SUM(pip_contribution), 0) as value FROM payments')?.value || 0,
    donor_returns: queryOne('SELECT COALESCE(SUM(investor_contribution), 0) as value FROM payments')?.value || 0,
    active_loans_count: queryOne("SELECT COUNT(*) as value FROM loans WHERE status = 'active'")?.value || 0,
    active_nil_deals_count: queryOne("SELECT COUNT(*) as value FROM nil_deals WHERE status = 'active'")?.value || 0,
    nil_funds_available: total_nil_collected - total_nil_allocated,
  };
  res.json(stats);
});

app.get('/api/stats/company/:id', (req, res) => {
  const companyId = req.params.id;
  const stats = {
    total_borrowed: queryOne('SELECT COALESCE(SUM(principal_amount), 0) as value FROM loans WHERE company_id = ?', [companyId])?.value || 0,
    total_paid: queryOne(`
      SELECT COALESCE(SUM(p.principal_paid + p.interest_paid), 0) as value
      FROM payments p JOIN loans l ON p.loan_id = l.id WHERE l.company_id = ?
    `, [companyId])?.value || 0,
    total_nil_contributed: queryOne(`
      SELECT COALESCE(SUM(p.nil_contribution), 0) as value
      FROM payments p JOIN loans l ON p.loan_id = l.id WHERE l.company_id = ?
    `, [companyId])?.value || 0,
    active_loans: queryOne("SELECT COUNT(*) as value FROM loans WHERE company_id = ? AND status = 'active'", [companyId])?.value || 0,
  };
  stats.athletes_funded = queryAll(`
    SELECT a.*, s.name as school_name FROM athletes a
    JOIN schools s ON a.school_id = s.id ORDER BY a.unit, a.jersey_number
  `);
  res.json(stats);
});

app.get('/api/stats/nil-by-position', (req, res) => {
  res.json(queryAll(`
    SELECT a.position, SUM(nd.amount) as total_amount, COUNT(DISTINCT a.id) as athlete_count
    FROM nil_deals nd JOIN athletes a ON nd.athlete_id = a.id
    WHERE nd.status = 'active' GROUP BY a.position ORDER BY total_amount DESC
  `));
});

export default app;
