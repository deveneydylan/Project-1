import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

export default function PaymentBreakdownChart({ data }) {
  const chartData = [
    { name: 'Principal', value: data.principal || 0 },
    { name: 'Company Interest', value: data.companyInterest || 0 },
    { name: 'NIL Contribution', value: data.nilContribution || 0 },
  ].filter(item => item.value > 0);

  const formatValue = (value) => `$${value.toLocaleString()}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={formatValue} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
