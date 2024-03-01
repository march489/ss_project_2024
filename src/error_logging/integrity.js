Integrity = {
    /**
     * Entry point into the integrity script. Uses configs.js and constants.js 
     * to determine which tests to run on which students. 
     */
    runIntegrityChecks: function () {
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
        Integrity.GetRevisionHistory(student);
        Integrity.GetPermissions(student);
    },

    GetRevisionHistory: function (student) {
        const revisions = Drive
            .Revisions
            .list(student.driveAppFile.getId());

        let index = 0;
        revisions.items.forEach(r => {
            console.log(`revision ${index++}`);
            console.log(`download url: ${r.downloadUrl}`);
            console.log(`etag: ${r.etag}`);
            console.log(`id: ${r.id}`);
            console.log(`kind: ${r.kind}`)
            console.log(`Last modifying user.displayName: ${r.lastModifyingUser.displayName}`);
            console.log(`last modifying user.email: ${r.lastModifyingUser.emailAddress}`);
        });
    },

    GetPermissions: function (student) {
        const permissions = Drive
            .Permissions
            .list(student.driveAppFile.getId());

        let index = 0;
        permissions.items.forEach(a => {
            console.log(`accessor ${index++}`);
            console.log(`additional roles: ${a.additionalRoles}`);
            console.log(`auth key: ${a.authKey}`);
            console.log(`deleted?: ${a.deleted}`);
            console.log(`domain: ${a.domain}`);
            console.log(`email address: ${a.emailAddress}`);
            console.log(`name: ${a.name}`)
        })

        try {
            const commenters = student
                .driveAppFile
                .getCommenters();

            console.log(`commenters: ${commenters}`);
        } catch (e) {
            console.log(`getCommenters() failed on ${student}'s file`);
        }

        console.log("viewers:");
        student
            .driveAppFile
            .getViewers()
            .forEach(user => {
                console.log(`user name: ${user.name}, email: ${user.emailAddress}`);
            });

        console.log("editors:");
        student
            .driveAppFile
            .getEditors()
            .forEach(user => {
                console.log(`user name: ${user.getName()}, email: ${user.getEmail()}`);
            });

        let owner = student
            .driveAppFile
            .getOwner();
        console.log(`user name: ${owner.getName()}, email: ${owner.getEmail()}`);
    }
}