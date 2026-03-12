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
    school_id INTEGER REFERENCES schools(id),
    sport TEXT NOT NULL,
    position TEXT,
    social_followers INTEGER DEFAULT 0,
    profile_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER REFERENCES companies(id),
    principal_amount REAL NOT NULL,
    interest_rate REAL NOT NULL DEFAULT 15.0,
    company_portion REAL NOT NULL DEFAULT 7.5,
    nil_portion REAL NOT NULL DEFAULT 7.5,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paid', 'defaulted')),
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_loans_company ON loans(company_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_payments_loan ON payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_athletes_school ON athletes(school_id);
CREATE INDEX IF NOT EXISTS idx_nil_deals_athlete ON nil_deals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_nil_deals_loan ON nil_deals(loan_id);
