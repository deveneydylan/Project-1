export default function Card({ title, children, className = '' }) {
  return (
    <div className={`metal-card ${className}`}>
      {title && (
        <div className="metal-card-header">
          <h3 className="metal-section-title">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
