Update = {
    runUpdate: function () {
        if (TESTING_MODE) {
            let file = DriveApp.getFileById(DEV_STUDENT_FILE_ID);
            let student = new Student(file);
            Update.updateStudent(student);
        } else if (GRADE_WHOLE_SECTIONS) {
            if (GRADE_FIRST_PERIOD) {
                Update.updateSection(FIRST_FOLDER_ID);
            }

            if (GRADE_FIFTH_PERIOD) {
                Update.updateSection(FIFTH_FOLDER_ID);
            }

            if (GRADE_A_PERIOD) {
                Update.updateSection(A_FOLDER_ID);
            }

            if (GRADE_B_PERIOD) {
                Update.updateSection(B_FOLDER_ID);
            }

            if (GRADE_D_PERIOD) {
                Update.updateSection(D_FOLDER_ID);
            }

            if (GRADE_B_TA) {
                Update.updateSection(B_TA_FOLDER_ID);
            }
        } else {
            // update single student
            let fileName = `${SINGLE_STUDENT_NAME} - Credit Card & Spreadsheet Project 2024`;

          let files = DriveApp.getFilesByName(fileName);
          if (files.hasNext()) {
            let student = new Student(files.next());
            Update.updateStudent(student);
          } else {
            console.log(`No file found for ${SINGLE_STUDENT_NAME}`);
          }
        }
    },

    updateSection: function (sectionFolderId) {
        let files = DriveApp.getFolderById(sectionFolderId).getFiles();
        while(files.hasNext()) {
            let studentFile = files.next();
            console.log(studentFile.getName());
            Update.updateStudent(new Student(studentFile));
        }
    },

    updateStudent: function (student) {
        MasterSpreadsheet.initialize();
        console.log(student.name);
        MasterSpreadsheet.copySheetMasterToStudent(student, SHEET_TO_PUSH, SHEET_PUSH_INDEX);
    }
}