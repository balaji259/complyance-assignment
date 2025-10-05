import React from "react";

function ProgressBar({ currentStep, totalSteps }) {
  const steps = [
    { number: 1, label: "Context" },
    { number: 2, label: "Upload" },
    { number: 3, label: "Results" },
  ];

  return (
    <div className="w-full flex items-center justify-between relative px-2 sm:px-4">
      {steps.map((step, idx) => (
        <React.Fragment key={step.number}>
          {/* Step Item */}
          <div className="flex flex-col items-center flex-1 text-center">
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${
                  currentStep > step.number
                    ? "bg-blue-600 border-blue-600 text-white"
                    : currentStep === step.number
                    ? "bg-blue-100 border-blue-500 text-blue-700 scale-110"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
            >
              {currentStep > step.number ? "✓" : step.number}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                currentStep >= step.number ? "text-blue-700" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-[2px] sm:h-[3px] mx-2 sm:mx-4 transition-all duration-300 
                ${
                  currentStep > step.number
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ProgressBar;
