const API_BASE = '/api';

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Companies
export const getCompanies = () => fetchJson('/companies');
export const getCompany = (id) => fetchJson(`/companies/${id}`);

// Donors
export const getDonors = () => fetchJson('/donors');
export const getDonorStats = () => fetchJson('/stats/donors');

// Loans
export const getLoans = () => fetchJson('/loans');
export const getLoan = (id) => fetchJson(`/loans/${id}`);
export const getCompanyLoans = (companyId) => fetchJson(`/companies/${companyId}/loans`);
export const createLoan = (data) => fetchJson('/loans', {
  method: 'POST',
  body: JSON.stringify(data),
});

// Payments
export const getLoanPayments = (loanId) => fetchJson(`/loans/${loanId}/payments`);
export const createPayment = (data) => fetchJson('/payments', {
  method: 'POST',
  body: JSON.stringify(data),
});

// Athletes
export const getAthletes = () => fetchJson('/athletes');
export const getAthlete = (id) => fetchJson(`/athletes/${id}`);

// NIL Deals
export const getNilDeals = () => fetchJson('/nil-deals');
export const getNilDeal = (id) => fetchJson(`/nil-deals/${id}`);
export const createNilDeal = (data) => fetchJson('/nil-deals', {
  method: 'POST',
  body: JSON.stringify(data),
});

// Schools
export const getSchools = () => fetchJson('/schools');

// Stats
export const getPortfolioStats = () => fetchJson('/stats/portfolio');
export const getCompanyStats = (companyId) => fetchJson(`/stats/company/${companyId}`);
export const getNilByPosition = () => fetchJson('/stats/nil-by-position');
