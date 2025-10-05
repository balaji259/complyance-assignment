const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  uploadId: {
    type: String,
    required: true,
    ref: 'Upload'
  },
  scoresOverall: Number,
  reportJson: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days TTL
  }
});

module.exports = mongoose.model('Report', reportSchema);
