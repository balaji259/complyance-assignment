const { nanoid } = require('nanoid');
const Upload = require('../models/upload');
const parserService = require('../services/parserService');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['text/csv', 'application/json', 'text/plain'];
    if (allowedMimes.includes(file.mimetype) || 
        file.originalname.match(/\.(csv|json)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and JSON allowed.'));
    }
  }
}).single('file');

exports.uploadMiddleware = upload;

exports.uploadFile = async (req, res, next) => {
  try {
    let parsedData;
    let country = req.body.country || '';
    let erp = req.body.erp || '';

    // Handle file upload or text input
    if (req.file) {
      const text = req.file.buffer.toString('utf-8');
      const format = req.file.originalname.endsWith('.json') ? 'json' : 'csv';
      parsedData = parserService.parseData(text, format);
    } else if (req.body.text) {
      parsedData = parserService.parseData(req.body.text);
      country = req.body.country || '';
      erp = req.body.erp || '';
    } else {
      return res.status(400).json({
        error: { message: 'No file or text provided', status: 400 }
      });
    }

    // Generate upload ID
    const uploadId = `u_${nanoid(10)}`;

    // Save to database
    const uploadDoc = new Upload({
      uploadId,
      country,
      erp,
      rowsParsed: parsedData.length,
      rawData: parsedData,
      piiMasked: false
    });

    await uploadDoc.save();

    res.json({ uploadId });
  } catch (error) {
    next(error);
  }
};
