class MasterSpreadsheet {
    constructor() {
        this.file = DriveApp.getFileById(MASTER_SPREADSHEET_ID);
    }

    /**
     * Runs the Amazon Purchases tests on the student file.
     * @param {Student} student 
     */
    RunAmazonPurchaseTest(student) {
        let feedbackFile = student.getFeedbackFile();
    }
}