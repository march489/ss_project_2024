class MasterSpreadsheet {
    static instance = null;
    constructor() {
        this.managerFile = DriveApp.getFileById(MASTER_SPREADSHEET_ID);
    }

    /**
     * Private method that returns a reference to the master spreadsheet
     * @returns {MasterSpreadsheet}
     */
    static #getInstance() {
        if (!instance) {
            instance = new MasterSpreadsheet();
        }

        return instance;
    }

    /**
     * Accessor for the Master Spreadsheet's Amazon Test Sheet
     * @returns {GoogleAppsScript.Spreadsheet.Sheet}
     */
    static getAmazonTestSheet() {
        manager = MasterSpreadsheet.#getInstance();
        return manager.managerFile.getSheetByName(AMAZON_TEST_SHEET_NAME);
    }

    /**
     * Runs the Amazon Purchases tests on the student file.
     * @param {Student} student 
     */
    static runAmazonPurchaseTest(student) {
        manager = MasterSpreadsheet.#getInstance();
        student.logFeedback("Running Amazon Purchases Test...");
        const results = new Array();

        // delete the test sheet if it exists from previous test
        let testSheet = manager.managerFile.getSheetByName((AMAZON_TEST_SHEET_NAME));
        if (testSheet) {
            manager.managerFile.deleteSheet(testSheet);
        }

        try {
            student
                .driveAppFile
                .getSheetByName(AMAZON_SHEET_NAME)
                .copyTo(manager.managerFile)
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