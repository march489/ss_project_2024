AmazonPurchasesTest = {
    /**
     * Runs the Header test on the amazonPurchasesSheet on the Master Spreadsheet,
     * which is a copy of the student's version. The reference to the Student is used 
     * to log feedback
     * @param {Student} student 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
     * @returns {bool} -- did all of the tests pass?
     */
    RunHeaderTests: function (student, amazonPurchasesTestSheet) {
        student.logFeedback("\tAmazonPurchasesTest -- Running Header Tests...");

        const results = new Array();
        Object.values(APTHeaderTests).forEach((f) => {
            results.push(f.call(APTHeaderTests, student, amazonPurchasesTestSheet));
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("Amazon Purchases Test " + message + '\n');
    }
}