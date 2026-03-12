import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Table from '../components/common/Table';
import AthleteCard from '../components/common/AthleteCard';
import PaymentBreakdownChart from '../components/charts/PaymentBreakdownChart';
import * as api from '../api';

export default function ClientDashboard() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [companyData, loansData, statsData, companiesData] = await Promise.all([
          api.getCompany(companyId),
          api.getCompanyLoans(companyId),
          api.getCompanyStats(companyId),
          api.getCompanies(),
        ]);

        setCompany(companyData);
        setLoans(loansData);
        setStats(statsData);
        setCompanies(companiesData);

        // Load payments for all loans
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  const formatCurrency = (val) => `$${(val || 0).toLocaleString()}`;

  // Calculate payment breakdown totals
  const totalPrincipal = payments.reduce((sum, p) => sum + p.principal_paid, 0);
  const totalInterest = payments.reduce((sum, p) => sum + p.interest_paid, 0);
  const totalNil = payments.reduce((sum, p) => sum + p.nil_contribution, 0);
  const companyInterest = totalInterest - totalNil;

  const paymentColumns = [
    { key: 'payment_date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
    { key: 'principal_paid', label: 'Principal', render: (val) => formatCurrency(val) },
    { key: 'interest_paid', label: 'Interest', render: (val) => formatCurrency(val) },
    { key: 'nil_contribution', label: 'NIL Contribution', render: (val) => formatCurrency(val) },
  ];

  const loanColumns = [
    { key: 'principal_amount', label: 'Principal', render: (val) => formatCurrency(val) },
    { key: 'interest_rate', label: 'Rate', render: (val) => `${val}%` },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Company Selector */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company?.name}</h1>
          <p className="text-gray-600">Client Portal</p>
        </div>
        <select
          value={companyId}
          onChange={(e) => window.location.href = `/client/${e.target.value}`}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Borrowed"
          value={formatCurrency(stats?.total_borrowed)}
          color="blue"
        />
        <StatCard
          title="Total Paid"
          value={formatCurrency(stats?.total_paid)}
          color="green"
        />
        <StatCard
          title="NIL Contributed"
          value={formatCurrency(stats?.total_nil_contributed)}
          subtitle="Supporting college athletes"
          color="purple"
        />
        <StatCard
          title="Active Loans"
          value={stats?.active_loans || 0}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Payment Breakdown Chart */}
        <Card title="Payment Breakdown">
          {payments.length > 0 ? (
            <PaymentBreakdownChart
              data={{
                principal: totalPrincipal,
                companyInterest: companyInterest,
                nilContribution: totalNil,
              }}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No payments yet</p>
          )}
        </Card>

        {/* NIL Impact */}
        <Card title="Your NIL Impact">
          <p className="text-sm text-gray-600 mb-4">
            Athletes supported by your NIL contributions:
          </p>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {stats?.athletes_funded?.length > 0 ? (
              stats.athletes_funded.map((athlete) => (
                <AthleteCard key={athlete.id} athlete={athlete} amount={athlete.amount} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No athletes funded yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Loans Table */}
      <Card title="Your Loans" className="mb-8">
        <Table columns={loanColumns} data={loans} />
      </Card>

      {/* Payment History */}
      <Card title="Payment History">
        <Table columns={paymentColumns} data={payments} />
      </Card>
    </div>
  );
}
