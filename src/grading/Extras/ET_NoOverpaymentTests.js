NoOverpaymentTests = {
    Check: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You have no data`;
        } else {
            let balancesAfterFormula = cbotTestSheet
                .getRange(CBOT_MIN_PAYMENT_FORMULA_CELL)
                .getFormula();

            if (balancesAfterFormula === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Cell ${CBOT_MIN_PAYMENT_FORMULA_CELL} is a hard-coded value. Use a formula.`;
            } else {
                try {
                    cbotTestSheet
                        .getRange(CBOT_MIN_PAYMENT_FORMULA_CELL)
                        .autoFill(cbotTestSheet.getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1),
                            SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
                } catch (e) {
                    result = false;
                    errBuffer += `\n\t\t\tERROR: Unpaid balance formula inconsistent or incorrect;`
                        + `\n\t\t\t       Please check formula in ${CBOT_MIN_PAYMENT_FORMULA_CELL} and drag down again.`;
                } finally {
                    let lastUnpaidBalanceCell = cbotTestSheet
                        .getRange(CardBalanceOverTimeTests.numRows, 2, 1, 1);
                    let lastMinPaymentCell = cbotTestSheet
                        .getRange(CardBalanceOverTimeTests.numRows, 3, 1, 1);

                    let originalUnpaidBalance = lastMinPaymentCell
                        .getValue();

                    lastUnpaidBalanceCell
                        .setValue(1000);
                    let highTestVal = lastMinPaymentCell
                        .getValue();

                    lastUnpaidBalanceCell
                        .setValue(500);
                    let midTestVal = lastMinPaymentCell
                        .getValue();

                    let lowVal = originalUnpaidBalance < CBOT_MIN_PAYMENT_AMOUNT ? originalUnpaidBalance / 1.5 : 1 + Math.random();
                    lastUnpaidBalanceCell
                        .setValue(lowVal);
                    let lowTestVal = lastMinPaymentCell
                        .getValue();

                    if (Math.abs(highTestVal - CBOT_MIN_PAYMENT_PERCENTAGE * 1000) > TOLERANCE) {
                        result = false;
                        errBuffer += `\n\t\t\tERROR: Minimum payment formula in ${CBOT_MIN_PAYMENT_FORMULA_CELL} should return ${Utils.asMoney(CBOT_MIN_PAYMENT_PERCENTAGE * 1000)}`
                            + `\n\t\t\t      for an unpaid balance of ${Utils.asMoney(1000)}, but instead got ${highTestVal}`;
                    }

                    if (Math.abs(midTestVal - CBOT_MIN_PAYMENT_AMOUNT) > TOLERANCE) {
                        result = false;
                        errBuffer += `\n\t\t\tERROR: Minimum payment formula in ${CBOT_MIN_PAYMENT_FORMULA_CELL} should return ${Utils.asMoney(CBOT_MIN_PAYMENT_AMOUNT)}`
                            + `\n\t\t\t      for an unpaid balance of ${Utils.asMoney(500)}, but instead got ${midTestVal}`;
                    }

                    if (Math.abs(lowTestVal - lowVal) > TOLERANCE) {
                        result = false;
                        errBuffer += `\n\t\t\tERROR: Minimum payment formula in ${CBOT_MIN_PAYMENT_FORMULA_CELL} should return ${Utils.asMoney(lowVal)}`
                            + `\n\t\t\t      for an unpaid balance of ${Utils.asMoney(lowVal)}, but instead got ${Utils.asMoney(lowTestVal)}`;
                    }
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does a single minimum payment formula correctly adjust when`
            + `\n\t\t      the unpaid balance is less than ${CBOT_MIN_PAYMENT_AMOUNT}?`
        student.logFeedback(message + errBuffer);
        return result;
    }
}