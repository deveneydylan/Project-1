import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Table from '../components/common/Table';
import AthleteCard from '../components/common/AthleteCard';
import NilByPositionChart from '../components/charts/NilByPositionChart';
import InterestSplitChart from '../components/charts/InterestSplitChart';
import * as api from '../api';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'loans', label: 'Loans' },
  { id: 'nil', label: 'NIL Deals' },
  { id: 'athletes', label: 'Athletes' },
  { id: 'donors', label: 'Donors' },
];

const fmt = (val) => `$${(val || 0).toLocaleString()}`;
const fmtPct = (val) => `${(val || 0).toFixed(1)}%`;

function StatusBadge({ val }) {
  const styles = {
    active: { bg: 'rgba(0,48,87,0.1)', color: '#003057' },
    paid: { bg: 'rgba(234,170,0,0.12)', color: '#c89200' },
    defaulted: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
    pending: { bg: 'rgba(148,163,184,0.2)', color: '#64748b' },
    completed: { bg: 'rgba(234,170,0,0.12)', color: '#c89200' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
  };
  const s = styles[val] || styles.pending;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {val}
    </span>
  );
}

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
        const [statsData, loansData, athletesData, nilDealsData, positionData, donorsData, donorStatsData] = await Promise.all([
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 text-sm tracking-widest uppercase">Loading</p>
      </div>
    );
  }

  // Build NIL deal lookup by athlete_id (active deals only)
  const nilDealByAthlete = nilDeals.reduce((acc, deal) => {
    if (deal.status === 'active' && deal.amount > 0) {
      acc[deal.athlete_id] = (acc[deal.athlete_id] || 0) + deal.amount;
    }
    return acc;
  }, {});

  const filteredAthletes = athletes.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loanColumns = [
    { key: 'principal_amount', label: 'Amount', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'interest_rate', label: 'Rate', render: (val) => `${val}%` },
    { key: 'donor_display_name', label: 'Donor' },
    { key: 'start_date', label: 'Start' },
    { key: 'end_date', label: 'End' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge val={val} /> },
  ];

  const overviewLoanColumns = [
    { key: 'principal_amount', label: 'Amount', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'donor_display_name', label: 'Donor' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge val={val} /> },
  ];

  const nilDealColumns = [
    { key: 'athlete_name', label: 'Athlete' },
    { key: 'position', label: 'Position' },
    { key: 'amount', label: 'Amount', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'deal_type', label: 'Type' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge val={val} /> },
  ];

  const overviewNilColumns = [
    { key: 'athlete_name', label: 'Athlete' },
    { key: 'position', label: 'Position' },
    { key: 'amount', label: 'Amount', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
  ];

  const donorColumns = [
    { key: 'name', label: 'Name' },
    { key: 'amount', label: 'Invested', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(val)}</span> },
    { key: 'pct_of_fund', label: '% of Fund', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmtPct(val)}</span> },
    { key: 'projected_return_5pct', label: '5% Return', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#c89200' }}>{fmt(val)}</span> },
    { key: 'projected_total_return', label: 'Total Return', render: (val) => <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#003057', fontWeight: 600 }}>{fmt(val)}</span> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-semibold"
          style={{ color: '#003057', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          Internal Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">Portfolio & NIL Management</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex gap-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="pb-3 text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive ? '#003057' : '#94a3b8',
                  borderBottom: isActive ? '2px solid #EAAA00' : '2px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ---- OVERVIEW TAB ---- */}
      {activeTab === 'overview' && (
        <>
          {/* 6 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Loans Outstanding"
              value={fmt(stats?.total_loans_outstanding)}
              subtitle={`${stats?.active_loans_count || 0} active loans`}
            />
            <StatCard
              title="PIP Co Revenue (2%)"
              value={fmt(stats?.pip_revenue)}
              subtitle="Platform fee collected"
            />
            <StatCard
              title="Donor Returns (5%)"
              value={fmt(stats?.donor_returns)}
              subtitle="Investor interest paid"
            />
            <StatCard
              title="NIL Collected (7%)"
              value={fmt(stats?.total_nil_collected)}
              subtitle="Athlete NIL funds"
            />
            <StatCard
              title="NIL Allocated"
              value={fmt(stats?.total_nil_allocated)}
              subtitle={`${stats?.active_nil_deals_count || 0} active deals`}
            />
            <StatCard
              title="NIL Available"
              value={fmt(stats?.nil_funds_available)}
              subtitle="Ready to allocate"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="NIL by Position">
              {nilByPosition.length > 0 ? (
                <NilByPositionChart data={nilByPosition} />
              ) : (
                <p className="text-slate-400 text-center py-8 text-sm italic">No data available</p>
              )}
            </Card>
            <Card title="Interest Split Breakdown">
              <InterestSplitChart />
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Recent Loans">
              <Table columns={overviewLoanColumns} data={loans.slice(0, 5)} />
            </Card>
            <Card title="Recent NIL Deals">
              <Table columns={overviewNilColumns} data={nilDeals.slice(0, 5)} />
            </Card>
          </div>
        </>
      )}

      {/* ---- LOANS TAB ---- */}
      {activeTab === 'loans' && (
        <Card title="All Loans">
          <Table columns={loanColumns} data={loans} />
        </Card>
      )}

      {/* ---- NIL DEALS TAB ---- */}
      {activeTab === 'nil' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard title="NIL Collected" value={fmt(stats?.total_nil_collected)} />
            <StatCard title="NIL Allocated" value={fmt(stats?.total_nil_allocated)} subtitle={`${stats?.active_nil_deals_count || 0} active deals`} />
            <StatCard title="NIL Available" value={fmt(stats?.nil_funds_available)} subtitle="Ready to allocate" />
          </div>
          <Card title="All NIL Deals">
            <Table columns={nilDealColumns} data={nilDeals} />
          </Card>
        </>
      )}

      {/* ---- ATHLETES TAB ---- */}
      {activeTab === 'athletes' && (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
              onFocus={e => e.target.style.borderColor = '#EAAA00'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAthletes.map((athlete) => (
              <AthleteCard
                key={athlete.id}
                athlete={athlete}
                nilAmount={nilDealByAthlete[athlete.id] || 0}
              />
            ))}
          </div>
          {filteredAthletes.length === 0 && (
            <p className="text-slate-400 text-center py-10 text-sm italic">No athletes found</p>
          )}
        </>
      )}

      {/* ---- DONORS TAB ---- */}
      {activeTab === 'donors' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Total Invested"
              value={fmt(donorStats?.total_invested)}
              subtitle="GT donor capital"
            />
            <StatCard
              title="Total Returns Earned"
              value={fmt(donorStats?.total_returns_earned)}
              subtitle="Cash basis (payments made)"
            />
            <StatCard
              title="Projected Total Return"
              value={fmt(donorStats?.projected_total_return)}
              subtitle="Principal + 5% projected"
            />
          </div>
          <Card title="GT Donors">
            <Table columns={donorColumns} data={donors} />
          </Card>
        </>
      )}
    </div>
  );
}
