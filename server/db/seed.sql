-- Georgia Tech
INSERT INTO schools (name, conference, state) VALUES
('Georgia Tech', 'ACC', 'GA');

-- Atlanta sports industry companies (5 borrowers)
INSERT INTO companies (name, contact_email, industry) VALUES
('Peachtree Sports Media',          'contact@peachtreesportsmedia.com',  'Sports Media'),
('Victory Sports Management',       'finance@victorysportsmgmt.com',     'Sports Management'),
('Atlanta Athlete Agency',          'info@atlantaathlete.com',           'Sports Agency'),
('Yellow Jacket Sports Group',      'ops@yellowjacketsports.com',        'Sports Group'),
('Southfield Athletic Consulting',  'admin@southfieldathletic.com',      'Sports Consulting');

-- ─── GT Football Athletes ────────────────────────────────────────────────────

-- Offense (11 players)
INSERT INTO athletes (name, email, school_id, sport, position, unit, jersey_number, social_followers) VALUES
('Marcus Williams',    'm.williams@gatech.edu',   1, 'Football', 'Quarterback',    'offense', 12, 850000),
('Jordan Hayes',       'j.hayes@gatech.edu',      1, 'Football', 'Wide Receiver',  'offense', 80, 420000),
('Devon Harris',       'd.harris@gatech.edu',     1, 'Football', 'Wide Receiver',  'offense', 11, 310000),
('Tyler Brooks',       't.brooks@gatech.edu',     1, 'Football', 'Running Back',   'offense', 28, 680000),
('Cameron Foster',     'c.foster@gatech.edu',     1, 'Football', 'Fullback',       'offense', 44, 195000),
('Ryan Mitchell',      'r.mitchell@gatech.edu',   1, 'Football', 'Tight End',      'offense', 85, 290000),
('DeShawn Lee',        'd.lee@gatech.edu',        1, 'Football', 'Left Tackle',    'offense', 72, 145000),
('Malik Johnson',      'm.johnson@gatech.edu',    1, 'Football', 'Left Guard',     'offense', 67, 120000),
('Chris Anderson',     'c.anderson@gatech.edu',   1, 'Football', 'Center',         'offense', 55, 135000),
('Brandon Thomas',     'b.thomas@gatech.edu',     1, 'Football', 'Right Guard',    'offense', 64, 110000),
('Darius Thompson',    'd.thompson@gatech.edu',   1, 'Football', 'Right Tackle',   'offense', 75, 130000);

-- Defense (11 players)
INSERT INTO athletes (name, email, school_id, sport, position, unit, jersey_number, social_followers) VALUES
('Deon Carter',        'deon.carter@gatech.edu',    1, 'Football', 'Defensive End',       'defense', 90, 920000),
('Jamal Williams',     'jamal.williams@gatech.edu', 1, 'Football', 'Defensive Tackle',    'defense', 92, 380000),
('Andre Robinson',     'a.robinson@gatech.edu',     1, 'Football', 'Defensive Tackle',    'defense', 95, 275000),
('Marcus Green',       'm.green@gatech.edu',        1, 'Football', 'Defensive End',       'defense', 88, 445000),
('Isaiah Davis',       'i.davis@gatech.edu',        1, 'Football', 'Middle Linebacker',   'defense', 54, 510000),
('Trevon Walker',      't.walker@gatech.edu',       1, 'Football', 'Outside Linebacker',  'defense', 51, 340000),
('DeAndre Smith',      'deandre.smith@gatech.edu',  1, 'Football', 'Outside Linebacker',  'defense', 48, 290000),
('Kevin Johnson',      'k.johnson@gatech.edu',      1, 'Football', 'Cornerback',          'defense', 23, 620000),
('Nathan Harris',      'n.harris@gatech.edu',       1, 'Football', 'Cornerback',          'defense', 31, 480000),
('Elijah Moore',       'e.moore@gatech.edu',        1, 'Football', 'Free Safety',         'defense', 20, 395000),
('Darren Washington',  'd.washington@gatech.edu',   1, 'Football', 'Strong Safety',       'defense', 36, 320000);

