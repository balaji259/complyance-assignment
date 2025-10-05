import React from 'react';

function TablePreview({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to preview
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const rows = data.slice(0, 20);

  const inferType = (value) => {
    if (value === null || value === undefined || value === '') return 'empty';
    if (typeof value === 'number') return 'number';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date';
    return 'text';
  };

  const getTypeBadge = (type) => {
    const badges = {
      number: '🔢',
      date: '📅',
      text: '📝',
      empty: '—'
    };
    return badges[type] || '📄';
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Data Preview (First 20 Rows)
      </p>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                #
              </th>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                  {rowIdx + 1}
                </td>
                {headers.map((header, colIdx) => {
                  const value = row[header];
                  const type = inferType(value);
                  const displayValue = value !== null && value !== undefined ? String(value) : '—';
                  
                  return (
                    <td
                      key={colIdx}
                      className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{getTypeBadge(type)}</span>
                        <span className={type === 'empty' ? 'text-gray-400' : ''}>
                          {displayValue}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 text-center">
        Showing {rows.length} of {data.length} rows
      </p>
    </div>
  );
}

export default TablePreview;
