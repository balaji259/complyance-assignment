import React from 'react';

function RuleFindings({ findings }) {
  const getRuleDescription = (rule) => {
    const descriptions = {
      TOTALS_BALANCE: 'Invoice totals must balance: total_excl_vat + vat_amount = total_incl_vat',
      LINE_MATH: 'Line items must calculate correctly: qty × unit_price = line_total',
      DATE_ISO: 'Invoice dates must use ISO format (YYYY-MM-DD)',
      CURRENCY_ALLOWED: 'Currency must be one of: AED, SAR, MYR, USD',
      TRN_PRESENT: 'Both buyer and seller TRN (Tax Registration Number) must be present'
    };
    return descriptions[rule] || rule;
  };

  const getRuleFix = (finding) => {
    if (finding.ok) return null;

    const fixes = {
      TOTALS_BALANCE: 'Review invoice calculation logic and ensure all amounts are accurate',
      LINE_MATH: `Check line ${finding.exampleLine || 'items'} calculations`,
      DATE_ISO: `Update date format. Found: "${finding.value}" → Use: "YYYY-MM-DD"`,
      CURRENCY_ALLOWED: `Invalid currency "${finding.value}". Use: AED, SAR, MYR, or USD`,
      TRN_PRESENT: 'Ensure all invoices include valid TRN values for buyer and seller'
    };
    return fixes[finding.rule];
  };

  const formatRuleName = (rule) => {
    return rule.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">Rule Compliance Checks</p>
      
      <div className="space-y-3">
        {findings.map((finding, idx) => (
          <div
            key={idx}
            className={`rounded-lg border-2 p-5 transition-all ${
              finding.ok
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl ${
                    finding.ok ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {finding.ok ? '✓' : '✗'}
                </span>
                <h4 className="text-lg font-bold text-gray-800">
                  {formatRuleName(finding.rule)}
                </h4>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  finding.ok
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {finding.ok ? 'PASS' : 'FAIL'}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3 text-sm leading-relaxed">
              {getRuleDescription(finding.rule)}
            </p>

            {/* Details for failed rules */}
            {!finding.ok && (
              <div className="bg-white border border-red-200 rounded-lg p-4 mt-3">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 mb-2">
                      Recommendation:
                    </p>
                    <p className="text-gray-700 text-sm">
                      {getRuleFix(finding)}
                    </p>
                    
                    {/* Example details */}
                    {finding.exampleLine && (
                      <p className="text-xs text-gray-600 mt-2 font-mono bg-gray-100 p-2 rounded">
                        Example: Line {finding.exampleLine}
                        {finding.expected && ` (Expected: ${finding.expected}, Got: ${finding.got})`}
                      </p>
                    )}
                    
                    {finding.exampleRow && !finding.exampleLine && (
                      <p className="text-xs text-gray-600 mt-2 font-mono bg-gray-100 p-2 rounded">
                        Example: Row {finding.exampleRow}
                        {finding.value && ` (Value: "${finding.value}")`}
                      </p>
                    )}

                    {finding.missingCount && (
                      <p className="text-xs text-red-600 mt-2 font-semibold">
                        Found {finding.missingCount} row(s) with missing TRN values
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RuleFindings;
