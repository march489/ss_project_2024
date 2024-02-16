AmazonPurchasesTest = {
    /**
     * Sets up a local cache of useful information pulled from the student's 
     * AmazonPurchases sheet.
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesSheet 
     * @returns {bool} - setup successful
     */
    setup: function (student, amazonPurchasesSheet) {
        this.headers = amazonPurchasesSheet
            .setActiveSelection(AMAZON_HEADER_RANGE)
            .getValues()
            .flatMap(row => row.filter(String));

        let dataRange = amazonPurchasesSheet.setActiveSelection(AMAZON_DATA_RANGE);
        let unfilteredValues = dataRange.getValues();
        let numRows = unfilteredValues
            .map(row => row.filter(String))
            .filter(String)
            .length;

        this.validData = numRows > 0;

        let valueMatrix = dataRange
            .getValues()
            .slice(0, numRows);

        let formulaMatrix = dataRange
            .getFormulas()
            .slice(0, numRows);

        let cellNameMatrix = [];
        for (row = 2; row <= 1 + numRows; row++) {
            let tmp = [];

            for (ch = 65; ch < 72; ch++) {
                tmp.push(String.fromCharCode(ch) + String(row));
            }

            cellNameMatrix.push(tmp);
        }

        console.log(cellNameMatrix);
        console.log(valueMatrix);
        console.log(formulaMatrix);

        return this.validData;
    },

    /**
     * Runs the Header test on the amazonPurchasesSheet on the Master Spreadsheet,
     * which is a copy of the student's version. The reference to the Student is used 
     * to log feedback
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- did all of the tests pass?
     */
    RunHeaderTests: function (student, amazonPurchasesTestSheet) {
        student.logFeedback("\n\tAmazonPurchasesTest -- Running Header Tests...\n");

        const results = new Array();
        Object.values(APTHeaderTests).forEach((f) => {
            results.push(f.call(this, student, amazonPurchasesTestSheet));
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("\n\tAmazon Purchases Test: " + message + '\n');
    }
}