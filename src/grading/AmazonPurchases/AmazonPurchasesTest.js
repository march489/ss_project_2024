AmazonPurchasesTest = {
    /**
     * Sets up a local cache of useful information pulled from the student's 
     * AmazonPurchases sheet.
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesSheet 
     * @returns {bool} - setup successful
     */
    setup: function (student, amazonPurchasesSheet) {
        this.headerRange = amazonPurchasesSheet
            .setActiveSelection(AMAZON_HEADER_RANGE);

        this.dataRange = amazonPurchasesSheet.setActiveSelection(AMAZON_DATA_RANGE);

        this.numRows = this
            .dataRange
            .getValues()
            .map(row => row.filter(String))
            .filter(String)
            .length;

        this.dataIsValid = this.numRows > 0;

        return this.dataIsValid;
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