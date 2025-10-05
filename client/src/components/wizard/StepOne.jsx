import React, { useState } from "react";

function StepOne({ contextData, updateContext, nextStep }) {
  const [country, setCountry] = useState(contextData.country || "");
  const [erp, setErp] = useState(contextData.erp || "");
  const [webhooks, setWebhooks] = useState(contextData.webhooks || false);
  const [sandboxEnv, setSandboxEnv] = useState(contextData.sandbox_env || false);
  const [retries, setRetries] = useState(contextData.retries || false);

  const handleContinue = () => {
    updateContext({
      country,
      erp,
      webhooks,
      sandbox_env: sandboxEnv,
      retries,
    });
    nextStep();
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-blue-700 mb-2">
        Step 1: Business Context
      </h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Provide information about your organization to customize the analysis.
      </p>

      {/* Country Selection */}
      <div className="mb-5">
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Country / Region
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">Select a country</option>
          <option value="UAE">United Arab Emirates</option>
          <option value="KSA">Kingdom of Saudi Arabia</option>
          <option value="MY">Malaysia</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* ERP System */}
      <div className="mb-6">
        <label
          htmlFor="erp"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ERP System
        </label>
        <input
          id="erp"
          type="text"
          value={erp}
          onChange={(e) => setErp(e.target.value)}
          placeholder="e.g., SAP, Oracle, Dynamics 365"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
        />
      </div>

      {/* Technical Readiness Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-blue-700 mb-3">
          Technical Readiness <span className="text-gray-500 text-sm">(Optional)</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          {/* Webhooks */}
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-700 transition">
            <input
              type="checkbox"
              checked={webhooks}
              onChange={(e) => setWebhooks(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>We support webhook callbacks</span>
          </label>

          {/* Sandbox */}
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-700 transition">
            <input
              type="checkbox"
              checked={sandboxEnv}
              onChange={(e) => setSandboxEnv(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>We have a sandbox environment</span>
          </label>

          {/* Retries */}
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-700 transition">
            <input
              type="checkbox"
              checked={retries}
              onChange={(e) => setRetries(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>We implement automatic retries</span>
          </label>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

export default StepOne;
