const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const analyzeController = require('../controllers/analyzeController');

// Upload endpoint
router.post('/upload', 
  uploadController.uploadMiddleware, 
  uploadController.uploadFile
);

// Analyze endpoint
router.post('/analyze', analyzeController.analyzeUpload);

// Get report by ID
router.get('/report/:reportId', analyzeController.getReport);

// Get recent reports (P1)
router.get('/reports', analyzeController.getRecentReports);

module.exports = router;
