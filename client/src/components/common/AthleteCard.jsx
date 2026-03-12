function getInitials(name) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

export default function AthleteCard({ athlete, nilAmount }) {
  const initials = getInitials(athlete.name);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        {/* Navy avatar with gold initials */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#003057' }}
        >
          <span
            className="text-base font-semibold"
            style={{ color: '#EAAA00', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem' }}
          >
            {initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 text-sm truncate">{athlete.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {athlete.position}
            {athlete.jersey_number != null && (
              <span className="ml-2 font-medium" style={{ color: '#003057' }}>#{athlete.jersey_number}</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        {athlete.social_followers > 0 ? (
          <div>
            <p className="text-xs text-slate-400">Followers</p>
            <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
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
            <p className="text-xs text-slate-400">NIL Deal</p>
            <p
              className="text-sm font-semibold"
              style={{ color: '#EAAA00', fontFamily: 'JetBrains Mono, monospace' }}
            >
              ${nilAmount.toLocaleString()}
            </p>
          </div>
        ) : (
          <span className="text-xs text-slate-300 italic">No active deal</span>
        )}
      </div>
    </div>
  );
}
