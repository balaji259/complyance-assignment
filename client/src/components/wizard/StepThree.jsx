import React, { useEffect, useState } from "react";
import { analyzeUpload } from "../../services/api";
import TablePreview from "../results/tablePreview";
import CoveragePanel from "../results/coveragePanel";
import ScoreCard from "../results/scoreCard";
import RuleFindings from "../results/ruleFindings";

function StepThree({
  uploadId,
  contextData,
  reportData,
  setReportData,
  parsedPreview,
  prevStep,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (uploadId && !reportData) {
      performAnalysis();
    }
  }, [uploadId, reportData]);

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const questionnaire = {
        webhooks: contextData.webhooks || false,
        sandbox_env: contextData.sandbox_env || false,
        retries: contextData.retries || false,
      };

      const response = await analyzeUpload(uploadId, questionnaire);
      setReportData(response);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Analysis failed");
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${reportData.reportId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyShareLink = () => {
    if (!reportData) return;
    const shareUrl = `${window.location.origin}/api/report/${reportData.reportId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("✓ Share link copied to clipboard!");
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="flex flex-col items-center justify-center text-gray-700">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-semibold mb-2">
              Analyzing your invoice data...
            </h3>
            <p className="text-gray-500">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-red-600 mb-2">
            Analysis Failed
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // No Data State
  if (!reportData) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No report data available</p>
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main Results Display
  return (
    <div className="w-full mx-auto px-4 pb-12">
      {/* Hero Section with Overall Score */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                {reportData.scores.overall}%
              </h2>
              <p className="text-blue-100 text-lg">Overall Readiness Score</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <span
                className={`px-6 py-3 rounded-full text-lg font-semibold shadow-lg ${
                  reportData.meta.readinessLabel === "High"
                    ? "bg-green-500 text-white"
                    : reportData.meta.readinessLabel === "Medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {reportData.meta.readinessLabel} Readiness
              </span>
              <div className="flex gap-3">
                <button
                  onClick={downloadReport}
                  className="px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium shadow-md flex items-center gap-2"
                >
                  <span>📥</span> Download Report
                </button>
                {/* <button
                  onClick={copyShareLink}
                  className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all font-medium shadow-md flex items-center gap-2"
                >
                  <span>🔗</span> Copy Link
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="max-w-6xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 px-2">
          Score Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScoreCard title="Data Quality" score={reportData.scores.data} />
          <ScoreCard title="Field Coverage" score={reportData.scores.coverage} />
          <ScoreCard title="Rules Compliance" score={reportData.scores.rules} />
          <ScoreCard 
            title="Technical Posture" 
            score={reportData.scores.posture} 
          />
        </div>
      </div>

      {/* Table Preview */}
      {parsedPreview && parsedPreview.length > 0 && (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Data Preview
            </h3>
            <TablePreview data={parsedPreview} />
          </div>
        </div>
      )}

      {/* Coverage Panel */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Field Coverage Analysis
          </h3>
          <CoveragePanel coverage={reportData.coverage} />
        </div>
      </div>

      {/* Rule Findings */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Compliance Rules Check
          </h3>
          <RuleFindings findings={reportData.ruleFindings} />
        </div>
      </div>

      {/* Gaps Summary */}
      {reportData.gaps && reportData.gaps.length > 0 && (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-3">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-800 mb-3">
                  Key Gaps to Address
                </h3>
                <ul className="space-y-2">
                  {reportData.gaps.map((gap, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-gray-600">
              Report ID: <span className="font-mono font-semibold text-gray-800">{reportData.reportId}</span>
            </p>
            <p className="text-sm text-gray-500">
              {reportData.meta.rowsParsed} rows analyzed • {reportData.meta.db}
            </p>
          </div>
          <button
            onClick={prevStep}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Upload New File
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepThree;
