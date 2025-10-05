const { nanoid } = require('nanoid');
const Upload = require('../models/upload');
const Report = require('../models/report');
const detectionService = require('../services/detectionService');
const rulesEngine = require('../services/rulesEngine');
const scoringService = require('../services/scoringService');

exports.analyzeUpload = async (req, res, next) => {
  try {
    const { uploadId, questionnaire } = req.body;

    if (!uploadId) {
      return res.status(400).json({
        error: { message: 'uploadId is required', status: 400 }
      });
    }

    // Retrieve upload from database
    const upload = await Upload.findOne({ uploadId });
    
    if (!upload) {
      return res.status(404).json({
        error: { message: 'Upload not found', status: 404 }
      });
    }

    const parsedData = upload.rawData;

    // Start analysis
    const startTime = Date.now();

    // 1. Field detection
    const coverage = detectionService.detectFields(parsedData);
    const fieldMapping = detectionService.getFieldMapping(coverage);

    // 2. Run rules
    const ruleFindings = rulesEngine.runAllRules(parsedData, fieldMapping);

    // 3. Calculate scores
    const scores = scoringService.calculateScores(
      parsedData,
      coverage,
      ruleFindings,
      questionnaire
    );

    // 4. Generate gaps summary
    const gaps = this.generateGaps(coverage, ruleFindings);

    // 5. Count line items
    const linesTotal = this.countLines(parsedData, fieldMapping);

    // Create report
    const reportId = `r_${nanoid(10)}`;
    const reportJson = {
      reportId,
      scores,
      coverage: {
        matched: coverage.matched.map(m => m.target),
        close: coverage.close,
        missing: coverage.missing
      },
      ruleFindings,
      gaps,
      meta: {
        rowsParsed: parsedData.length,
        linesTotal,
        country: upload.country,
        erp: upload.erp,
        db: 'mongodb',
        analysisTime: `${Date.now() - startTime}ms`,
        readinessLabel: scoringService.getReadinessLabel(scores.overall)
      }
    };

    // Save report to database
    const reportDoc = new Report({
      reportId,
      uploadId,
      scoresOverall: scores.overall,
      reportJson
    });

    await reportDoc.save();

    res.json(reportJson);
  } catch (error) {
    next(error);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findOne({ reportId });

    if (!report) {
      return res.status(404).json({
        error: { message: 'Report not found', status: 404 }
      });
    }

    res.json(report.reportJson);
  } catch (error) {
    next(error);
  }
};

exports.getRecentReports = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('reportId scoresOverall createdAt');

    const summaries = reports.map(r => ({
      reportId: r.reportId,
      overallScore: r.scoresOverall,
      date: r.createdAt
    }));

    res.json({ reports: summaries });
  } catch (error) {
    next(error);
  }
};

exports.generateGaps = function(coverage, ruleFindings) {
  const gaps = [];

  // Add missing fields
  coverage.missing.slice(0, 5).forEach(field => {
    gaps.push(`Missing ${field}`);
  });

  // Add failed rules
  ruleFindings.forEach(finding => {
    if (!finding.ok) {
      if (finding.rule === 'CURRENCY_ALLOWED' && finding.value) {
        gaps.push(`Invalid currency: ${finding.value}`);
      } else if (finding.rule === 'DATE_ISO' && finding.value) {
        gaps.push(`Invalid date format: ${finding.value}`);
      } else if (finding.rule === 'LINE_MATH') {
        gaps.push(`Line calculation errors detected`);
      } else if (finding.rule === 'TOTALS_BALANCE') {
        gaps.push(`Invoice total balance errors`);
      } else if (finding.rule === 'TRN_PRESENT') {
        gaps.push(`Missing TRN values`);
      }
    }
  });

  return gaps;
};

exports.countLines = function(data, fieldMapping) {
  // Count rows that have line item data
  let count = 0;
  data.forEach(row => {
    const hasLineData = Object.keys(fieldMapping).some(source => {
      const target = fieldMapping[source];
      return target.startsWith('lines.') && row[source] !== undefined;
    });
    if (hasLineData) count++;
  });
  return count;
};
