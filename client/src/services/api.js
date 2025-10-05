
const API_BASE = import.meta.env.VITE_API_BASE;

// Upload file (multipart form data)
export const uploadFile = async (formData) => {
  try {
    console.log('Calling API:', `${API_BASE}/upload`);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
      // Note: Do NOT set Content-Type header for FormData, browser sets it automatically
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: `HTTP ${response.status}: Upload failed` } 
      }));
      throw new Error(error.error?.message || `HTTP ${response.status}: Upload failed`);
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Upload file error:', error);
    throw new Error(error.message || 'Network error during file upload');
  }
};

// Upload text (JSON)
export const uploadText = async (data) => {
  try {
    console.log('Calling API:', `${API_BASE}/upload`);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: `HTTP ${response.status}: Upload failed` } 
      }));
      throw new Error(error.error?.message || `HTTP ${response.status}: Upload failed`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  } catch (error) {
    console.error('Upload text error:', error);
    throw new Error(error.message || 'Network error during text upload');
  }
};

// Analyze uploaded data
export const analyzeUpload = async (uploadId, questionnaire) => {
  try {
    console.log('Calling API:', `${API_BASE}/analyze`);
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uploadId, questionnaire })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: `HTTP ${response.status}: Analysis failed` } 
      }));
      throw new Error(error.error?.message || `HTTP ${response.status}: Analysis failed`);
    }

    return response.json();
  } catch (error) {
    console.error('Analyze error:', error);
    throw new Error(error.message || 'Network error during analysis');
  }
};

// Get report by ID
export const getReport = async (reportId) => {
  try {
    const response = await fetch(`${API_BASE}/report/${reportId}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: 'Report not found' } 
      }));
      throw new Error(error.error?.message || `HTTP ${response.status}: Report not found`);
    }

    return response.json();
  } catch (error) {
    console.error('Get report error:', error);
    throw new Error(error.message || 'Network error fetching report');
  }
};

// Get recent reports (P1 feature)
export const getRecentReports = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE}/reports?limit=${limit}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: 'Failed to fetch reports' } 
      }));
      throw new Error(error.error?.message || `HTTP ${response.status}: Failed to fetch reports`);
    }

    return response.json();
  } catch (error) {
    console.error('Get recent reports error:', error);
    throw new Error(error.message || 'Network error fetching reports');
  }
};

// ✅ FIXED: Health check also uses port 5000
export const checkHealth = async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    if (!response.ok) {
      throw new Error('Server not healthy');
    }
    return response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw new Error('Server connection failed');
  }
};

export default {
  uploadFile,
  uploadText,
  analyzeUpload,
  getReport,
  getRecentReports,
  checkHealth
};
