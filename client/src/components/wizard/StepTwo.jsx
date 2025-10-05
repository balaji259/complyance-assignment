import React, { useState } from 'react';
import { uploadFile, uploadText } from '../../services/api';

function StepTwo({ contextData, uploadId, setUploadId, setParsedPreview, nextStep, prevStep }) {
  const [uploadMode, setUploadMode] = useState('file');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('country', contextData.country || '');
      formData.append('erp', contextData.erp || '');

      // ✅ UNCOMMENTED - This is critical!
      console.log('Uploading file to backend...');
      const response = await uploadFile(formData);
      console.log('Upload response:', response);
      setUploadId(response.uploadId);

      // Parse preview for UI
      const text = await file.text();
      parsePreview(text, file.name.endsWith('.json') ? 'json' : 'csv');
      
      setLoading(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setLoading(false);
    }
  };

  const handleTextUpload = async () => {
    if (!textInput.trim()) {
      setError('Please enter CSV or JSON data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ UNCOMMENTED - This is critical!
      console.log('Uploading text to backend...');
      const response = await uploadText({
        text: textInput,
        country: contextData.country || '',
        erp: contextData.erp || ''
      });
      console.log('Upload response:', response);
      setUploadId(response.uploadId);

      // Parse preview for UI
      parsePreview(textInput);
      
      setLoading(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setLoading(false);
    }
  };

  const parsePreview = (text, format) => {
    try {
      let data;
      if (format === 'json' || text.trim().startsWith('{') || text.trim().startsWith('[')) {
        data = JSON.parse(text);
        data = Array.isArray(data) ? data : [data];
      } else {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length === 0) {
          throw new Error('Empty file');
        }
        const headers = lines[0].split(',').map(h => h.trim());
        data = lines.slice(1, 21).map(line => {
          const values = line.split(',');
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = values[i]?.trim();
          });
          return obj;
        });
      }
      setParsedPreview(data.slice(0, 20));
    } catch (err) {
      console.error('Preview parsing error:', err);
      setError('Failed to parse file preview');
    }
  };

  const handleAnalyze = () => {
    if (uploadId) {
      nextStep();
    } else {
      setError('Please upload data first');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 mt-6 transition-all duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-2">
        Step 2: Upload Invoice Data
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Upload a <span className="font-medium">CSV</span> or <span className="font-medium">JSON</span> file (max 5MB, first 200 rows analyzed)
      </p>

      {/* Upload mode selector */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg border transition-all duration-300 ${
            uploadMode === 'file'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300'
          }`}
          onClick={() => setUploadMode('file')}
        >
          Upload File
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg border transition-all duration-300 ${
            uploadMode === 'text'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300'
          }`}
          onClick={() => setUploadMode('text')}
        >
          Paste Data
        </button>
      </div>

      {/* Upload Section */}
      {uploadMode === 'file' ? (
        <div className="flex flex-col items-center">
          <label
            htmlFor="file-input"
            className="w-full text-center border-2 border-dashed border-gray-400 dark:border-gray-600 p-6 rounded-xl cursor-pointer hover:border-blue-500 transition-all duration-300 text-gray-600 dark:text-gray-300"
          >
            {fileName || 'Click to choose CSV or JSON file'}
          </label>
          <input
            id="file-input"
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste CSV or JSON data here..."
            rows={10}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
          />
          <button
            onClick={handleTextUpload}
            disabled={loading || !textInput.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-5 text-gray-600 dark:text-gray-300">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p>Processing upload...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          ⚠️ {error}
        </div>
      )}

      {uploadId && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
          ✓ Upload successful! ID: {uploadId}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleAnalyze}
          disabled={!uploadId || loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}

export default StepTwo;
