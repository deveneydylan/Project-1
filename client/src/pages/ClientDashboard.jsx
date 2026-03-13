import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Table from '../components/common/Table';
import AthleteCard from '../components/common/AthleteCard';
import * as api from '../api';

const fmt = (val) => `$${(val || 0).toLocaleString()}`;

function StatusBadge({ val }) {
  const cls = {
    active: 'metal-badge metal-badge-active',
    paid: 'metal-badge metal-badge-paid',
    defaulted: 'metal-badge metal-badge-defaulted',
  };
  return <span className={cls[val] || 'metal-badge metal-badge-pending'}>{val}</span>;
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
        <p className="metal-loading">Loading</p>
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

  const monoStyle = { fontFamily: 'JetBrains Mono, monospace' };
  const monoGold  = { fontFamily: 'JetBrains Mono, monospace', color: '#f5d058' };

  const loanColumns = [
    { key: 'principal_amount', label: 'Principal', render: (val) => <span style={monoStyle}>{fmt(val)}</span> },
    { key: 'interest_rate', label: 'Rate', render: (val) => `${val}%` },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge val={val} /> },
  ];

  const paymentColumns = [
    { key: 'payment_date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (val) => <span style={monoStyle}>{fmt(val)}</span> },
    { key: 'principal_paid', label: 'Principal Paid', render: (val) => <span style={monoStyle}>{fmt(val)}</span> },
    { key: 'interest_paid', label: 'Interest Paid', render: (val) => <span style={monoStyle}>{fmt(val)}</span> },
    { key: 'nil_contribution', label: 'NIL Contribution', render: (val) => <span style={monoGold}>{fmt(val)}</span> },
  ];

  // athletes from company stats (all 22 GT players)
  const athletes = stats?.athletes_funded || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with company selector */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="metal-page-title">{company?.name}</h1>
          <p className="metal-page-subtitle">Client Portal</p>
        </div>
        <div>
          <label className="block mb-1" style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(100,135,175,0.65)' }}>Company</label>
          <select
            value={companyId}
            onChange={(e) => navigate(`/client/${e.target.value}`)}
            className="metal-select"
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
          subtitle="Principal + interest"
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
