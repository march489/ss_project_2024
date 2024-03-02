Integrity = {
    initialized: false,
    report: null,
    buffer: EMPTY_CONTENT,

    initialize: function () {
        if (!Integrity.initialized) {
            Integrity.report = Integrity.getReportFile();
            Integrity.initialized = true;
        }
    },

    getReportFile: function () {
        if (Integrity.initialized) {
            return Integrity.report;
        } else {
            return Integrity.createReportFile();
        }
    },

    log: function (msg) {
        Integrity.buffer += msg + '\n';
    },

    flush: function () {
        Integrity.report.setContent(Integrity.buffer);
        Integrity.buffer = EMPTY_CONTENT;
    },

    createReportFile: function () {
        let currentdate = new Date();
        let timestamp = currentdate.getFullYear() + "-"
            + ((currentdate.getMonth() + 1).toString().padStart(2, 0)) + "-"
            + currentdate.getDate().toString().padStart(2, 0) + "_"
            + currentdate.getHours().toString().padStart(2, 0) +
            + currentdate.getMinutes().toString().padStart(2, 0) +
            + currentdate.getSeconds().toString().padStart(2, 0);
        let reportName = `IntegrityReport_${timestamp}.txt`;
        let reportFile = DriveApp.getFolderById(FEEDBACK_FOLDER_ID).createFile(reportName, EMPTY_CONTENT);
        Drive.Permissions.insert(
            {
                'role': 'reader',
                'type': 'user',
                'value': COTEACHER_EMAIL
            },
            reportFile.getId(),
            {
                'sendNotificationEmails': false
            });
        return reportFile;
    },

    /**
     * Entry point into the integrity script. Uses configs.js and constants.js 
     * to determine which tests to run on which students. 
     */
    runIntegrityChecks: function () {
        Integrity.initialize();
        if (TESTING_MODE) {
            let file = DriveApp.getFileById(DEV_STUDENT_FILE_ID);
            let student = new Student(file);
            Integrity.CheckStudentIntegrity(student);
        } else if (GRADE_WHOLE_SECTIONS) {
            if (GRADE_FIRST_PERIOD) {
                Integrity.GradeSection(FIRST_FOLDER_ID);
            }

            if (GRADE_FIFTH_PERIOD) {
                Integrity.GradeSection(FIFTH_FOLDER_ID);
            }

            if (GRADE_A_PERIOD) {
                Integrity.GradeSection(A_FOLDER_ID);
            }

            if (GRADE_B_PERIOD) {
                Integrity.GradeSection(B_FOLDER_ID);
            }

            if (GRADE_D_PERIOD) {
                Integrity.GradeSection(D_FOLDER_ID);
            }

            if (GRADE_B_TA) {
                Integrity.GradeSection(B_TA_FOLDER_ID);
            }
        } else {
            // grading specific student
            let fileName = `${SINGLE_STUDENT_NAME} - Credit Card & Spreadsheet Project 2024`;

            let files = DriveApp.getFilesByName(fileName);
            if (files.hasNext()) {
                let student = new Student(files.next());
                Integrity.CheckStudentIntegrity(student);
            } else {
                console.log(`No file found for ${SINGLE_STUDENT_NAME}`);
            }
        }

        Integrity.finalize();
    },

    finalize: function () {
        Integrity.initialize();
        Integrity.flush();
        console.log(Integrity.report.getName());
    },

    GradeSection: function (sectionFolderId) {
        let files = DriveApp.getFolderById(sectionFolderId).getFiles();
        while (files.hasNext()) {
            let studentFile = files.next();
            console.log(studentFile.getName());
            Integrity.CheckStudentIntegrity(new Student(studentFile));
        }
    },

    CheckStudentIntegrity: function (student) {
        console.log(student.name);
        Integrity.log(`${student.name}:`);
        let revisionIntegrity = Integrity.CheckRevisions(student);
        let permissionIntegrity = Integrity.CheckPermissions(student);
        let viewerIntegrity = Integrity.CheckViewers(student);
        let editorIntegrity = Integrity.CheckEditors(student);
        let ownerIntegrity = Integrity.CheckOwner(student);

        if (revisionIntegrity &&
            permissionIntegrity &&
            viewerIntegrity &&
            editorIntegrity &&
            ownerIntegrity) {
            Integrity.log('No issues found.\n');
        } else {
            Integrity.log('\n');
        }
    },

    CheckRevisions: function (student) {
        const revisions = Drive
            .Revisions
            .list(student.driveAppFile.getId());

        let alarmingRevisions = revisions
            .items
            .filter(rev => TEACHER_EMAILS.indexOf(rev.lastModifyingUser.emailAddress) < 0)
            .filter(rev => rev.lastModifyingUser.emailAddress !== student.email);

        if (alarmingRevisions.length > 0) {
            Integrity.log('\tAlarming Revisions:');
            alarmingRevisions.forEach((rev, index) => {
                Integrity.log(`\t\t${index + 1}. ${rev.lastModifyingUser.displayName} --> ${rev.modifiedDate}`);
            });
            Integrity.log('');
        }

        return alarmingRevisions.length > 0;
    },

    CheckPermissions: function (student) {
        const permissions = Drive
            .Permissions
            .list(student.driveAppFile.getId());

        let alarmingPermissions = permissions
            .items
            .filter(user => TEACHER_EMAILS.indexOf(user.emailAddress) < 0)
            .filter(user => user.emailAddress !== student.email);

        if (alarmingPermissions.length > 0) {
            Integrity.log('\tAlarming Permissions:');
            alarmingPermissions.forEach((user, index) => {
                Integrity.log(`\t\t${index + 1}. ${user.name} -- ${user.emailAddress}: ${user.role}`);
            });
            Integrity.log('');
        }

        return alarmingPermissions.length > 0;
    },

    CheckViewers: function (student) {
        const viewers = student
            .driveAppFile
            .getViewers();

        let alarmingViewers = viewers
            .filter(user => TEACHER_EMAILS.indexOf(user.getEmail()) < 0)
            .filter(user => user.getEmail() !== student.email);

        if (alarmingViewers.length > 0) {
            Integrity.log('\tAlarming Viewers:');
            alarmingViewers.forEach((user, index) => {
                Integrity.log(`\t\t${index + 1}. ${user.getName()}: ${user.getEmail()}`);
            });
            Integrity.log('');
        }

        return alarmingViewers.length > 0;
    },

    CheckEditors: function (student) {
        const editors = student
            .driveAppFile
            .getEditors();

        let alarmingEditors = editors
            .filter(user => TEACHER_EMAILS.indexOf(user.getEmail()) < 0)
            .filter(user => user.getEmail() !== student.email);

        if (alarmingEditors.length > 0) {
            Integrity.log('\tAlarming Editors:');
            alarmingEditors.forEach((user, index) => {
                Integrity.log(`\t\t${index + 1}. ${user.getName()}: ${user.getEmail()}`);
            });
            Integrity.log('');
        }

        return alarmingEditors.length > 0;
    },

    CheckOwner: function (student) {
        const owner = student
            .driveAppFile
            .getOwner();

        let isTeacher = TEACHER_EMAILS.indexOf(owner.getEmail()) >= 0;
        let isStudent = owner.getEmail() === student.email;

        let alarmingOwner = !(isStudent || isTeacher);

        if (alarmingOwner) {
            Integrity.log(`\tAlarming Owner: ${owner.getName()} -- ${owner.getEmail()}`);
        }

        return !alarmingOwner;
    },
}