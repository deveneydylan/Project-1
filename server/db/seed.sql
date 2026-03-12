-- Sample Schools
INSERT INTO schools (name, conference, state) VALUES
('University of Texas', 'SEC', 'TX'),
('Ohio State University', 'Big Ten', 'OH'),
('University of Alabama', 'SEC', 'AL'),
('USC', 'Big Ten', 'CA'),
('University of Georgia', 'SEC', 'GA'),
('University of Michigan', 'Big Ten', 'MI'),
('LSU', 'SEC', 'LA'),
('Clemson University', 'ACC', 'SC');

-- Sample Companies (Borrowers)
INSERT INTO companies (name, contact_email, industry) VALUES
('TechStart Innovations', 'finance@techstart.io', 'Technology'),
('GreenField Agriculture', 'loans@greenfield.com', 'Agriculture'),
('Metro Construction Group', 'accounting@metroconstruction.com', 'Construction'),
('Coastal Hospitality Inc', 'cfo@coastalhospitality.com', 'Hospitality'),
('Summit Healthcare Partners', 'finance@summithealthcare.org', 'Healthcare');

-- Sample Athletes
INSERT INTO athletes (name, school_id, sport, position, social_followers, profile_image_url) VALUES
('Marcus Williams', 1, 'Football', 'Quarterback', 850000, 'https://ui-avatars.com/api/?name=Marcus+Williams&background=bf5700&color=fff'),
('Jordan Chen', 2, 'Football', 'Wide Receiver', 420000, 'https://ui-avatars.com/api/?name=Jordan+Chen&background=bb0000&color=fff'),
('Aaliyah Johnson', 3, 'Basketball', 'Point Guard', 1200000, 'https://ui-avatars.com/api/?name=Aaliyah+Johnson&background=9e1b32&color=fff'),
('Tyler Brooks', 4, 'Football', 'Running Back', 680000, 'https://ui-avatars.com/api/?name=Tyler+Brooks&background=990000&color=fff'),
('Maya Rodriguez', 5, 'Volleyball', 'Outside Hitter', 320000, 'https://ui-avatars.com/api/?name=Maya+Rodriguez&background=ba0c2f&color=fff'),
('Deshawn Mitchell', 6, 'Basketball', 'Center', 550000, 'https://ui-avatars.com/api/?name=Deshawn+Mitchell&background=00274c&color=fff'),
('Emma Thompson', 1, 'Soccer', 'Forward', 280000, 'https://ui-avatars.com/api/?name=Emma+Thompson&background=bf5700&color=fff'),
('Jamal Carter', 7, 'Football', 'Linebacker', 920000, 'https://ui-avatars.com/api/?name=Jamal+Carter&background=461d7c&color=fff'),
('Sofia Martinez', 8, 'Softball', 'Pitcher', 185000, 'https://ui-avatars.com/api/?name=Sofia+Martinez&background=f56600&color=fff'),
('Chris Anderson', 2, 'Basketball', 'Shooting Guard', 340000, 'https://ui-avatars.com/api/?name=Chris+Anderson&background=bb0000&color=fff'),
('Brittany Lewis', 4, 'Track & Field', 'Sprinter', 410000, 'https://ui-avatars.com/api/?name=Brittany+Lewis&background=990000&color=fff'),
('Derek Washington', 3, 'Football', 'Tight End', 290000, 'https://ui-avatars.com/api/?name=Derek+Washington&background=9e1b32&color=fff');

-- Sample Loans
INSERT INTO loans (company_id, principal_amount, interest_rate, company_portion, nil_portion, start_date, end_date, status) VALUES
(1, 10000000, 15.0, 7.5, 7.5, '2025-01-15', '2025-12-15', 'active'),
(2, 5000000, 15.0, 7.5, 7.5, '2025-02-01', '2025-10-01', 'active'),
(3, 15000000, 15.0, 7.5, 7.5, '2024-11-01', '2025-08-01', 'active'),
(4, 3000000, 15.0, 7.5, 7.5, '2025-03-01', '2025-12-01', 'active'),
(5, 8000000, 15.0, 7.5, 7.5, '2024-09-15', '2025-06-15', 'active');

-- Sample Payments
INSERT INTO payments (loan_id, amount, payment_date, principal_paid, interest_paid, nil_contribution) VALUES
-- TechStart Innovations payments
(1, 250000, '2025-02-15', 0, 250000, 125000),
(1, 250000, '2025-03-15', 0, 250000, 125000),
(1, 500000, '2025-04-15', 250000, 250000, 125000),

-- GreenField Agriculture payments
(2, 125000, '2025-03-01', 0, 125000, 62500),
(2, 125000, '2025-04-01', 0, 125000, 62500),

-- Metro Construction payments
(3, 375000, '2024-12-01', 0, 375000, 187500),
(3, 375000, '2025-01-01', 0, 375000, 187500),
(3, 500000, '2025-02-01', 125000, 375000, 187500),
(3, 500000, '2025-03-01', 125000, 375000, 187500),

-- Coastal Hospitality payments
(4, 75000, '2025-04-01', 0, 75000, 37500),

-- Summit Healthcare payments
(5, 200000, '2024-10-15', 0, 200000, 100000),
(5, 200000, '2024-11-15', 0, 200000, 100000),
(5, 200000, '2024-12-15', 0, 200000, 100000),
(5, 300000, '2025-01-15', 100000, 200000, 100000),
(5, 300000, '2025-02-15', 100000, 200000, 100000);

-- Sample NIL Deals (linked to loans that funded them)
INSERT INTO nil_deals (athlete_id, loan_id, amount, deal_type, start_date, end_date, status) VALUES
-- Funded by TechStart loan
(1, 1, 150000, 'Social Media Campaign', '2025-03-01', '2025-06-01', 'active'),
(7, 1, 50000, 'Brand Ambassador', '2025-03-15', '2025-09-15', 'active'),

-- Funded by GreenField loan
(5, 2, 75000, 'Local Appearance', '2025-04-01', '2025-07-01', 'active'),
(9, 2, 40000, 'Social Media Campaign', '2025-04-15', '2025-08-15', 'active'),

-- Funded by Metro Construction loan
(8, 3, 200000, 'Brand Ambassador', '2025-01-01', '2025-12-31', 'active'),
(2, 3, 175000, 'Social Media Campaign', '2025-01-15', '2025-07-15', 'active'),
(12, 3, 100000, 'Local Appearance', '2025-02-01', '2025-05-01', 'active'),
(4, 3, 150000, 'Brand Ambassador', '2025-02-15', '2025-08-15', 'active'),

-- Funded by Coastal Hospitality loan
(3, 4, 35000, 'Brand Ambassador', '2025-04-15', '2025-10-15', 'active'),

-- Funded by Summit Healthcare loan
(6, 5, 125000, 'Community Outreach', '2024-11-01', '2025-04-30', 'active'),
(10, 5, 100000, 'Social Media Campaign', '2024-11-15', '2025-05-15', 'active'),
(11, 5, 85000, 'Brand Ambassador', '2024-12-01', '2025-06-01', 'active');
