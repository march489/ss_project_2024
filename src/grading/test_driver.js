TestDriver = {
    /**
     * Entry point into the testing script. Uses configs.js and constants.js 
     * to determine which tests to run on which students. 
     */
    runTests: function () {
        if (TESTING_MODE) {
            let file = DriveApp.getFileById(DEV_STUDENT_FILE_ID);
            let student = new Student(file);
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
        } else {
            // grading specific student
            let fileName = `${SINGLE_STUDENT_NAME} - Credit Card & Spreadsheet Project 2024`;

            let files = DriveApp.getFilesByName(fileName);
            if (files.hasNext()) {
                let student = new Student(files.next());
                TestDriver.GradeStudent(student);
            } else {
                console.log(`No file found for ${SINGLE_STUDENT_NAME}`);
            }
        }
    },

    GradeSection: function (sectionFolderId) {
        let files = DriveApp.getFolderById(sectionFolderId).getFiles();
        while (files.hasNext()) {
            let studentFile = files.next();
            console.log(studentFile.getName());
            TestDriver.GradeStudent(new Student(studentFile));
        }
    },

    GradeStudent: function (student) {
        if (SKIP_NO_CHANGES) {
            if (!student.isLastEditByStudent()) {
                console.log(`Skipping ${student.name}`);
                return; // early exit
            }
        }

        // otherwise, keep going
        MasterSpreadsheet.initialize();
        let datetime = student.prepFeedbackFile();
        student.lastRun = datetime;
        console.log(student.name);

        if (GRADE_AMAZON) {
            TestDriver.runAmazonPurchasesTest(student);
        }

        if (GRADE_STUDENT_DATA) {
            TestDriver.runStudentDataTests(student);
        }

        if (GRADE_CBOT) {
            TestDriver.runCbotTests(student);
            TestDriver.runExtraTests(student);
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

        for (const [_name, f] of Object.entries(AmazonPurchasesTest)) {
            results.push(f.call(AmazonPurchasesTest, student, MasterSpreadsheet.getAmazonTestSheet()));
        }

        MasterSpreadsheet.recordAmazonPurchaseTestResults(student, results);

        let finalResult = results.reduce((bA, bB) => bA && bB, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("Aamazon Purchases Tests: " + message);
        return finalResult;
    },

    /**
     * Runs the Student Data tests on the student file.
     * @param {Student} student 
     */
    runStudentDataTests: function (student) {
        MasterSpreadsheet.createStudentDataTestSheet(student);
        student.logFeedback("\nRunning Student Data Tests...");
        const results = new Array();

        for (const [_name, f] of Object.entries(StudentDataTests)) {
            results.push(f.call(StudentDataTests, student, MasterSpreadsheet.getStudentDataTestSheet()));
        }

        MasterSpreadsheet.recordStudentDataTestResults(student, results);

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        student.logFeedback(`Student Data Tests: ${finalResult ? 'ALL TESTS PASS' : 'INCOMPLETE'}`);
        return finalResult;
    },

    /**
     * Runs the Card Balance Over Time tests on the student file.
     * @param {Student} student 
     */
    runCbotTests: function (student) {
        MasterSpreadsheet.createCbotTestSheet(student);
        student.logFeedback("\nRunning CBOT Tests...");
        const results = new Array();

        for (const [_name, f] of Object.entries(CardBalanceOverTimeTests)) {
            if (typeof f === 'function') {
                results.push(f.call(StudentDataTests, student, MasterSpreadsheet.getCbotTestSheet()));
            }
        }

        MasterSpreadsheet.recordCbotTestResults(student, results);

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        student.logFeedback(`CBOT Tests: ${finalResult ? 'ALL TESTS PASS' : 'INCOMPLETE'}`);
        return finalResult;
    },

    /**
     * Runs the Extra tests on the student file.
     * @param {Student} student 
     */
    runExtraTests: function (student) {
        student.logFeedback("\nRunning Extra Tests...");
        const results = new Array();

        for (const [_name, f] of Object.entries(ExtraTests)) {
            if (typeof f === 'function') {
                results.push(f.call(ExtraTests, student, MasterSpreadsheet.getCbotTestSheet()));
            }
        }

        MasterSpreadsheet.recordExtraTestResults(student, results);

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        student.logFeedback(`CBOT Tests: ${finalResult ? 'ALL TESTS PASS' : 'INCOMPLETE'}`);
        return finalResult;
    }
}