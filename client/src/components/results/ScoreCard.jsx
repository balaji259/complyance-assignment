import React from 'react';

function ScoreCard({ title, score }) {
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreRing = (score) => {
    if (score >= 75) return 'stroke-green-500';
    if (score >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h4 className="text-sm font-semibold text-gray-600 mb-4 text-center">
        {title}
      </h4>
      
      {/* Circular Progress */}
      <div className="relative w-32 h-32 mx-auto mb-3">
        <svg className="transform -rotate-90 w-32 h-32">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            className={getScoreRing(score)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ${
            score >= 75
              ? 'bg-green-500'
              : score >= 50
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default ScoreCard;
