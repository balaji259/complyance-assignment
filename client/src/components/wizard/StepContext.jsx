import React, { createContext, useContext, useState } from 'react';

// Create the context
const StepContext = createContext();

// Custom hook to use the Step Context
export const useStepContext = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStepContext must be used within a StepProvider');
  }
  return context;
};

// Provider component
export const StepProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contextData, setContextData] = useState({
    country: '',
    erp: '',
    webhooks: false,
    sandbox_env: false,
    retries: false
  });
  const [uploadId, setUploadId] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [parsedPreview, setParsedPreview] = useState(null);

  // Navigation functions
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

  // Data update function
  const updateContext = (data) => {
    setContextData((prev) => ({ ...prev, ...data }));
  };

  // Reset function for starting over
  const resetWizard = () => {
    setCurrentStep(1);
    setContextData({
      country: '',
      erp: '',
      webhooks: false,
      sandbox_env: false,
      retries: false
    });
    setUploadId(null);
    setReportData(null);
    setParsedPreview(null);
  };

  const value = {
    // State
    currentStep,
    contextData,
    uploadId,
    reportData,
    parsedPreview,
    
    // Setters
    setCurrentStep,
    setContextData,
    setUploadId,
    setReportData,
    setParsedPreview,
    
    // Functions
    nextStep,
    prevStep,
    goToStep,
    updateContext,
    resetWizard,
    
    // Computed values
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 3,
    totalSteps: 3
  };

  return (
    <StepContext.Provider value={value}>
      {children}
    </StepContext.Provider>
  );
};

export default StepContext;
