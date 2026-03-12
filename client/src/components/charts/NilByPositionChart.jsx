import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#003057', '#EAAA00'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p style={{ color: '#003057', fontFamily: 'JetBrains Mono, monospace' }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function NilByPositionChart({ data }) {
  const formatValue = (value) => `$${(value / 1000).toFixed(0)}K`;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={formatValue}
          tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="position"
          tick={{ fontSize: 12, fill: '#475569', fontFamily: 'DM Sans, system-ui' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,48,87,0.04)' }} />
        <Bar dataKey="total_amount" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#003057' : '#EAAA00'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
