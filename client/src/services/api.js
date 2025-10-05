import api from '../axiosConfig';

// Upload file (multipart form data)
export const uploadFile = async (formData) => {
  try {
    console.log('Calling API: /upload');
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload file error:', error);
    const message = error.response?.data?.error?.message || error.message || 'Network error during file upload';
    throw new Error(message);
  }
};

// Upload text (JSON)
export const uploadText = async (data) => {
  try {
    console.log('Calling API: /upload');
    const response = await api.post('/upload', data);

    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload text error:', error);
    const message = error.response?.data?.error?.message || error.message || 'Network error during text upload';
    throw new Error(message);
  }
};

// Analyze uploaded data
export const analyzeUpload = async (uploadId, questionnaire) => {
  try {
    console.log('Calling API: /analyze');
    const response = await api.post('/analyze', { 
      uploadId, 
      questionnaire 
    });

    return response.data;
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error.response?.data?.error?.message || error.message || 'Network error during analysis';
    throw new Error(message);
  }
};

// Get report by ID
export const getReport = async (reportId) => {
  try {
    const response = await api.get(`/report/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Get report error:', error);
    const message = error.response?.data?.error?.message || error.message || 'Network error fetching report';
    throw new Error(message);
  }
};

// Get recent reports (P1 feature)
export const getRecentReports = async (limit = 10) => {
  try {
    const response = await api.get('/reports', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get recent reports error:', error);
    const message = error.response?.data?.error?.message || error.message || 'Network error fetching reports';
    throw new Error(message);
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
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
