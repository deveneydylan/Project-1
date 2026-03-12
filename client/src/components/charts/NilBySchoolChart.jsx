import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function NilBySchoolChart({ data }) {
  const formatValue = (value) => `$${(value / 1000).toFixed(0)}K`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="school_name"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={80}
        />
        <YAxis tickFormatter={formatValue} />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Bar dataKey="total_amount" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
