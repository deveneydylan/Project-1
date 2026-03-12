import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function NilBySportChart({ data }) {
  const formatValue = (value) => `$${(value / 1000).toFixed(0)}K`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={formatValue} />
        <YAxis type="category" dataKey="sport" />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Bar dataKey="total_amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
