SummaryStatsTests = {
    /**
    * Checks if the headings are present and spelled correctly
    * @param {Student} student
    * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
    * @returns {bool}
    */
    CheckHeadings: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        const HEADINGS = [
            'apr',
            'minimumpaymentpercentage',
            'minimummonthlypayment',
            '',
            'monthsspentinrepayment',
            'totalamountpaid',
            'totalinterestpaid',
            'effectiveinterestrate'];

        let cellNames = Utils
            .createZippedTwoArray(1, 7, 8, 1)
            .flat();

        let headings = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getValues()
            .flat()
            .map(h => String(h).toLowerCase().replaceAll(/\s/gi, ''));

        let problematicHeadings = Utils
            .createZippedThreeArrayFlat(cellNames, HEADINGS, headings)
            .filter(([_name, expected, actual]) => expected !== actual);

        if (problematicHeadings.length > 0) {
            result = false;
            problematicHeadings.forEach(([name, _expected, _actual]) => {
                errBuffer += `\n\t\t\tERROR: Cell ${cell} is incorrectly labeled`
                    + `\n\t\t\t       Did you make a typo?`
            })
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are the summary stat headings correct?`
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
    * Checks if the column headings are all bolded
    * @param {Student} student
    * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
    * @returns {bool}
    */
    CheckHeadersBolded: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let fontWeights = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getFontWeights();
        let headerRowsCellNames = Utils.createCellNameArray(1, 7, 8, 1);
        let zippedArray = Utils
            .createZippedTwoArray(headerRowsCellNames, fontWeights)
            .map(([row]) => row)
            .filter((_arr, index) => index != 3);

        let problemCells = zippedArray.filter(([_, weight]) => weight != 'bold');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: You didn't bold the header in cell ${cell}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you make the column headings bold?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks that the column headings are aligned center. 
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
     * @returns {bool}
     */
    CheckHeadersCentered: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let alignments = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getHorizontalAlignments();
        let headerRowsCellNames = Utils.createCellNameArray(1, 7, 8, 1);
        let zippedArray = Utils
            .createZippedTwoArray(headerRowsCellNames, alignments)
            .map(([row]) => row)
            .filter((_arr, index) => index != 3);

        let problemCells = zippedArray.filter(([_, weight]) => weight != 'center');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: The header in cell ${cell} is not aligned center`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are the column headings aligned center?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the student changed the background color on the title row
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
     * @returns {bool}
     */
    CheckBackgroundColor: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let backgroundColors = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getBackgrounds();
        let headerRowsCellNames = Utils.createCellNameArray(1, 7, 8, 1);

        let zippedArray = Utils
            .createZippedTwoArray(headerRowsCellNames, backgroundColors)
            .map(([row]) => row)
            .filter((_arr, index) => index != 3);

        let problemCells = zippedArray.filter(([_, color]) => color == '#ffffff');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: You haven't changed the background color in cell ${cell}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you change the background color in the header column?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckMonthsInRepayment: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`
        } else {
            let monthsCell = cbotTestSheet
                .getRange(CBOT_MONTHS_REPAYMENT_CELL);

            if (monthsCell.getValue() != CardBalanceOverTimeTests.numRows - 1) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Months in repayment is incorrect`;
            } else if (String(monthsCell.getFormula()) === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Months in repayment is not calculated with a formula`;
            } else {
                // do nothing, you're good
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are Months in Repayment calculated correctly with a valid`
            + `\n\t\t      formula?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckTotalAmountPaid: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`
        } else {
            let totalAmountCell = cbotTestSheet
                .getRange(CBOT_TOTAL_AMT_PAID_CELL);
            let totalAmount = totalAmountCell
                .getValue();

            let expectedTotalVer1 = cbotTestSheet
                .getRange(CardBalanceOverTimeTests.numRows, 5, 1, 1)
                .getValue();

            let expectedTotalVer2 = cbotTestSheet
                .getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat()
                .reduce((acc, val) => acc + val, 0);

            if (Math.abs(totalAmount - expectedTotalVer1) > TOLERANCE) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Total Amount doesn't match last entry in Col E`;
            } else if (Math.abs(totalAmount - expectedTotalVer2) > TOLERANCE) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Total Amount doesn't match sum of payments in Col C`;
            } else if (String(totalAmountCell.getFormula()) === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Total Amount is not calculated with a formula`;
            } else {
                // do nothing, you're good
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is Total Amount calculated correctly with a valid formula?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckTotalInterest: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`
        } else {
            let totalInterestCell = cbotTestSheet
                .getRange(CBOT_TOTAL_INTEREST_CELL);
            let actualTotalInterest = totalInterestCell
                .getValue();

            let totalPaid = cbotTestSheet
                .getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat()
                .reduce((acc, val) => acc + val, 0);

            let amazonTotal = cbotTestSheet
                .getRange(CBOT_AMAZON_TOTAL_CELL)
                .getValue();

            if (Math.abs(actualTotalInterest - (totalPaid - amazonTotal)) > TOLERANCE) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Total Interest incorrect, got ${Utils.asMoney(actualTotalInterest)}`
                    + `\n\t\t\t      epected ${Utils.asMoney(totalPaid - amazonTotal)}`;
            } else if (String(totalInterestCell.getFormula()) === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Total Amount is not calculated with a formula`;
            } else {
                // do nothing, you're good
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is Total Interest calculated correctly with a valid formula?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckEffectiveInterest: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`
        } else {
            let effectiveInterestCell = cbotTestSheet
                .getRange(CBOT_EFFECTIVE_INTEREST_CELL);
            let actualEffectiveInterest = effectiveInterestCell
                .getValue();

            let totalPaid = cbotTestSheet
                .getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat()
                .reduce((acc, val) => acc + val, 0);

            let amazonTotal = cbotTestSheet
                .getRange(CBOT_AMAZON_TOTAL_CELL)
                .getValue();

            let expectedEffectiveInterest = (totalPaid - amazonTotal) / amazonTotal;

            if (Math.abs(actualEffectiveInterest - expectedEffectiveInterest) > TOLERANCE) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Effective Interest incorrect, got ${Utils.asPercent(actualEffectiveInterest)}`
                    + `\n\t\t\t      epected ${Utils.asPercent(expectedEffectiveInterest)}`;
            } else if (String(effectiveInterestCell.getFormula()) === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Effective Interest is not calculated with a formula`;
            } else {
                // do nothing, you're good
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is Effective Interest calculated correctly with a valid`
            + `\n\t\t     formula?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}