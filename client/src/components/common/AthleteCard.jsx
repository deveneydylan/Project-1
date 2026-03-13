function getInitials(name) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

export default function AthleteCard({ athlete, nilAmount }) {
  const initials = getInitials(athlete.name);

  return (
    <div className="metal-athlete-card">
      <div className="flex items-center gap-4">
        <div className="metal-athlete-avatar">
          <span style={{
            color: '#EAAA00',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}>
            {initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'rgba(210, 228, 248, 0.95)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {athlete.name}
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'rgba(115, 145, 182, 0.7)', marginTop: '0.125rem' }}>
            {athlete.position}
            {athlete.jersey_number != null && (
              <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: 'rgba(234,170,0,0.7)' }}>
                #{athlete.jersey_number}
              </span>
            )}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.5rem',
        borderTop: '1px solid rgba(50, 80, 115, 0.2)',
      }}>
        {athlete.social_followers > 0 ? (
          <div>
            <p style={{ fontSize: '0.6875rem', color: 'rgba(100, 130, 165, 0.6)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>Followers</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(175, 200, 230, 0.9)' }}>
              {athlete.social_followers >= 1000
                ? `${(athlete.social_followers / 1000).toFixed(0)}K`
                : athlete.social_followers}
            </p>
          </div>
        ) : (
          <div />
        )}
        {nilAmount > 0 ? (
          <div className="text-right">
            <p style={{ fontSize: '0.6875rem', color: 'rgba(100, 130, 165, 0.6)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>NIL Deal</p>
            <p className="metal-athlete-nil">${nilAmount.toLocaleString()}</p>
          </div>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'rgba(80, 110, 145, 0.5)', fontStyle: 'italic' }}>No active deal</span>
        )}
      </div>
    </div>
  );
}
