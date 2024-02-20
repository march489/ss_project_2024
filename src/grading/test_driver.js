TestDriver = {
    /**
     * Entry point into the testing script. Uses configs.js and constants.js 
     * to determine which tests to run on which students. 
     */
    runTests: function () {
        if (TESTING_MODE) {
            let file = DriveApp.getFileById(DEV_STUDENT_FILE_ID);
            let student = new Student(file);
            console.log(student.name);
            TestDriver.GradeStudent(student);
        } else if (GRADE_WHOLE_SECTIONS) {
            if (GRADE_FIRST_PERIOD) {
                TestDriver.GradeSection(FIRST_FOLDER_ID);
            }

            if (GRADE_FIFTH_PERIOD) {
                TestDriver.GradeSection(FIFTH_FOLDER_ID);
            }

            if (GRADE_A_PERIOD) {
                TestDriver.GradeSection(A_FOLDER_ID);
            }

            if (GRADE_B_PERIOD) {
                TestDriver.GradeSection(B_FOLDER_ID);
            }

            if (GRADE_D_PERIOD) {
                TestDriver.GradeSection(D_FOLDER_ID);
            }

            if (GRADE_B_TA) {
                TestDriver.GradeSection(B_TA_FOLDER_ID);
            }
        }
    },

    GradeSection: function(sectionFolderId) {
        let files = DriveApp.getFolderById(sectionFolderId).getFiles();
        while(files.hasNext()) {
            let studentFile = files.next();
            console.log(studentFile.getName());
            TestDriver.GradeStudent(new Student(studentFile));
        }
    },

    GradeStudent: function (student) {
        MasterSpreadsheet.initialize();
        let datetime = student.prepFeedbackFile();
        console.log(student.name);

        if (GRADE_AMAZON) {
            TestDriver.runAmazonPurchasesTest(student);
        }

        if (GRADE_STUDENT_DATA) {
            // TODO implement TestDriver.runStudentDataTest(student);
        }

        if (GRADE_CBOT) {
            // TODO implement TestDriver.runCbotTest(student);
        }

        student.finalizeTesting();
    },

    /**
     * Runs the Amazon Purchases tests on the student file.
     * @param {Student} student 
     */
    runAmazonPurchasesTest: function (student) {
        MasterSpreadsheet.createAmazonTestSheet(student);
        student.logFeedback("\nRunning Amazon Purchases Tests...")
        const results = new Array();

        for (const [name, f] of Object.entries(AmazonPurchasesTest)) {
            results.push(f.call(AmazonPurchasesTest, student, MasterSpreadsheet.getAmazonTestSheet()));
        }
        
        MasterSpreadsheet.recordAmazonPurchaseTestResults(student, results);

        let finalResult = results.reduce((bA, bB) => bA && bB, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("Aamazon Purchases Tests: " + message);
        return finalResult
    }
}