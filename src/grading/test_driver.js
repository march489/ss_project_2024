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
        }
    },

    GradeStudent: function (student) {
        MasterSpreadsheet.initialize();
        let datetime = student.prepFeedbackFile();

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

        let finalResult = results.reduce((bA, bB) => bA && bB, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("Aamazon Purchases Tests: " + message);
        return finalResult
    }
}