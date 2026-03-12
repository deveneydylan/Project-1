export default function StatCard({ title, value, subtitle }) {
  return (
    <div
      className="rounded-xl p-6 shadow-lg relative overflow-hidden"
      style={{ backgroundColor: '#003057' }}
    >
      {/* Subtle decorative accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
        style={{ backgroundColor: '#EAAA00', transform: 'translate(30%, -30%)' }}
      />
      <p
        className="text-xs font-medium uppercase tracking-widest mb-3"
        style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
      >
        {title}
      </p>
      <p
        className="text-3xl font-semibold leading-none"
        style={{ color: '#EAAA00', fontFamily: 'JetBrains Mono, Courier New, monospace' }}
      >
        {value}
      </p>
      {subtitle && (
        <p
          className="text-xs mt-3"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
