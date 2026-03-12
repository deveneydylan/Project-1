import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Table from '../components/common/Table';
import AthleteCard from '../components/common/AthleteCard';
import NilBySportChart from '../components/charts/NilBySportChart';
import NilBySchoolChart from '../components/charts/NilBySchoolChart';
import * as api from '../api';

export default function InternalDashboard() {
  const [stats, setStats] = useState(null);
  const [loans, setLoans] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [nilDeals, setNilDeals] = useState([]);
  const [nilBySport, setNilBySport] = useState([]);
  const [nilBySchool, setNilBySchool] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, loansData, athletesData, nilDealsData, sportData, schoolData] = await Promise.all([
          api.getPortfolioStats(),
          api.getLoans(),
          api.getAthletes(),
          api.getNilDeals(),
          api.getNilBySport(),
          api.getNilBySchool(),
        ]);

        setStats(statsData);
        setLoans(loansData);
        setAthletes(athletesData);
        setNilDeals(nilDealsData);
        setNilBySport(sportData);
        setNilBySchool(schoolData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  const formatCurrency = (val) => `$${(val || 0).toLocaleString()}`;

  const loanColumns = [
    { key: 'company_name', label: 'Company' },
    { key: 'principal_amount', label: 'Principal', render: (val) => formatCurrency(val) },
    { key: 'interest_rate', label: 'Rate', render: (val) => `${val}%` },
    { key: 'start_date', label: 'Start' },
    { key: 'end_date', label: 'End' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          val === 'active' ? 'bg-green-100 text-green-800' :
          val === 'paid' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {val}
        </span>
      )
    },
  ];

  const nilDealColumns = [
    { key: 'athlete_name', label: 'Athlete' },
    { key: 'sport', label: 'Sport' },
    { key: 'school_name', label: 'School' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
    { key: 'deal_type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          val === 'active' ? 'bg-green-100 text-green-800' :
          val === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          val === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {val}
        </span>
      )
    },
  ];

  const filteredAthletes = athletes.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.school_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'loans', label: 'Loans' },
    { id: 'nil', label: 'NIL Deals' },
    { id: 'athletes', label: 'Athletes' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Internal Dashboard</h1>
      <p className="text-gray-600 mb-6">Portfolio and NIL Management</p>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Loans Outstanding"
              value={formatCurrency(stats?.total_loans_outstanding)}
              subtitle={`${stats?.active_loans_count || 0} active loans`}
              color="blue"
            />
            <StatCard
              title="Revenue Earned"
              value={formatCurrency(stats?.total_revenue_earned)}
              subtitle="Company portion of interest"
              color="green"
            />
            <StatCard
              title="NIL Funds Collected"
              value={formatCurrency(stats?.total_nil_collected)}
              color="purple"
            />
            <StatCard
              title="NIL Funds Allocated"
              value={formatCurrency(stats?.total_nil_allocated)}
              subtitle={`${stats?.active_nil_deals_count || 0} active deals`}
              color="purple"
            />
            <StatCard
              title="NIL Funds Available"
              value={formatCurrency(stats?.nil_funds_available)}
              subtitle="Ready to allocate"
              color="orange"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="NIL Allocation by Sport">
              {nilBySport.length > 0 ? (
                <NilBySportChart data={nilBySport} />
              ) : (
                <p className="text-gray-500 text-center py-8">No data</p>
              )}
            </Card>
            <Card title="NIL Allocation by School">
              {nilBySchool.length > 0 ? (
                <NilBySchoolChart data={nilBySchool} />
              ) : (
                <p className="text-gray-500 text-center py-8">No data</p>
              )}
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Recent Loans">
              <Table columns={loanColumns} data={loans.slice(0, 5)} />
            </Card>
            <Card title="Recent NIL Deals">
              <Table columns={nilDealColumns} data={nilDeals.slice(0, 5)} />
            </Card>
          </div>
        </>
      )}

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <Card title="All Loans">
          <Table columns={loanColumns} data={loans} />
        </Card>
      )}

      {/* NIL Deals Tab */}
      {activeTab === 'nil' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total NIL Collected"
              value={formatCurrency(stats?.total_nil_collected)}
              color="purple"
            />
            <StatCard
              title="Total Allocated"
              value={formatCurrency(stats?.total_nil_allocated)}
              color="green"
            />
            <StatCard
              title="Available to Allocate"
              value={formatCurrency(stats?.nil_funds_available)}
              color="orange"
            />
          </div>
          <Card title="All NIL Deals">
            <Table columns={nilDealColumns} data={nilDeals} />
          </Card>
        </>
      )}

      {/* Athletes Tab */}
      {activeTab === 'athletes' && (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search athletes by name, sport, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 border rounded-md px-4 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAthletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
          {filteredAthletes.length === 0 && (
            <p className="text-gray-500 text-center py-8">No athletes found</p>
          )}
        </>
      )}
    </div>
  );
}
