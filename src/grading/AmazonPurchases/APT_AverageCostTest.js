AverageCostTests = {
    /**
     * Checks whether the label for Total Cost is correct
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- is the label correct?
     */
    CheckLabel: function (student, amazonPurchasesTestSheet) {
        let errBuffer = '';
        let averageCostLabel = amazonPurchasesTestSheet
            .getRange(AMAZON_AVERAGE_COST_LABEL_RANGE)
            .getValue()
            .toLowerCase()
            .replaceAll(/\s/gi, '');

        let result = AVERAGE_COST_LABEL === averageCostLabel;
        if (!result) {
            errBuffer = `\n\t\t\tERROR: Cell ${AMAZON_AVERAGE_COST_LABEL_RANGE} is not correctly labeled`
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is Cell I2 labeled "Average Cost per Item?"`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the average cost per item in J2 is equal to the total amount of money spent
     * divided by the total number of items in the student's cart. 
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- is the average cost per item in your cart correct?
     */
    CheckAverage: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = '';

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = `\n\t\t\tERROR: You have no data`;
        } else {
            let sumSubtotals = amazonPurchasesTestSheet
                .getRange(2, 7, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .flat()
                .reduce((total, val) => total + val, 0);
            let sumQuantities = amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .flat()
                .reduce((total, val) => total + val, 0)
            let expectedAverageCostPerItem = sumSubtotals / sumQuantities;

            let actualAverageCostPerItem = amazonPurchasesTestSheet
                .getRange(AMAZON_AVERAGE_COST_VALUE_RANGE)
                .getValue();

            result = Math.abs(actualAverageCostPerItem - expectedAverageCostPerItem) <= TOLERANCE;

            if (!result) {
                errBuffer = `\n\t\t\tERROR: The average ${Utils.asMoney(actualAverageCostPerItem)} in ${AMAZON_AVERAGE_COST_VALUE_RANGE} is incorrect;`
                errBuffer += `\n\t\t\t       This is not the average cost of the ${sumQuantities} items`;
                errBuffer += `\n\t\t\t       in your shopping cart.`;

                if (Math.abs(actualAverageCostPerItem - sumSubtotals / (APTDataTableCompleteTests.numRows - 1)) <= TOLERANCE ||
                    amazonPurchasesTestSheet.getRange(AMAZON_AVERAGE_COST_VALUE_RANGE).getFormula().trim().toLowerCase().startsWith('=average(')) {
                    errBuffer += `\n\t\t\t       Be careful with =AVERAGE(), it always divides by the number of cells, not the number of items in your cart.`
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is J2 the average cost per item in your cart?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the average cost per item function in J2 is robust, meaning:
     * Does it still correctly compute the average cost per item in the shopping cart even when
     * the inputs change?
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- is the average cost function robust?
     */
    CheckAverageFormula: function (student, amazonPurchasesTestSheet) {
        let errBuffer = '';
        let result = true;

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = `\n\t\t\tERROR: You have no data.`
        } else {

            let originalUnitPrices = amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues();
            let newUnitPrices = originalUnitPrices
                .map(([price], index) => [price * (index + 3) + 1.99]);

            let originalQuantities = amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues();
            let newQuantities = originalQuantities
                .map(([quantity], index) => [quantity * (index + 4) + 1]);

            let newExpectedTotalCost = newQuantities
                .map(([quantity], index) => quantity * newUnitPrices[index][0])
                .reduce((acc, total) => acc + total, 0);

            let newExpectedAverageCost = newExpectedTotalCost / newQuantities.flat().reduce((acc, val) => acc + val, 0);

            amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .setValues(newUnitPrices);
            amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .setValues(newQuantities);

            let newActualAverageCost = amazonPurchasesTestSheet
                .getRange(AMAZON_AVERAGE_COST_VALUE_RANGE)
                .getValue();

            result = Math.abs(newExpectedAverageCost - newActualAverageCost) <= TOLERANCE;

            if (!result) {
                errBuffer = `\n\t\t\tERROR: Average cost formula in ${AMAZON_AVERAGE_COST_VALUE_RANGE} is either missing `
                    + `\n\t\t\t       or generates incorrect values with different inputs.`;
            }

            // reset & clean up
            amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .setValues(originalUnitPrices);
            amazonPurchasesTestSheet
                .getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
                .setValues(originalQuantities);
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is average cost calculated with a formula,`
            + `\n\t\t     and does the formula still work if quantities,`
            + `\n\t\t     unit prices, and subtotals change?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}