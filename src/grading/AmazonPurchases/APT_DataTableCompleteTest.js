APTDataTableCompleteTests = {
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
            errBuffer += `\n\t\t\tERROR: Expected at least 10 rows of data, but you have ${APTDataTableCompleteTests.numRows} rows`
        }
        let message = `\t\t${result ? "PASS" : "FAIL"}: Do you have at least 10 rows of data in your table,` 
            + `\n\t\t      excluding headers?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

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
                .map(row => row.filter(([_, val]) => val.toString().trim() === "").map(([cell, _]) => cell))
                .flat();

            if (emptyCells.length > 1) {
                result = false;
                errBuffer = `\n\t\t\tERROR: The following cells are missing data: ${emptyCells}`;
            }
        }

        let message = `\t\t${result ? "PASS" : "FAIL"}: Is the data table completely filled in with no empty cells?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

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
                .map(([cellName, _, formula]) => [cellName, formula.trim().toLowerCase()])
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
                let defaultFormat = validDates[0][2];
                let datesWithOtherFormats = validDates
                    .filter(([_c, _d, format]) => format !== defaultFormat);

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
    }
}