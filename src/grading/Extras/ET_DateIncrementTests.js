DateIncrementTests = {
    Check: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You have no data.`
        } else {
            let formula = cbotTestSheet
                .getRange(CBOT_DATE_INCREMENT_FORMULA_CELL)
                .getFormula();

            if (formula === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: There is no formula in ${CBOT_DATE_INCREMENT_FORMULA_CELL}`;
            } else {
                let originalDates = cbotTestSheet
                    .getRange(2, 1, CardBalanceOverTimeTests.numRows - 1, 1)
                    .getDisplayValues()
                    .flat();

                let cellNames = Utils
                    .createCellNameArray(2, 1, CardBalanceOverTimeTests.numRows - 1, 1);

                try {
                    cbotTestSheet
                        .getRange(CBOT_DATE_INCREMENT_FORMULA_CELL)
                        .autoFill(cbotTestSheet.getRange(3, 1, CardBalanceOverTimeTests.numRows - 2, 1), 
                        SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
                } catch(e) {
                    console.log(e);
                    result = false;
                    errBuffer += `\n\t\t\tERROR: Cannot autofil formula in ${CBOT_DATE_INCREMENT_FORMULA_CELL}`
                } finally {
                    let newDates = cbotTestSheet
                        .getRange(2, 1, CardBalanceOverTimeTests.numRows - 1, 1)
                        .getDisplayValues()
                        .flat();

                    let zipperedArray = Utils
                        .createZippedThreeArrayFlat(cellNames, originalDates, newDates);

                    let probalematicCells = zipperedArray
                        .filter(([_name, oldDate, newDate]) => oldDate !== newDate);

                    if (probalematicCells.length > 0) {
                        result = false;
                        probalematicCells.forEach(([cell, oldDate, newDate]) => {
                            errBuffer += `\n\t\t\tERROR: Auto-filled date in ${cell} (${newDate}) doesn't match`
                            + `\n\t\t\t       the previous date in that cell (${oldDate})`;
                        });
                            
                    }
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is a consistent formula used to increment dates?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}