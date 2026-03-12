export default function AthleteCard({ athlete, amount }) {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center space-x-4">
      <img
        src={athlete.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.name)}`}
        alt={athlete.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{athlete.name}</h4>
        <p className="text-sm text-gray-600">{athlete.sport} - {athlete.position || 'N/A'}</p>
        <p className="text-sm text-gray-500">{athlete.school_name}</p>
        {amount && (
          <p className="text-sm font-medium text-green-600 mt-1">
            ${amount.toLocaleString()} NIL Deal
          </p>
        )}
      </div>
      {athlete.social_followers > 0 && (
        <div className="text-right">
          <p className="text-xs text-gray-500">Followers</p>
          <p className="font-semibold text-gray-700">
            {(athlete.social_followers / 1000).toFixed(0)}K
          </p>
        </div>
      )}
    </div>
  );
}
