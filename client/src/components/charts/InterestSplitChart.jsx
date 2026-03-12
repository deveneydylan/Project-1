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
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-slate-800">{item.name}</p>
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
        <div className="text-xs text-slate-600">
          <span className="font-medium">{entry.name}</span>
          <span
            className="ml-1.5 font-semibold"
            style={{ color: COLORS[index], fontFamily: 'JetBrains Mono, monospace' }}
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
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">14% Total Rate</p>
        <CustomLegend />
      </div>
    </div>
  );
}
