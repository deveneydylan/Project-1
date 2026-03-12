export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr style={{ backgroundColor: '#003057' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors duration-100 ${onRowClick ? 'cursor-pointer' : ''}`}
              style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4f8'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc'}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-800"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-sm italic">No data available</div>
      )}
    </div>
  );
}
