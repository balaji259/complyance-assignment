const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  uploadId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  country: String,
  erp: String,
  rowsParsed: Number,
  rawData: mongoose.Schema.Types.Mixed,
  piiMasked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days TTL
  }
});

module.exports = mongoose.model('Upload', uploadSchema);
