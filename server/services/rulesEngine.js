class RulesEngine {
  runAllRules(parsedData, fieldMapping) {
    return [
      this.checkTotalsBalance(parsedData, fieldMapping),
      this.checkLineMath(parsedData, fieldMapping),
      this.checkDateISO(parsedData, fieldMapping),
      this.checkCurrencyAllowed(parsedData, fieldMapping),
      this.checkTRNPresent(parsedData, fieldMapping)
    ];
  }

  getField(row, fieldMapping, target) {
    const source = Object.keys(fieldMapping).find(k => fieldMapping[k] === target);
    return source ? row[source] : undefined;
  }

  checkTotalsBalance(data, fieldMapping) {
    let passCount = 0;
    let failCount = 0;
    let exampleFail = null;

    data.forEach((row, idx) => {
      const totalExcl = this.getField(row, fieldMapping, 'invoice.total_excl_vat');
      const vatAmount = this.getField(row, fieldMapping, 'invoice.vat_amount');
      const totalIncl = this.getField(row, fieldMapping, 'invoice.total_incl_vat');

      if (totalExcl !== undefined && vatAmount !== undefined && totalIncl !== undefined) {
        const calculated = Number(totalExcl) + Number(vatAmount);
        const actual = Number(totalIncl);
        const diff = Math.abs(calculated - actual);

        if (diff <= 0.01) {
          passCount++;
        } else {
          failCount++;
          if (!exampleFail) {
            exampleFail = {
              row: idx + 1,
              expected: calculated,
              got: actual
            };
          }
        }
      }
    });

    return {
      rule: 'TOTALS_BALANCE',
      ok: failCount === 0 && passCount > 0,
      ...(exampleFail && { 
        expected: exampleFail.expected,
        got: exampleFail.got,
        exampleRow: exampleFail.row
      })
    };
  }

  checkLineMath(data, fieldMapping) {
    let passCount = 0;
    let failCount = 0;
    let exampleFail = null;

    data.forEach((row, idx) => {
      const qty = this.getField(row, fieldMapping, 'lines.qty');
      const unitPrice = this.getField(row, fieldMapping, 'lines.unit_price');
      const lineTotal = this.getField(row, fieldMapping, 'lines.line_total');

      if (qty !== undefined && unitPrice !== undefined && lineTotal !== undefined) {
        const calculated = Number(qty) * Number(unitPrice);
        const actual = Number(lineTotal);
        const diff = Math.abs(calculated - actual);

        if (diff <= 0.01) {
          passCount++;
        } else {
          failCount++;
          if (!exampleFail) {
            exampleFail = {
              row: idx + 1,
              expected: calculated,
              got: actual
            };
          }
        }
      }
    });

    return {
      rule: 'LINE_MATH',
      ok: failCount === 0 && passCount > 0,
      ...(exampleFail && {
        exampleLine: exampleFail.row,
        expected: exampleFail.expected,
        got: exampleFail.got
      })
    };
  }

  checkDateISO(data, fieldMapping) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let invalidDates = [];

    data.forEach((row, idx) => {
      const issueDate = this.getField(row, fieldMapping, 'invoice.issue_date');
      if (issueDate && !isoDateRegex.test(String(issueDate))) {
        invalidDates.push({ row: idx + 1, value: issueDate });
      }
    });

    return {
      rule: 'DATE_ISO',
      ok: invalidDates.length === 0,
      ...(invalidDates.length > 0 && {
        value: invalidDates[0].value,
        exampleRow: invalidDates[0].row
      })
    };
  }

  checkCurrencyAllowed(data, fieldMapping) {
    const allowedCurrencies = ['AED', 'SAR', 'MYR', 'USD'];
    let invalidCurrencies = [];

    data.forEach((row, idx) => {
      const currency = this.getField(row, fieldMapping, 'invoice.currency');
      if (currency && !allowedCurrencies.includes(String(currency).toUpperCase())) {
        invalidCurrencies.push({ row: idx + 1, value: currency });
      }
    });

    return {
      rule: 'CURRENCY_ALLOWED',
      ok: invalidCurrencies.length === 0,
      ...(invalidCurrencies.length > 0 && {
        value: invalidCurrencies[0].value,
        exampleRow: invalidCurrencies[0].row
      })
    };
  }

  checkTRNPresent(data, fieldMapping) {
    let missingCount = 0;

    data.forEach(row => {
      const buyerTRN = this.getField(row, fieldMapping, 'buyer.trn');
      const sellerTRN = this.getField(row, fieldMapping, 'seller.trn');

      if (!buyerTRN || !sellerTRN || 
          String(buyerTRN).trim() === '' || 
          String(sellerTRN).trim() === '') {
        missingCount++;
      }
    });

    return {
      rule: 'TRN_PRESENT',
      ok: missingCount === 0,
      ...(missingCount > 0 && {
        missingCount
      })
    };
  }
}

module.exports = new RulesEngine();
