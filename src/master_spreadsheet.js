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
     * If it exists, makes a copy of the student's Amazon Purchases sheet
     * and copies it to the Master Spreadsheet. All tests are run on the copy,
     * not on the student's original. 
     * @param {Student} student 
     */
    createAmazonTestSheet: function (student) {
        MasterSpreadsheet.initialize();
        MasterSpreadsheet.copySheetStudentToMaster(student, AMAZON_SHEET_NAME);
    },

    // AMAZON PURCHASES

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

    /**
     * Records a student's results to the Amazon Purchases tests
     * @param {Student} student 
     * @param {bool[]} results 
     */
    recordAmazonPurchaseTestResults: function (student, results) {
        MasterSpreadsheet.stampAmazonResultStudentChecklist(student, results);
        student.recordTestResults(results);
    },

    /**
     * Stamps Y/N on the student's Checklist tab based on their 
     * Amazon test results
     * @param {Student} student 
     * @param {bool[]} results 
     */
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

    // STUDENT DATA

    createStudentDataTestSheet: function (student) {
        MasterSpreadsheet.initialize();
        MasterSpreadsheet.copySheetStudentToMaster(student, STUDENT_DATA_SHEET_NAME);
    },

    getStudentDataTestSheet: function () {
        MasterSpreadsheet.initialize();
        return MasterSpreadsheet
            .managerFile
            .getSheetByName(STUDENT_DATA_SHEET_NAME);
    },

    recordStudentDataTestResults: function (student, results) {
        MasterSpreadsheet.stampStudentDataResultStudentChecklist(student, results);
        student.recordTestResults(results);
    },

    stampStudentDataResultStudentChecklist: function (student, results) {
        let stampArray = results
            .map(result => result ? ["Y"] : ["N"]);

        // adjust for partial development
        while (stampArray.length < STUDENT_DATA_STAMP_RANGE_SIZE) {
            stampArray.push([""]);
        }

        student
            .spreadsheet
            .getSheetByName(CHECKLIST_SHEET_NAME)
            .getRange(STUDENT_DATA_STAMP_CELL_RANGE)
            .setValues(stampArray);
    },

    // CBOT
    createCbotTestSheet: function (student) {
        MasterSpreadsheet.initialize();
        MasterSpreadsheet.copySheetStudentToMaster(student, CBOT_SHEET_NAME);
    },

    getCbotTestSheet: function (student) {
        MasterSpreadsheet.initialize();
        return MasterSpreadsheet
            .managerFile
            .getSheetByName(CBOT_SHEET_NAME);
    },

    recordCbotTestResults: function (student, results) {
        MasterSpreadsheet.stampCbotResultStudentChecklist(student, results);
        student.recordTestResults(results);
    },

    stampCbotResultStudentChecklist: function (student, results) {
        let stampArray = results
            .map(result => result ? ["Y"] : ["N"]);

        // adjust for partial development
        while (stampArray.length < CBOT_STAMP_RANGE_SIZE) {
            stampArray.push([""]);
        }

        student
            .spreadsheet
            .getSheetByName(CHECKLIST_SHEET_NAME)
            .getRange(CBOT_STAMP_CELL_RANGE)
            .setValues(stampArray);
    },

    recordExtraTestResults (student, results) {
        MasterSpreadsheet.stampExtraResultsStudentChecklist(student, results);
        student.recordTestResults(results);
    },

    stampExtraResultsStudentChecklist: function (student, results) {
        let stampArray = results
            .map(result => result ? ["Y"] : ["N"]);

        // adjust for partial development
        while (stampArray.length < EXTRA_STAMP_RANGE_SIZE) {
            stampArray.push([""]);
        }

        student
            .spreadsheet
            .getSheetByName(CHECKLIST_SHEET_NAME)
            .getRange(EXTRA_STAMP_RANGE)
            .setValues(stampArray);
    }
}