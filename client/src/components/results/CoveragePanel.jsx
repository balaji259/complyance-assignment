import React from 'react';

function CoveragePanel({ coverage }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-4">Field Coverage Mapping</p>

      {/* Matched Fields */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">✓</span>
          <h4 className="text-lg font-semibold text-green-800">
            Matched Fields ({coverage.matched.length})
          </h4>
        </div>
        {coverage.matched.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {coverage.matched.map((field, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300"
              >
                {field}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-green-700">No exact matches found</p>
        )}
      </div>

      {/* Close Matches */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">≈</span>
          <h4 className="text-lg font-semibold text-blue-800">
            Close Matches ({coverage.close.length})
          </h4>
        </div>
        {coverage.close.length > 0 ? (
          <div className="space-y-3">
            {coverage.close.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-3 border border-blue-200"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-blue-900">
                    {item.target}
                  </span>
                  <span className="text-sm text-gray-600">→</span>
                  <span className="text-blue-700">{item.candidate}</span>
                  <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {Math.round(item.confidence * 100)}% similar
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-700">No close matches</p>
        )}
      </div>

      {/* Missing Fields */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">✗</span>
          <h4 className="text-lg font-semibold text-red-800">
            Missing Fields ({coverage.missing.length})
          </h4>
        </div>
        {coverage.missing.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {coverage.missing.map((field, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-300"
              >
                {field}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-green-700 font-medium">✓ All fields present!</p>
        )}
      </div>
    </div>
  );
}

export default CoveragePanel;
