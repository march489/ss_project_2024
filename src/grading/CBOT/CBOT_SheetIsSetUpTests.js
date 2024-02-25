SheetIsSetUpTests = {
    /**
     * Checks whether the student's column heading are correct, and if 
     * they're spelled correctly
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckHeaderLabels: function (student, cbotTestSheet) {
        // do some set up
        CardBalanceOverTimeTests.numRows = cbotTestSheet
            .getRange(CBOT_DATA_RANGE_START_CELL)
            .getDataRegion()
            .getDisplayValues()
            .map(row => row.filter(String))
            .filter(String)
            .length;

        // if (CardBalanceOverTimeTests.numRows <= 1) {
        //     CardBalanceOverTimeTests.validData = false;
        // } else {
        //     CardBalanceOverTimeTests.validData = true;
        //     CardBalanceOverTimeTests.unpaidBalances = cbotTestSheet
        //         .getRange(2, 2, CardBalanceOverTimeTests.numRows - 1, 1)
        //         .getValues()
        //         .flat();
        //     CardBalanceOverTimeTests.minPayments = cbotTestSheet
        //         .getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
        //         .getValues()
        //         .flat();
        //     CardBalanceOverTimeTests.balancesAfter = cbotTestSheet
        //         .getRange(2, 4, CardBalanceOverTimeTests.numRows - 1, 1)
        //         .getValues()
        //         .flat();
        //     CardBalanceOverTimeTests.totalstd = cbotTestSheet
        //         .getRange(2, 5, CardBalanceOverTimeTests.numRows - 1, 1)
        //         .getValues()
        //         .flat();
        // }

        // now the real test
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows == 0) {
            result = false;
            errBuffer += '\n\t\t\tERROR: You have no data';
        } else {
            // check headings
            const REFERENCE_HEADINGS = [
                CBOT_DATE_LABEL,
                CBOT_UNPAID_BALANCE_LABEL,
                CBOT_MIN_PAYMENT_LABEL,
                CBOT_BALANCE_AFTER_LABEL,
                CBOT_TOTAL_PAID_TD_LABEL];

            let titleRowHeadings = cbotTestSheet
                .getRange(CBOT_HEADER_RANGE)
                .getValues()
                .flat()
                .map(s => String(s).toLowerCase())
                .map(s => s.replaceAll(/\s/gi, ''));

            let headerCellNames = Utils
                .createCellNameArray(1, 1, 1, 5)[0];
            let zippedArray = Utils
                .createZippedThreeArrayFlat(headerCellNames, titleRowHeadings, REFERENCE_HEADINGS);

            let problematicCells = zippedArray
                .filter(([_c, actual, expected]) => actual !== expected);

            if (problematicCells.length > 0) {
                result = false;
                problematicCells.forEach(([cell, _0, _1]) => {
                    errBuffer += `\n\t\t\tERROR: The heading in ${cell} is either blank or incorrect.`
                        + `\n\t\t\t       Did you make a typo?`;
                });
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you enter the correct headings`
            + `\n\t\t      and check the spelling?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the student changed the background color on the title row
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckBackgroundColor: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let backgroundColors = cbotTestSheet
            .getRange(CBOT_HEADER_RANGE)
            .getBackgrounds();
        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 5);
        let zippedArray = Utils.createZippedTwoArray(headerRowsCellNames, backgroundColors);

        let [row] = zippedArray;    // TODO fix needless destructuring
        let problemCells = row.filter(([_, color]) => color == '#ffffff');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: You haven't changed the background color in cell ${cell}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you change the background color on the header row?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks if the column headings are all bolded
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckHeadersBolded: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let fontWeights = cbotTestSheet
            .getRange(CBOT_HEADER_RANGE)
            .getFontWeights();
        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 5);
        let zippedArray = Utils.createZippedTwoArray(headerRowsCellNames, fontWeights);

        let [row] = zippedArray;    // TODO fix needless destructuring
        let problemCells = row.filter(([_, weight]) => weight != 'bold');

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
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckHeadersCentered: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let alignments = cbotTestSheet
            .getRange(CBOT_HEADER_RANGE)
            .getHorizontalAlignments();
        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 5);
        let zippedArray = Utils.createZippedTwoArray(headerRowsCellNames, alignments);

        let [row] = zippedArray;    // TODO fix needless destructuring
        let problemCells = row.filter(([_, weight]) => weight != 'center');

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
  * Checks that all of the statement dates in Column A are written in 
  * a valid date format, and that a single date format is used consistently
  * for the entire column. 
  * @param {Student} student 
  * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet 
  * @returns {bool} -- Are the dates valid and consistent?
  */
    CheckDates: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer = '\n\t\t\tERROR: You have no data';
        } else {
            const isValidDate = (d) => {
                if (Object.prototype.toString.call(d) != '[object Date]') {
                    return false;
                } else {
                    return !isNaN(d.getTime());
                }
            };

            let dateRange = cbotTestSheet
                .getRange(2, 1, CardBalanceOverTimeTests.numRows - 1, 1);
            let valueMatrix = dateRange.getValues();
            let formatMatrix = dateRange.getNumberFormats();
            let cellNameMatrix = Utils.createCellNameArray(2, 1, CardBalanceOverTimeTests.numRows - 1, 1);

            let zippedArray = Utils
                .createZippedThreeArrayNested(cellNameMatrix, valueMatrix, formatMatrix)
                .map(([row]) => row);

            let invalidDates = zippedArray
                .filter(([_c, date, _f]) => !isValidDate(date));

            if (invalidDates.length > 0) {
                result = false;
                invalidDates.forEach(([name, _d, _f]) => {
                    errBuffer += `\n\t\t\tERROR: Cell ${name} has an invalid date`;
                });
            }

            let validDates = zippedArray
                .filter(([_c, date, _f]) => isValidDate(date));

            if (validDates.length > 1) {
                let firstValidDateCell = validDates[0][0];
                let defaultFormat = validDates[0][2].toLowerCase();
                let datesWithOtherFormats = validDates
                    .filter(([_c, _d, format]) => format.toLowerCase() !== defaultFormat);

                if (datesWithOtherFormats.length > 0) {
                    result = false;
                    datesWithOtherFormats.forEach(([cell, _d, format]) => {
                        errBuffer += `\n\t\t\tERROR: ${firstValidDateCell} uses the format ${defaultFormat}, while ${cell} uses ${format}`;
                    })
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you enter valid dates in Column A, and did you use`
            + "\n\t\t      a single, consist format for all of your dates?";
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the currency values in the unit prices (col E)
     * and subtotals (Col G) columns are formatted correctly.
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet 
     * @returns {bool} -- are all currency values formatted correctly?
     */
    CheckCurrency: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {
            // check all prices in Cols B thru E
            let moneyColumns = cbotTestSheet
                .getRange(2, 2, CardBalanceOverTimeTests.numRows - 1, 4)
                .getNumberFormats();
            let cellNames = Utils
                .createCellNameArray(2, 2, CardBalanceOverTimeTests.numRows - 1, 4);
            let badlyFormattedCells = Utils
                .createZippedTwoArray(cellNames, moneyColumns)
                .map(([row]) => row)
                .filter(([_cell, format]) => format !== '"$"#,##0.00');

            if (badlyFormattedCells.length > 0) {
                result = false;
                badlyFormattedUnitPrices.forEach(([cell, _f]) => {
                    errBuffer += `\n\t\t\tERROR: The unit price in cell ${cell} is not formatted correctly`;
                });
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are all monetary values formatted as currency`
            + `\n\t\t      with two decimal places?`;

        student.logFeedback(message + errBuffer);
        return result;
    },
}