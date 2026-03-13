import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'PIP Co', rate: '2%', value: 2 },
  { name: 'Donors', rate: '5%', value: 5 },
  { name: 'Players (NIL)', rate: '7%', value: 7 },
];

const COLORS = ['#003057', '#EAAA00', '#94a3b8'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="metal-tooltip">
        <p className="metal-tooltip-title">{item.name}</p>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', color: item.payload.fill }}>
          {item.payload.rate} of 14% total
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = () => (
  <div className="flex flex-col gap-2 justify-center">
    {data.map((entry, index) => (
      <div key={entry.name} className="flex items-center gap-2.5">
        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index] }} />
        <div style={{ fontSize: '0.75rem', color: 'rgba(165, 195, 225, 0.8)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
          <span style={{ fontWeight: 500 }}>{entry.name}</span>
          <span
            style={{ marginLeft: '0.375rem', fontWeight: 600, color: COLORS[index], fontFamily: 'JetBrains Mono, monospace' }}
          >
            {entry.rate}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default function InterestSplitChart() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex-shrink-0" style={{ width: 160, height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-1">
        <p style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(100,135,175,0.6)', marginBottom: '0.25rem', fontFamily: 'DM Sans, system-ui, sans-serif' }}>14% Total Rate</p>
        <CustomLegend />
      </div>
    </div>
  );
}
