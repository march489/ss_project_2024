MasterSpreadsheet = {
    initialized: false,

    initialize () {
        if (!MasterSpreadsheet.initialized) {
            MasterSpreadsheet.managerFile = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
            MasterSpreadsheet.initialized = true;
        }
    },

    copySheetStudentToMaster: function (student, sheetName) {
        MasterSpreadsheet.initialize();
        let sheet = this
            .managerFile
            .getSheetByName(sheetName);

        if (sheet) {
            this
                .managerFile
                .deleteSheet(sheet);
        }

        try {
            student
                .spreadsheet
                .getSheetByName(sheetName)
                .copyTo(MasterSpreadsheet.managerFile)
                .activate()
                .setName(sheetName);
        } catch (e) {
            this
                .managerFile
                .insertSheet()
                .activate()
                .setName(sheetName);

            // TODO Add teacher-facing error logging service
            console.log(`Student ${student.name} has no sheet named ${sheetName}`);
            student.logFeedback(`**WARNING** Your project does not contain a sheet \
                named "${sheetName}" **WARNING**`);
        }

    },

    /**
     * Passes an updated copy of a sheet to student file
     * @param {Student} student 
     * @param {string} sheetName -- const name of sheet pulled from constants.js
     */
    copySheetMasterToStudent: function (student, sheetName, index = null) {
        MasterSpreadsheet.initialize();
        let sheet = student
            .spreadsheet
            .getSheetByName(sheetName);

        if (sheet) {
            student
                .spreadsheet
                .deleteSheet(sheet);
        }

        try {
            this
                .managerFile
                .getSheetByName(sheetName)
                .copyTo(student.spreadsheet)
                .activate()
                .setName(sheetName);

            if (index) {
                student 
                    .spreadsheet
                    .moveActiveSheet(index);
            }
        } catch (e) {
            // TODO add teacher-facing error logging service
            console.log(`Failed to send ${sheetName} to ${student.name} -- abort and debug`);
            exit(1);
        }

    },

    /**
     * Accessor for the Master Spreadsheet's Amazon Test Sheet
     * @returns {GoogleAppsScript.Spreadsheet.Sheet}
     */
    getAmazonTestSheet: function () {
        MasterSpreadsheet.initialize();
        return this
            .managerFile
            .getSheetByName(AMAZON_SHEET_NAME);
    },

    getStudentDataTestSheet: function () {
        MasterSpreadsheet.initialize();
        return MasterSpreadsheet.managerFile.getSheetByName(STUDENT_DATA_SHEET_NAME);
    },

    /**
     * 
     * @param {Student} student 
     */
    createAmazonTestSheet: function (student) {
        MasterSpreadsheet.initialize();
        MasterSpreadsheet.copySheetStudentToMaster(student, AMAZON_SHEET_NAME);
    },

    recordAmazonPurchaseTestResults: function (student, results) {
        MasterSpreadsheet.stampAmazonResultStudentChecklist(student, results);
        // TODO implement stampGradeSheet
    },

    stampAmazonResultStudentChecklist: function (student, results) {
        let stampArray = results
            .map(result => result ? ["Y"] : ["N"]);

        // adjust for partial development
        while (stampArray.length < AMAZON_STAMP_RANGE_SIZE) {
            stampArray.push([""]);
        }

        student
            .spreadsheet
            .getSheetByName(CHECKLIST_SHEET_NAME)
            .getRange(AMAZON_CHECKLIST_STAMP_CELL_RANGE)
            .setValues(stampArray);
    },

    createStudentDataTestSheet: function (student) {
        MasterSpreadsheet.initialize();
        MasterSpreadsheet.copySheetStudentToMaster(STUDENT_DATA_SHEET_NAME);
    }
}