class FeedbackFile {
    constructor(studentEmail) {
        this.studentEmail = studentEmail;
        let studentEmailId = studentEmail.match("[^@]+");
        this.feedbackFileName = `${studentEmailId}_feedback.txt`;

        let files = DriveApp
            .getFolderById(FEEDBACK_FOLDER_ID)
            .getFilesByName(this.feedbackFileName);

        if (files.hasNext()) {
            this.feedbackFile = files.next();
        } else {
            this.feedbackFile = this.createFeedbackFile();
        }
    }

    /**
     * Whipes the feedback file
     */
    reset() {
        this.clear();
        this.buffer = "";
    }

    /**
     * Appends the header to the feedback file buffer, correctly formatted,
     * but doesn't write to the file itself (this.flush()). Returns the datetime
     * string so that the master spreadsheet has the same timestamp
     * @param {string} studentName 
     * @param {string} projectUrl 
     * @returns {string} -- datetime that test began
     */
    createHeader(studentName, projectUrl) {
        let currentdate = new Date();
        let datetime = currentdate.getFullYear() + "/"
            + ((currentdate.getMonth() + 1).toString().padStart(2, 0)) + "/"
            + currentdate.getDate().toString().padStart(2, 0) + " @ "
            + currentdate.getHours().toString().padStart(2, 0) + ":"
            + currentdate.getMinutes().toString().padStart(2, 0) + ":"
            + currentdate.getSeconds().toString().padStart(2, 0) + ' CST';
        let heading = `Credit Card Project 2024: Test run at ${datetime}`;
        let nameLine = `Name:  \t\t ${studentName}`;
        let emailLine = `Email: \t\t ${this.studentEmail}`;
        let projectUrlLine = `Spreadsheet URL: ${projectUrl}`;

        this.log(heading);
        this.log(nameLine);
        this.log(emailLine);
        this.log(projectUrlLine);

        return datetime;
    }

    /**
     * Appends the message to the buffer
     * @param {string} msg 
     */
    log(msg) {
        this.buffer += msg + '\n';
    }

    /**
     * If the student's feedback file doesn't already exist, this creates and returns
     * it to the caller.
     * @returns {GoogleAppsScript.Drive.File}
     */
    createFeedbackFile() {
        let file = DriveApp.getFolderById(FEEDBACK_FOLDER_ID).createFile(this.feedbackFileName, EMPTY_CONTENT);
        Drive.Permissions.insert(
            {
                'role': 'reader',
                'type': 'user',
                'value': this.studentEmail
            },
            file.getId(),
            {
                'sendNotificationEmails': false
            });
        return file;
    }

    /**
     * Clears the feedback file
     */
    clear() {
        this.feedbackFile.setContent(EMPTY_CONTENT);
    }

    /**
     * Writes the contents of the buffer to the feedback file, 
     * consuming the buffer. Should only be called at the end of testing.
     */
    flush() {
        this.feedbackFile.setContent(this.buffer);
        this.buffer = EMPTY_CONTENT;
    }
}