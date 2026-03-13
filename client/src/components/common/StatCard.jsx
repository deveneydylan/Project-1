export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="metal-stat-card">
      <p className="metal-stat-label">{title}</p>
      <p className="metal-stat-value">{value}</p>
      {subtitle && <p className="metal-stat-subtitle">{subtitle}</p>}
    </div>
  );
}
