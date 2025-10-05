const leven = require('leven'); // Levenshtein distance

const GETS_SCHEMA = {
  'invoice.id': { type: 'text', required: true, category: 'header' },
  'invoice.issue_date': { type: 'date', required: true, category: 'header' },
  'invoice.currency': { type: 'text', required: true, category: 'header' },
  'invoice.total_excl_vat': { type: 'number', required: true, category: 'header' },
  'invoice.vat_amount': { type: 'number', required: true, category: 'header' },
  'invoice.total_incl_vat': { type: 'number', required: true, category: 'header' },
  'seller.name': { type: 'text', required: true, category: 'seller' },
  'seller.trn': { type: 'text', required: true, category: 'seller' },
  'seller.country': { type: 'text', required: true, category: 'seller' },
  'seller.city': { type: 'text', required: false, category: 'seller' },
  'buyer.name': { type: 'text', required: true, category: 'buyer' },
  'buyer.trn': { type: 'text', required: true, category: 'buyer' },
  'buyer.country': { type: 'text', required: true, category: 'buyer' },
  'buyer.city': { type: 'text', required: false, category: 'buyer' },
  'lines.sku': { type: 'text', required: false, category: 'lines' },
  'lines.description': { type: 'text', required: false, category: 'lines' },
  'lines.qty': { type: 'number', required: true, category: 'lines' },
  'lines.unit_price': { type: 'number', required: true, category: 'lines' },
  'lines.line_total': { type: 'number', required: true, category: 'lines' }
};

class DetectionService {
  detectFields(parsedData) {
    if (!parsedData || parsedData.length === 0) {
      return { matched: [], close: [], missing: Object.keys(GETS_SCHEMA) };
    }

    const sourceFields = Object.keys(parsedData[0]);
    const matched = [];
    const close = [];
    const missing = [];

    for (const [targetField, schema] of Object.entries(GETS_SCHEMA)) {
      let bestMatch = null;
      let bestScore = 0;

      for (const sourceField of sourceFields) {
        const score = this.calculateSimilarity(sourceField, targetField, parsedData, schema.type);
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = sourceField;
        }
      }

      if (bestScore >= 0.9) {
        matched.push({ target: targetField, source: bestMatch });
      } else if (bestScore >= 0.6) {
        close.push({
          target: targetField,
          candidate: bestMatch,
          confidence: Math.round(bestScore * 100) / 100
        });
      } else {
        missing.push(targetField);
      }
    }

    return { matched, close, missing };
  }

  calculateSimilarity(sourceField, targetField, data, expectedType) {
    const normalizedSource = this.normalizeFieldName(sourceField);
    const normalizedTarget = this.normalizeFieldName(targetField);

    // Check for exact match
    if (normalizedSource === normalizedTarget) {
      return 1.0;
    }

    // Check if one contains the other
    const shortPath = targetField.split('.').pop();
    const normalizedShort = this.normalizeFieldName(shortPath);
    
    if (normalizedSource === normalizedShort || normalizedSource.includes(normalizedShort)) {
      if (this.checkTypeCompatibility(data, sourceField, expectedType)) {
        return 0.95;
      }
    }

    // Levenshtein distance based similarity
    const distance = leven(normalizedSource, normalizedTarget);
    const maxLength = Math.max(normalizedSource.length, normalizedTarget.length);
    const similarity = 1 - (distance / maxLength);

    // Type compatibility bonus
    if (similarity > 0.5 && this.checkTypeCompatibility(data, sourceField, expectedType)) {
      return Math.min(similarity + 0.2, 0.89);
    }

    return similarity;
  }

  normalizeFieldName(field) {
    return field.toLowerCase()
      .replace(/[_\s-]/g, '')
      .replace(/\./g, '');
  }

  checkTypeCompatibility(data, fieldName, expectedType) {
    const sampleSize = Math.min(10, data.length);
    let compatibleCount = 0;

    for (let i = 0; i < sampleSize; i++) {
      const value = data[i][fieldName];
      const actualType = this.inferType(value);

      if (actualType === expectedType || actualType === 'empty') {
        compatibleCount++;
      }
    }

    return (compatibleCount / sampleSize) >= 0.7;
  }

  inferType(value) {
    if (value === null || value === undefined || value === '') {
      return 'empty';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    if (this.isISODate(value)) {
      return 'date';
    }
    return 'text';
  }

  isISODate(str) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return isoDateRegex.test(str);
  }

  getFieldMapping(coverage) {
    const mapping = {};
    coverage.matched.forEach(m => {
      mapping[m.source] = m.target;
    });
    return mapping;
  }
}

module.exports = new DetectionService();
