MasterSpreadsheet = {
    initialized: false,

    initialize() {
        if (!this.initialized) {
            this.managerFile = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
            this.initialized = true;
        }
    },

    /**
     * Accessor for the Master Spreadsheet's Amazon Test Sheet
     * @returns {GoogleAppsScript.Spreadsheet.Sheet}
     */
    getAmazonTestSheet: function () {
        this.initialize();
        return this.managerFile.getSheetByName(AMAZON_TEST_SHEET_NAME);
    },

    /**
     * 
     * @param {Student} student 
     */
    createAmazonTestSheet: function (student) {
        this.initialize();
        let testSheet = this.managerFile.getSheetByName(AMAZON_TEST_SHEET_NAME);
        if (testSheet) {
            this.managerFile.deleteSheet(testSheet);
        }

        try {
            student
                .spreadsheet
                .getSheetByName(AMAZON_SHEET_NAME)
                .copyTo(this.managerFile)
                .activate()
                .setName(AMAZON_TEST_SHEET_NAME);
        } catch (e) {
            this
                .managerFile
                .insertSheet()
                .activate()
                .setName(AMAZON_TEST_SHEET_NAME);

            // TODO: Add error logging service
            console.log(`Student ${student.studentName} has no Amazon Purchases sheet`);
            student.logFeedback(
                "**WARNING** Your project does not contain a sheet \
                named \"AmazonPurchases\". **WARNING**");
        }
    },
}