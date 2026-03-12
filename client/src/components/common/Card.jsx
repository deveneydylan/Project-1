export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h3
            className="text-base font-semibold"
            style={{ color: '#003057', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.01em' }}
          >
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
