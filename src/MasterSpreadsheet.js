MasterSpreadsheet = {
    initialized: false,

    initialize() {
        if (!initialized) {
            this.managerFile = DriveApp.getFileById(MASTER_SPREADSHEET_ID);
            initialized = true;
        }
    },

    /**
     * Accessor for the Master Spreadsheet's Amazon Test Sheet
     * @returns {GoogleAppsScript.Spreadsheet.Sheet}
     */
    getAmazonTestSheet: function () {
        initialize();
        return this.managerFile.getSheetByName(AMAZON_TEST_SHEET_NAME);
    },

    /**
     * Runs the Amazon Purchases tests on the student file.
     * @param {Student} student 
     */
    runAmazonPurchaseTest: function (student) {
        initialize();
        student.logFeedback("Running Amazon Purchases Test...");
        const results = new Array();

        // delete the test sheet if it exists from previous test
        let testSheet = this.managerFile.getSheetByName((AMAZON_TEST_SHEET_NAME));
        if (testSheet) {
            this.managerFile.deleteSheet(testSheet);
        }

        try {
            student
                .driveAppFile
                .getSheetByName(AMAZON_SHEET_NAME)
                .copyTo(this.managerFile)
                .activate()
                .setName(AMAZON_TEST_SHEET_NAME);
        } catch (e) {
            manager
                .managerFile
                .insertSheet()
                .activate()
                .setName(AMAZON_TEST_SHEET_NAME);

            // TODO: Add error logging service
            console.log(`Student ${student.studentName} has no Amazon Purchases sheet`);
        }

        let datetime = student.prepFeedbackFile();

        for (const [name, f] of Object.entries(AmazonPurchasesTest)) {
            results.push(f.call(student, MasterSpreadsheet.getAmazonTestSheet()));
        }
    }
}