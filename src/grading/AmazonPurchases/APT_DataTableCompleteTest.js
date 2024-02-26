APTDataTableCompleteTests = {
    /**
     * Reads the data table from the AmazonPurchases sheet, and gets the number 
     * of valid rows (i.e. the number of rows with at least one nonempty value
     * that is connected to cell A2). Returns true if there are at least 10 rows
     * of data beyond the header row (row 1).
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} --  does the data table have at least 10 valid rows?
     */
    CheckDimensions: function (student, amazonPurchasesTestSheet) {
        APTDataTableCompleteTests.numRows = amazonPurchasesTestSheet
            .getRange(AMAZON_DATA_RANGE_START_CELL)
            .getDataRegion()
            .getValues()
            .map(row => row.filter(String))
            .filter(String)
            .length;

        let result = APTDataTableCompleteTests.numRows > 10;
        let errBuffer = "";

        if (!result) {
            errBuffer += `\n\t\t\tERROR: Expected at least 10 rows of data, but you have ` 
                + `${APTDataTableCompleteTests.numRows - 1} ${APTDataTableCompleteTests.numRows - 1 == 1 ? "row" : "rows"}`;
        }
        let message = `\t\t${result ? "PASS" : "FAIL"}: Do you have at least 10 rows of data in your table,`
            + `\n\t\t      excluding headers?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Makes sure the data table has no gaps or empty cells where there should be data.
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} - does every valid row of the table have all seven columns filled in?
     */
    CheckNoNonemptyCells: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {
            let valueMatrix = amazonPurchasesTestSheet
                .getRange(AMAZON_DATA_RANGE_START_CELL)
                .getDataRegion()
                .getValues()
                .slice(0, APTDataTableCompleteTests.numRows)
                .map(row => row.slice(0, 7));

            valueMatrix.shift();    // removes header row

            let cellNameMatrix = Utils.createCellNameArray(2, 1, APTDataTableCompleteTests.numRows - 1, 7);
            let zippedArray = Utils.createZippedTwoArray(cellNameMatrix, valueMatrix);
            let emptyCells = zippedArray
                .map(row => row.filter(([_, val]) => String(val) === "").map(([cell, _]) => cell))
                .flat();

            if (emptyCells.length > 1) {
                result = false;
                errBuffer = `\n\t\t\tERROR: The following cells are missing data: ${emptyCells.join(", ")}`;
            }
        }

        let message = `\t\t${result ? "PASS" : "FAIL"}: Is the data table completely filled in with no empty cells?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks that all of the hyperlinks in column B are correctly formatted,
     * meaning: Do all of the hyperlink texts read "Link", and is the hyperlink created using 
     * =HYPERLINK()?
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- are all of the hyperlinks correctly formatted?
     */
    CheckHyperlinks: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {

            let hyperlinkRange = amazonPurchasesTestSheet
                .getRange(2, 2, APTDataTableCompleteTests.numRows - 1, 1);

            let valueMatrix = hyperlinkRange.getValues();
            let formulaMatrix = hyperlinkRange.getFormulas();
            let cellNameMatrix = Utils.createCellNameArray(2, 2, APTDataTableCompleteTests.numRows - 1, 1);
            let zippedArray = Utils
                .createZippedThreeArrayNested(cellNameMatrix, valueMatrix, formulaMatrix)
                .map(([row]) => row);

            // check the text
            let incorrectLinkTextCells = zippedArray
                .map(([cellName, linkTest, _]) => [cellName, linkTest.trim().toLowerCase()])
                .filter(([_name, linkText]) => linkText !== 'link');

            if (incorrectLinkTextCells.length > 0) {
                result = false;
                incorrectLinkTextCells.forEach(([cellName, linkText]) => {
                    errBuffer += `\n\t\t\tERROR: Cell ${cellName}'s hyperlink text should read \"Link\", but instead it reads ${linkText}`;
                })
            }

            let incorrectFormulaCells = zippedArray
                .map(([cellName, _, formula]) => [cellName, formula.trim().toLowerCase().replaceAll(/\s/gi, "")])
                .filter(([_, formula]) => !formula.startsWith("=hyperlink("));

            if (incorrectFormulaCells.length > 0) {
                result = false;
                incorrectFormulaCells.forEach(([cellName, _formula]) => {
                    errBuffer += `\n\t\t\tERROR: Cell ${cellName}'s hyperlink was not created with a HYPERLINK() function`
                })
            }
        }

        let message = `\t\t${result ? "PASS" : "FAIL"}: Is each in Column B created with the =HYPERLINK() function,`
            + `\n\t\t      and does the hyperlink text read "Link"?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks that all of the delivery dates in Column D are written in 
     * a valid date format, and that a single date format is used consistently
     * for the entire column. 
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- Are the dates valid and consistent?
     */
    CheckDates: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
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

            let dateRange = amazonPurchasesTestSheet
                .getRange(2, 4, APTDataTableCompleteTests.numRows - 1, 1);
            let valueMatrix = dateRange.getValues();
            let formatMatrix = dateRange.getNumberFormats();
            let cellNameMatrix = Utils.createCellNameArray(2, 4, APTDataTableCompleteTests.numRows - 1, 1);

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

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you enter valid dates in Column D, and did you use`
            + "\n\t\t      a single, consist format for all of your dates?";
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the currency values in the unit prices (col E)
     * and subtotals (Col G) columns are formatted correctly.
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- are all currency values formatted correctly?
     */
    CheckCurrency: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {
            // check unit prices
            let unitPriceRangeFormats = amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .getNumberFormats();
            let unitPriceCellNames = Utils
                .createCellNameArray(2, 5, APTDataTableCompleteTests.numRows - 1, 1);
            let badlyFormattedUnitPrices = Utils
                .createZippedTwoArray(unitPriceCellNames, unitPriceRangeFormats)
                .map(([row]) => row)
                .filter(([_c, format]) => format !== '"$"#,##0.00');

            if (badlyFormattedUnitPrices.length > 0) {
                result = false;
                badlyFormattedUnitPrices.forEach(([cell, _f]) => {
                    errBuffer += `\n\t\t\tERROR: The unit price in cell ${cell} is not formatted correctly`;
                });
            }

            let subtotalRangeFormats = amazonPurchasesTestSheet
                .getRange(2, 7, APTDataTableCompleteTests.numRows - 1, 1)
                .getNumberFormats();
            let subtotalCellNames = Utils
                .createCellNameArray(2, 7, APTDataTableCompleteTests.numRows - 1, 1);
            let badlyFormattedSubtotals = Utils
                .createZippedTwoArray(subtotalCellNames, subtotalRangeFormats)
                .map(([row]) => row)
                .filter(([_c, format]) => format !== '"$"#,##0.00');

            if (badlyFormattedSubtotals.length > 0) {
                result = false;
                badlyFormattedSubtotals.forEach(([cell, _f]) => {
                    errBuffer += `\n\t\t\tERROR: The subtotal in cell ${cell} is not formatted correctly`;
                });
            }

        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are all monetary values formatted as currency`
            + `\n\t\t      with two decimal places?`;

        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks if the table is sorted high to low by unit price (column E)
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- is the table sorted?
     */
    CheckSorted: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {
            let unitPrices = amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .flat();

            for (let index = 0; index < APTDataTableCompleteTests.numRows - 2; index++) {
                if (result) {
                    result &= unitPrices[index] >= unitPrices[index + 1];
                } else {
                    break;
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the data table sorted high to low by unit price?`
        student.logFeedback(message + errBuffer);
        return result;
    }
}