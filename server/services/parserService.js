const Papa = require('papaparse');

class ParserService {
  parseData(text, format) {
    try {
      if (format === 'json' || this.isJSON(text)) {
        return this.parseJSON(text);
      } else {
        return this.parseCSV(text);
      }
    } catch (error) {
      throw new Error(`Parsing failed: ${error.message}`);
    }
  }

  isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  parseJSON(text) {
    const data = JSON.parse(text);
    const rows = Array.isArray(data) ? data : [data];
    return rows.slice(0, 200); // Limit to 200 rows
  }

  parseCSV(text) {
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim()
    });

    if (result.errors.length > 0) {
      console.warn('CSV parsing warnings:', result.errors);
    }

    return result.data.slice(0, 200); // Limit to 200 rows
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
}

module.exports = new ParserService();
