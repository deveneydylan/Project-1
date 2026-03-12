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
('Jamal Williams', 'jamal.williams@gatech.edu', 1, 'Football', 'Defensive Tackle', 'defense', 92, 380000),
('Andre Robinson', 'a.robinson@gatech.edu', 1, 'Football', 'Defensive Tackle', 'defense', 95, 275000),
('Marcus Green', 'm.green@gatech.edu', 1, 'Football', 'Defensive End', 'defense', 88, 445000),
('Isaiah Davis', 'i.davis@gatech.edu', 1, 'Football', 'Middle Linebacker', 'defense', 54, 510000),
('Trevon Walker', 't.walker@gatech.edu', 1, 'Football', 'Outside Linebacker', 'defense', 51, 340000),
('DeAndre Smith', 'deandre.smith@gatech.edu', 1, 'Football', 'Outside Linebacker', 'defense', 48, 290000),
('Kevin Johnson', 'k.johnson@gatech.edu', 1, 'Football', 'Cornerback', 'defense', 23, 620000),
('Nathan Harris', 'n.harris@gatech.edu', 1, 'Football', 'Cornerback', 'defense', 31, 480000),
('Elijah Moore', 'e.moore@gatech.edu', 1, 'Football', 'Free Safety', 'defense', 20, 395000),
('Darren Washington', 'd.washington@gatech.edu', 1, 'Football', 'Strong Safety', 'defense', 36, 320000);

-- Loans (5 companies, 14% interest, 3-way split)
INSERT INTO loans (company_id, principal_amount, interest_rate, pip_portion, investor_portion, nil_portion, start_date, end_date, status) VALUES
(1, 2500000, 14.0, 2.0, 5.0, 7.0, '2024-01-15', '2026-01-15', 'active'),
(2, 1500000, 14.0, 2.0, 5.0, 7.0, '2024-02-01', '2026-02-01', 'active'),
(3, 3000000, 14.0, 2.0, 5.0, 7.0, '2024-03-10', '2026-03-10', 'active'),
(4, 5000000, 14.0, 2.0, 5.0, 7.0, '2024-04-01', '2026-04-01', 'active'),
(5, 8000000, 14.0, 2.0, 5.0, 7.0, '2024-05-15', '2026-05-15', 'active');

-- Donors (one per loan, GT high net-worth individuals)
INSERT INTO donors (name, email, loan_id, amount) VALUES
('Robert A. Griffin', 'rgriffin@gmail.com', 1, 2500000),
('James T. Crawford', 'jcrawford@crawfordventures.com', 2, 1500000),
('William H. Thompson', 'wthompson@thompsonindustries.com', 3, 3000000),
('Charles B. Morrison', 'cmorrison@morrisoncapital.com', 4, 5000000),
('Edward L. Harrison', 'eharrison@harrisongroup.com', 5, 8000000);

-- Payments (3-way split: nil = interest*(7/14), investor = interest*(5/14), pip = interest*(2/14))
-- Loan 1 (Peachtree Sports Media, principal 2500000)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(1, 58333, '2024-02-15', 29167, 29166, 14583, 4167, 10416),
(1, 58333, '2024-03-15', 29167, 29166, 14583, 4167, 10416),
(1, 58333, '2024-04-15', 29167, 29166, 14583, 4167, 10416);

-- Loan 2 (Victory Sports Management, principal 1500000)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(2, 35000, '2024-03-01', 17500, 17500, 8750, 2500, 6250),
(2, 35000, '2024-04-01', 17500, 17500, 8750, 2500, 6250),
(2, 35000, '2024-05-01', 17500, 17500, 8750, 2500, 6250);

-- Loan 3 (Atlanta Athlete Agency, principal 3000000)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(3, 70000, '2024-04-10', 35000, 35000, 17500, 5000, 12500),
(3, 70000, '2024-05-10', 35000, 35000, 17500, 5000, 12500),
(3, 70000, '2024-06-10', 35000, 35000, 17500, 5000, 12500);

-- Loan 4 (Yellow Jacket Sports Group, principal 5000000)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(4, 116667, '2024-05-01', 58333, 58334, 29167, 8333, 20834),
(4, 116667, '2024-06-01', 58333, 58334, 29167, 8333, 20834),
(4, 116667, '2024-07-01', 58333, 58334, 29167, 8333, 20834);

-- Loan 5 (Southfield Athletic Consulting, principal 8000000)
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution, pip_contribution, investor_contribution) VALUES
(5, 186667, '2024-06-15', 93333, 93334, 46667, 13333, 33334),
(5, 186667, '2024-07-15', 93333, 93334, 46667, 13333, 33334),
(5, 186667, '2024-08-15', 93333, 93334, 46667, 13333, 33334);

-- NIL Deals (14 active deals across various athletes)
INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
(1, 1, 150000, 'Endorsement', '2024-02-01', '2025-02-01', 'active'),
(2, 1, 75000, 'Social Media', '2024-02-01', '2025-02-01', 'active'),
(3, 2, 65000, 'Social Media', '2024-03-01', '2025-03-01', 'active'),
(4, 2, 120000, 'Endorsement', '2024-03-01', '2025-03-01', 'active'),
(6, 3, 85000, 'Appearance', '2024-04-01', '2025-04-01', 'active'),
(7, 3, 45000, 'Autograph', '2024-04-01', '2025-04-01', 'active'),
(12, 4, 200000, 'Endorsement', '2024-05-01', '2025-05-01', 'active'),
(13, 4, 80000, 'Social Media', '2024-05-01', '2025-05-01', 'active'),
(15, 4, 95000, 'Endorsement', '2024-05-01', '2025-05-01', 'active'),
(16, 5, 130000, 'Endorsement', '2024-06-01', '2025-06-01', 'active'),
(17, 5, 70000, 'Social Media', '2024-06-01', '2025-06-01', 'active'),
(19, 5, 90000, 'Appearance', '2024-06-01', '2025-06-01', 'active'),
(20, 5, 110000, 'Endorsement', '2024-06-01', '2025-06-01', 'active'),
(21, 5, 85000, 'Social Media', '2024-06-01', '2025-06-01', 'active');
