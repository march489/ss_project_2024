APTTotalCostTests = {
	/**
	 * Checks whether the label for Total Cost is correct
	 * @param {Student} student 
	 * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
	 * @returns {bool} -- is the label correct?
	 */
	CheckLabel: function (student, amazonPurchasesTestSheet) {
		let errBuffer = '';
		let totalCostLabel = amazonPurchasesTestSheet
			.getRange(AMAZON_TOTAL_COST_LABEL_RANGE)
			.getValue()
			.toLowerCase()
			.replaceAll(' ', '');

		let result = TOTAL_COST_LABEL === totalCostLabel;
		if (!result) {
			errBuffer = `\n\t\t\tERROR: Cell ${AMAZON_TOTAL_COST_LABEL_RANGE} is not correctly labeled`
		}

		let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is Cell I1 labeled "Total Cost?"`;
		student.logFeedback(message + errBuffer);
		return result;
	},

	/**
	 * Checks whether the sum written on the spreadsheet is the sum of the 
	 * existing subtotals in column G. 
	 * @param {Student} student 
	 * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
	 * @returns {bool} -- is the sum valid?
	 */
	CheckSum: function (student, amazonPurchasesTestSheet) {
		let errBuffer = '';
		let result = true;

		if (APTDataTableCompleteTests.numRows <= 1) {
			result = false;
			errBuffer = `\n\t\t\tERROR: You have no data`;
		} else {
			let sumSubtotals = amazonPurchasesTestSheet
				.getRange(2, 7, APTDataTableCompleteTests.numRows - 1, 1)
				.getValues()
				.flat()
				.reduce((total, val) => total + val, 0);

			let totalCost = amazonPurchasesTestSheet
				.getRange(AMAZON_TOTAL_COST_VALUE_RANGE)
				.getValue();

			result = (Math.abs(sumSubtotals - totalCost) <= TOLERANCE);
			if (!result) {
				errBuffer = `\n\t\t\tERROR: The total ${Utils.asMoney(totalCost)} in cell ${AMAZON_TOTAL_COST_VALUE_RANGE} doesn't equal the sum of the subtotals, ${Utils.asMoney(sumSubtotals)}`;
			}
		}

		let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the value in cell J1 the sum of the subtotals in column G?`;
		student.logFeedback(message + errBuffer);
		return result;
	},

	/**
	 * Checks whether the student's formula is robust, meaning does it correctly 
	 * calculate the sum from new inputs on the spreadsheet?
	 * @param {Student} student 
	 * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
	 * @returns {bool} -- is the formula robust?
	 */
	CheckSumFormula: function (student, amazonPurchasesTestSheet) {
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

			// let originalTotalCost = amazonPurchasesTestSheet
			// 	.getRange(AMAZON_TOTAL_COST_VALUE_RANGE)
			// 	.getValue();
			let newExpectedTotalCost = newQuantities
				.map(([quantity], index) => quantity * newUnitPrices[index][0])
				.reduce((acc, total) => acc + total, 0);

			amazonPurchasesTestSheet
				.getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
				.setValues(newUnitPrices);
			amazonPurchasesTestSheet
				.getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
				.setValues(newQuantities);

			let newActualTotalCost = amazonPurchasesTestSheet
				.getRange(AMAZON_TOTAL_COST_VALUE_RANGE)
				.getValue();

			result = Math.abs(newExpectedTotalCost - newActualTotalCost) <= TOLERANCE;

			if (!result) {
				errBuffer = `\n\t\t\tERROR: Total cost formula in ${AMAZON_TOTAL_COST_VALUE_RANGE} is either missing or generates incorrect values with different inputs.`
			}

			// reset & clean up
			amazonPurchasesTestSheet
				.getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
				.setValues(originalUnitPrices);
			amazonPurchasesTestSheet
				.getRange(2, 6, APTDataTableCompleteTests.numRows - 1, 1)
				.setValues(originalQuantities);
		}

		let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is total cost calculated with a formula, and does the formula`
			+ `\n\t\t      still work if the quantities, unit prices, and subtotals change?`;
		student.logFeedback(message + errBuffer);
		return result;
	}
}