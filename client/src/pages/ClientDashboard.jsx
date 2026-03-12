import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Table from '../components/common/Table';
import AthleteCard from '../components/common/AthleteCard';
import * as api from '../api';

const fmt = (val) => `$${(val || 0).toLocaleString()}`;

function StatusBadge({ val }) {
  const styles = {
    active: { bg: 'rgba(0,48,87,0.1)', color: '#003057' },
    paid: { bg: 'rgba(234,170,0,0.12)', color: '#c89200' },
    defaulted: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
  };
  const s = styles[val] || styles.active;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {val}
    </span>
  );
}

export default function ClientDashboard() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [nilDeals, setNilDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [companyData, loansData, statsData, companiesData, nilDealsData] = await Promise.all([
          api.getCompany(companyId),
          api.getCompanyLoans(companyId),
          api.getCompanyStats(companyId),
          api.getCompanies(),
          api.getNilDeals(),
        ]);

        setCompany(companyData);
        setLoans(loansData);
        setStats(statsData);
        setCompanies(companiesData);
        setNilDeals(nilDealsData);

        if (loansData.length > 0) {
          const allPayments = await Promise.all(
            loansData.map(loan => api.getLoanPayments(loan.id))
          );
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
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 text-sm tracking-widest uppercase">Loading</p>
      </div>
    );
  }

  // Build NIL lookup by athlete_id
  const nilDealByAthlete = nilDeals.reduce((acc, deal) => {
    if (deal.status === 'active' && deal.amount > 0) {
      acc[deal.athlete_id] = (acc[deal.athlete_id] || 0) + deal.amount;
    }
    return acc;
  }, {});

  const loanColumns = [
    { key: 'principal_amount', label: 'Principal', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'interest_rate', label: 'Rate', render: (val) => `${val}%` },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge val={val} /> },
  ];

  const paymentColumns = [
    { key: 'payment_date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'principal_paid', label: 'Principal Paid', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'interest_paid', label: 'Interest Paid', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'nil_contribution', label: 'NIL Contribution', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#c89200' }}>{fmt(val)}</span> },
  ];

  // athletes from company stats (all 22 GT players)
  const athletes = stats?.athletes_funded || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with company selector */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1
            className="text-3xl font-semibold"
            style={{ color: '#003057', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            {company?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Client Portal</p>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Company</label>
          <select
            value={companyId}
            onChange={(e) => navigate(`/client/${e.target.value}`)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer bg-white"
            style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
            onFocus={e => e.target.style.borderColor = '#EAAA00'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Borrowed"
          value={fmt(stats?.total_borrowed)}
        />
        <StatCard
          title="Total Paid"
          value={fmt(stats?.total_paid)}
        />
        <StatCard
          title="NIL Contributed (7%)"
          value={fmt(stats?.total_nil_contributed)}
          subtitle="Supporting GT athletes"
        />
        <StatCard
          title="Active Loans"
          value={stats?.active_loans || 0}
        />
      </div>

      {/* GT Athletes Grid */}
      <Card title="Georgia Tech Football Athletes" className="mb-8">
        <p className="text-xs text-slate-400 mb-5">
          22 GT football players supported through the NIL lending program
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {athletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              nilAmount={nilDealByAthlete[athlete.id] || 0}
            />
          ))}
        </div>
        {athletes.length === 0 && (
          <p className="text-slate-400 text-center py-6 text-sm italic">No athlete data available</p>
        )}
      </Card>

      {/* Loan Details */}
      <Card title="Loan Details" className="mb-8">
        <Table columns={loanColumns} data={loans} />
      </Card>

      {/* Payment History */}
      <Card title="Payment History">
        <Table columns={paymentColumns} data={payments} />
      </Card>
    </div>
  );
}
