APTRowRubtotalTests = {
    /**
     * Do the current subtotal values equal the quantity times the unit price?
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- Are the subtotals correct?
     */
    CheckProducts: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {
            let unitPrices = amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .map(([row]) => row);
            let quantities = amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .map(([row]) => row);

            let actualSubtotals = amazonPurchasesTestSheet
                .getRange(2, 7, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues();
            let expectedSubtotals = unitPrices
                .map((price, index) => [price * quantities[index]]);

            let subtotalCellNames = Utils
                .createCellNameArray(2, 7, APTDataTableCompleteTests.numRows - 1, 1);

            let problematicSubtotals = Utils
                .createZippedThreeArrayNested(subtotalCellNames, expectedSubtotals, actualSubtotals)
                .map(([row]) => row)
                .filter(([_c, expected, actual]) => expected !== actual);

            if (problematicSubtotals.length > 0) {
                result = false;
                problematicSubtotals.forEach(([cell, expected, actual]) => {
                    errBuffer += `\n\t\t\tERROR: In cell ${cell} we expected subtotal ${expected} but got ${actual}`;
                })
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the subtotal correct for each row?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Changes the quantities and checks if the new subtotals (calculated by a formula)
     * change to match. 
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- are the formulas for subtotals robust?
     */
    CheckFormulas: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {
            let unitPrices = amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .map(([row]) => row);
            let originalQuantities = amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues();
            let newQuantities = originalQuantities
                .map(([quantity]) => [quantity + 1]);

            amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .setValues(newQuantities);

            let newSubtotals = amazonPurchasesTestSheet
                .getRange(2, 7, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues();
            let expectedSubtotals = newQuantities
                .map(([quantity], index) => [quantity * unitPrices[index]]);
            let cellNameMatrix = Utils
                .createCellNameArray(2, 7, APTDataTableCompleteTests.numRows - 1, 1);

            let incorrectSubtotals = Utils
                .createZippedThreeArrayNested(cellNameMatrix, expectedSubtotals, newSubtotals)
                .map(([row]) => row)
                .filter(([_c, expected, actual]) => expected !== actual);

            if (incorrectSubtotals.length > 0) {
                result = false;
                incorrectSubtotals.forEach(([cell, expected, actual], index) => {
                    errBuffer += `\n\t\t\tERROR: In ${cell}, updated quantity ${newQuantities[index]} should yield subtotal ${expected}, but instead got ${actual}`;
                });
            }

            // clean up & reset
            amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .setValues(originalQuantities);
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are subtotals calculated with valid formulas?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}