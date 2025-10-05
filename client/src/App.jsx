import React, { useState } from 'react';
import StepContext from './components/wizard/StepContext';
import StepOne from './components/wizard/stepOne';
import StepTwo from './components/wizard/StepTwo';
import StepThree from './components/wizard/StepThree';
import ProgressBar from './components/shared/ProgressBar';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [contextData, setContextData] = useState({});
  const [uploadId, setUploadId] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [parsedPreview, setParsedPreview] = useState(null);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateContext = (data) => {
    setContextData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            contextData={contextData}
            updateContext={updateContext}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <StepTwo
            contextData={contextData}
            uploadId={uploadId}
            setUploadId={setUploadId}
            setParsedPreview={setParsedPreview}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <StepThree
            uploadId={uploadId}
            contextData={contextData}
            reportData={reportData}
            setReportData={setReportData}
            parsedPreview={parsedPreview}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
   <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-800">

  {/* HEADER */}
  <header className="backdrop-blur-md bg-white/70 border-b border-blue-200 shadow-sm sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-6 py-5 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 tracking-tight">
        E-Invoicing Readiness Analyzer
      </h1>
      <p className="text-gray-600 text-sm md:text-base mt-1">
        Assess your invoice data compliance with <span className="font-semibold text-blue-600">GETS v0.1</span>
      </p>
    </div>
  </header>

  {/* MAIN */}
  <main className="flex-grow flex items-center justify-center px-4 py-10">
    <div className="relative w-full max-w-3xl rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl p-8 md:p-12 transition-all duration-500 border border-blue-100 hover:shadow-blue-200">

      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>

      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar currentStep={currentStep} totalSteps={3} />
      </div>

      {/* Step Content */}
      <div className="mt-6 animate-fadeIn">
        {renderStep()}
      </div>
    </div>
  </main>

  {/* FOOTER */}
  <footer className="bg-transparent mt-auto py-6 text-center text-gray-600 text-sm border-t border-blue-100 backdrop-blur-md">
    <p>
      © 2025 <span className="font-semibold text-blue-700">E-Invoicing Tools</span> • Powered by GETS Standards
    </p>
  </footer>
</div>


  );
}

export default App;