-- ─── Loans: 25 total = $50,000,000 (5 per company) ──────────────────────────
-- All active, 14% annual rate, 2-year terms staggered through 2024

-- Company 1: Peachtree Sports Media ($10,000,000)
INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status) VALUES
(1, 4000000, 14.0, 2.0, 5.0, 7.0, '2024-01-15', '2026-01-15', 'active'),
(1, 2500000, 14.0, 2.0, 5.0, 7.0, '2024-02-01', '2026-02-01', 'active'),
(1, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-03-10', '2026-03-10', 'active'),
(1,  750000, 14.0, 2.0, 5.0, 7.0, '2024-01-20', '2026-01-20', 'active'),
(1, 1250000, 14.0, 2.0, 5.0, 7.0, '2024-02-15', '2026-02-15', 'active');

-- Company 2: Victory Sports Management ($10,000,000)
INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status) VALUES
(2, 3500000, 14.0, 2.0, 5.0, 7.0, '2024-01-10', '2026-01-10', 'active'),
(2, 2000000, 14.0, 2.0, 5.0, 7.0, '2024-02-20', '2026-02-20', 'active'),
(2, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-03-05', '2026-03-05', 'active'),
(2, 2000000, 14.0, 2.0, 5.0, 7.0, '2024-04-01', '2026-04-01', 'active'),
(2, 1000000, 14.0, 2.0, 5.0, 7.0, '2024-05-15', '2026-05-15', 'active');

-- Company 3: Atlanta Athlete Agency ($10,000,000)
INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status) VALUES
(3, 4500000, 14.0, 2.0, 5.0, 7.0, '2024-01-05', '2026-01-05', 'active'),
(3, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-02-10', '2026-02-10', 'active'),
(3, 2000000, 14.0, 2.0, 5.0, 7.0, '2024-03-15', '2026-03-15', 'active'),
(3,  750000, 14.0, 2.0, 5.0, 7.0, '2024-04-10', '2026-04-10', 'active'),
(3, 1250000, 14.0, 2.0, 5.0, 7.0, '2024-05-20', '2026-05-20', 'active');

-- Company 4: Yellow Jacket Sports Group ($10,000,000)
INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status) VALUES
(4, 3000000, 14.0, 2.0, 5.0, 7.0, '2024-01-25', '2026-01-25', 'active'),
(4, 2500000, 14.0, 2.0, 5.0, 7.0, '2024-02-28', '2026-02-28', 'active'),
(4, 1000000, 14.0, 2.0, 5.0, 7.0, '2024-03-20', '2026-03-20', 'active'),
(4, 2000000, 14.0, 2.0, 5.0, 7.0, '2024-04-15', '2026-04-15', 'active'),
(4, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-05-10', '2026-05-10', 'active');

-- Company 5: Southfield Athletic Consulting ($10,000,000)
INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status) VALUES
(5, 2500000, 14.0, 2.0, 5.0, 7.0, '2024-01-30', '2026-01-30', 'active'),
(5, 3000000, 14.0, 2.0, 5.0, 7.0, '2024-02-25', '2026-02-25', 'active'),
(5, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-03-25', '2026-03-25', 'active'),
(5, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-04-20', '2026-04-20', 'active'),
(5, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-05-05', '2026-05-05', 'active');

-- ─── Donors: 25 GT high-net-worth alumni, one per loan ───────────────────────
-- Each donor amount matches their loan principal
INSERT INTO donors (name, email, loan_id, amount) VALUES
('Robert A. Griffin',      'rgriffin@griffincapital.com',       1,  4000000),
('James T. Crawford',      'jcrawford@crawfordventures.com',     2,  2500000),
('William H. Thompson',    'wthompson@thompsonindustries.com',   3,  1500000),
('Charles B. Morrison',    'cmorrison@morrisoncapital.com',      4,   750000),
('Edward L. Harrison',     'eharrison@harrisongroup.com',        5,  1250000),
('Thomas R. Blackwell',    'tblackwell@blackwellpartners.com',   6,  3500000),
('George W. Patterson',    'gpatterson@pattersonllc.com',        7,  2000000),
('David H. Sutton',        'dsutton@suttonadvisors.com',         8,  1500000),
('Michael B. Caldwell',    'mcaldwell@caldwellfund.com',         9,  2000000),
('Richard S. Eaton',       'reaton@eatonwm.com',                10,  1000000),
('Joseph F. Whitfield',    'jwhitfield@whitfieldco.com',        11,  4500000),
('Henry C. Burgess',       'hburgess@burgessrealty.com',        12,  1500000),
('Frank M. Holloway',      'fholloway@hollowayprivate.com',     13,  2000000),
('Paul T. Breckenridge',   'pbreckenridge@breckenridgecap.com', 14,   750000),
('Samuel K. Montgomery',   'smontgomery@montgomeryfam.com',     15,  1250000),
('Arthur L. Pemberton',    'apemberton@pembertoninvest.com',    16,  3000000),
('Eugene R. Waverly',      'ewaverly@waverlygroup.com',         17,  2500000),
('Louis D. Ashworth',      'lashworth@ashworthcapital.com',     18,  1000000),
('Gerald F. Kingsley',     'gkingsley@kingsleyasset.com',       19,  2000000),
('Howard N. Stanton',      'hstanton@stantonholdings.com',      20,  1500000),
('Walter B. Prescott',     'wprescott@prescottpartners.com',    21,  2500000),
('Kenneth A. Forsythe',    'kforsythe@forsythefund.com',        22,  3000000),
('Raymond J. Barlow',      'rbarlow@barlowequity.com',          23,  1500000),
('Stephen C. Dunmore',     'sdunmore@dunmoreinvest.com',        24,  1500000),
('Harold G. Whitmore',     'hwhitmore@whitmorecap.com',         25,  1500000);

-- ─── Payments: 2 semi-annual payments per loan ───────────────────────────────
-- Semi-annual interest = principal × 7%  (14% annual)
-- Principal repaid = principal × 50% per payment → 2 payments = 100% principal back
-- Total paid per loan = principal × 114%  (100% principal + 14% interest)
-- Split: nil=3.5%, investor=2.5%, pip=1.0% of principal per payment
-- Total NIL collected = $50M × 7% = $3,500,000 (matches NIL deals → available = $0)

-- Loan 1  P=4,000,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(1, 2280000, '2024-07-15', 2000000, 280000, 140000, 40000, 100000),
(1, 2280000, '2025-01-15', 2000000, 280000, 140000, 40000, 100000);

-- Loan 2  P=2,500,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(2, 1425000, '2024-08-01', 1250000, 175000, 87500, 25000, 62500),
(2, 1425000, '2025-02-01', 1250000, 175000, 87500, 25000, 62500);

-- Loan 3  P=1,500,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(3, 855000, '2024-09-10', 750000, 105000, 52500, 15000, 37500),
(3, 855000, '2025-03-10', 750000, 105000, 52500, 15000, 37500);

-- Loan 4  P=750,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(4, 427500, '2024-07-20', 375000, 52500, 26250, 7500, 18750),
(4, 427500, '2025-01-20', 375000, 52500, 26250, 7500, 18750);

-- Loan 5  P=1,250,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(5, 712500, '2024-08-15', 625000, 87500, 43750, 12500, 31250),
(5, 712500, '2025-02-15', 625000, 87500, 43750, 12500, 31250);

-- Loan 6  P=3,500,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(6, 1995000, '2024-07-10', 1750000, 245000, 122500, 35000, 87500),
(6, 1995000, '2025-01-10', 1750000, 245000, 122500, 35000, 87500);

-- Loan 7  P=2,000,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(7, 1140000, '2024-08-20', 1000000, 140000, 70000, 20000, 50000),
(7, 1140000, '2025-02-20', 1000000, 140000, 70000, 20000, 50000);

-- Loan 8  P=1,500,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(8, 855000, '2024-09-05', 750000, 105000, 52500, 15000, 37500),
(8, 855000, '2025-03-05', 750000, 105000, 52500, 15000, 37500);

-- Loan 9  P=2,000,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(9, 1140000, '2024-10-01', 1000000, 140000, 70000, 20000, 50000),
(9, 1140000, '2025-04-01', 1000000, 140000, 70000, 20000, 50000);

-- Loan 10  P=1,000,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(10, 570000, '2024-11-15', 500000, 70000, 35000, 10000, 25000),
(10, 570000, '2025-05-15', 500000, 70000, 35000, 10000, 25000);

-- Loan 11  P=4,500,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(11, 2565000, '2024-07-05', 2250000, 315000, 157500, 45000, 112500),
(11, 2565000, '2025-01-05', 2250000, 315000, 157500, 45000, 112500);

-- Loan 12  P=1,500,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(12, 855000, '2024-08-10', 750000, 105000, 52500, 15000, 37500),
(12, 855000, '2025-02-10', 750000, 105000, 52500, 15000, 37500);

-- Loan 13  P=2,000,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(13, 1140000, '2024-09-15', 1000000, 140000, 70000, 20000, 50000),
(13, 1140000, '2025-03-15', 1000000, 140000, 70000, 20000, 50000);

-- Loan 14  P=750,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(14, 427500, '2024-10-10', 375000, 52500, 26250, 7500, 18750),
(14, 427500, '2025-04-10', 375000, 52500, 26250, 7500, 18750);

-- Loan 15  P=1,250,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(15, 712500, '2024-11-20', 625000, 87500, 43750, 12500, 31250),
(15, 712500, '2025-05-20', 625000, 87500, 43750, 12500, 31250);

-- Loan 16  P=3,000,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(16, 1710000, '2024-07-25', 1500000, 210000, 105000, 30000, 75000),
(16, 1710000, '2025-01-25', 1500000, 210000, 105000, 30000, 75000);

-- Loan 17  P=2,500,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(17, 1425000, '2024-08-28', 1250000, 175000, 87500, 25000, 62500),
(17, 1425000, '2025-02-28', 1250000, 175000, 87500, 25000, 62500);

-- Loan 18  P=1,000,000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(18, 570000, '2024-09-20', 500000, 70000, 35000, 10000, 25000),
(18, 570000, '2025-03-20', 500000, 70000, 35000, 10000, 25000);

-- Loan 19  P=2,000,000 | nil/pmt=70000 | inv/pmt=50000 | pip/pmt=20000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(19, 1140000, '2024-10-15', 1000000, 140000, 70000, 20000, 50000),
(19, 1140000, '2025-04-15', 1000000, 140000, 70000, 20000, 50000);

-- Loan 20  P=1,500,000 | nil/pmt=52500 | inv/pmt=37500 | pip/pmt=15000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(20, 855000, '2024-11-10', 750000, 105000, 52500, 15000, 37500),
(20, 855000, '2025-05-10', 750000, 105000, 52500, 15000, 37500);

-- Loan 21  P=2,500,000 | nil/pmt=87500 | inv/pmt=62500 | pip/pmt=25000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(21, 1425000, '2024-07-30', 1250000, 175000, 87500, 25000, 62500),
(21, 1425000, '2025-01-30', 1250000, 175000, 87500, 25000, 62500);

-- Loan 22  P=3,000,000 | nil/pmt=105000 | inv/pmt=75000 | pip/pmt=30000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(22, 1710000, '2024-08-25', 1500000, 210000, 105000, 30000, 75000),
(22, 1710000, '2025-02-25', 1500000, 210000, 105000, 30000, 75000);

-- Loan 23  P=1,500,000 | nil/pmt=52500 | inv/pmt=37500 | pip/pmt=15000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(23, 855000, '2024-09-25', 750000, 105000, 52500, 15000, 37500),
(23, 855000, '2025-03-25', 750000, 105000, 52500, 15000, 37500);

-- Loan 24  P=1,500,000 | nil/pmt=52500 | inv/pmt=37500 | pip/pmt=15000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(24, 855000, '2024-10-20', 750000, 105000, 52500, 15000, 37500),
(24, 855000, '2025-04-20', 750000, 105000, 52500, 15000, 37500);

-- Loan 25  P=1,500,000 | nil/pmt=52500 | inv/pmt=37500 | pip/pmt=15000
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(25, 855000, '2024-11-05', 750000, 105000, 52500, 15000, 37500),
(25, 855000, '2025-05-05', 750000, 105000, 52500, 15000, 37500);

-- ─── NIL Deals: 22 athletes, all active, total = $3,500,000 ─────────────────
-- Tier 1 — $320,000: QB, star RB, star DE, star CB (high-profile, high followers)
-- Tier 2 — $200,000: WR×2, star defensive end, MLB
-- Tier 3 — $130,000: TE, DT×2, OLB, CB, FS  (solid contributors)
-- Tier 4 —  $80,000: FB, OL×5, OLB, SS       (depth/linemen)
-- Total: 4×320K + 4×200K + 6×130K + 8×80K = 1,280K+800K+780K+640K = $3,500,000

INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
-- Tier 1: $320,000
(1,  1, 320000, 'Endorsement',   '2024-02-01', '2025-02-01', 'active'),  -- Marcus Williams QB
(4,  4, 320000, 'Endorsement',   '2024-02-01', '2025-02-01', 'active'),  -- Tyler Brooks RB
(12, 6, 320000, 'Endorsement',   '2024-02-01', '2025-02-01', 'active'),  -- Deon Carter DE
(19,19, 320000, 'Endorsement',   '2024-05-01', '2025-05-01', 'active'),  -- Kevin Johnson CB
-- Tier 2: $200,000
(2,  2, 200000, 'Social Media',  '2024-02-01', '2025-02-01', 'active'),  -- Jordan Hayes WR
(3,  3, 200000, 'Social Media',  '2024-03-01', '2025-03-01', 'active'),  -- Devon Harris WR
(15, 8, 200000, 'Endorsement',   '2024-04-01', '2025-04-01', 'active'),  -- Marcus Green DE
(16,16, 200000, 'Endorsement',   '2024-02-01', '2025-02-01', 'active'),  -- Isaiah Davis MLB
-- Tier 3: $130,000
(6,  6, 130000, 'Appearance',    '2024-02-01', '2025-02-01', 'active'),  -- Ryan Mitchell TE
(13, 7, 130000, 'Appearance',    '2024-03-01', '2025-03-01', 'active'),  -- Jamal Williams DT
(14,13, 130000, 'Appearance',    '2024-04-01', '2025-04-01', 'active'),  -- Andre Robinson DT
(17,17, 130000, 'Social Media',  '2024-03-01', '2025-03-01', 'active'),  -- Trevon Walker OLB
(20,20, 130000, 'Appearance',    '2024-06-01', '2025-06-01', 'active'),  -- Nathan Harris CB
(21,21, 130000, 'Appearance',    '2024-02-01', '2025-02-01', 'active'),  -- Elijah Moore FS
-- Tier 4: $80,000
(5,  5,  80000, 'Autograph',     '2024-03-01', '2025-03-01', 'active'),  -- Cameron Foster FB
(7,  7,  80000, 'Autograph',     '2024-03-01', '2025-03-01', 'active'),  -- DeShawn Lee LT
(8,  8,  80000, 'Autograph',     '2024-04-01', '2025-04-01', 'active'),  -- Malik Johnson LG
(9,  9,  80000, 'Autograph',     '2024-05-01', '2025-05-01', 'active'),  -- Chris Anderson C
(10,10,  80000, 'Autograph',     '2024-06-01', '2025-06-01', 'active'),  -- Brandon Thomas RG
(11,11,  80000, 'Autograph',     '2024-02-01', '2025-02-01', 'active'),  -- Darius Thompson RT
(18,18,  80000, 'Social Media',  '2024-04-01', '2025-04-01', 'active'),  -- DeAndre Smith OLB
(22,22,  80000, 'Social Media',  '2024-03-01', '2025-03-01', 'active');  -- Darren Washington SS
