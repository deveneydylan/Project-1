import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  'Principal': '#003057',
  'Company Interest': '#EAAA00',
  'NIL Contribution': '#94a3b8',
};

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
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip formatter={formatValue} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
