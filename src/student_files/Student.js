class Student {
    constructor(driveAppFile) {
        this.driveAppFile = driveAppFile;
        this.spreadsheet = SpreadsheetApp.openById(this.driveAppFile.getId());
        this.url = driveAppFile.getUrl();
        this.results = [];
        this.ExtractDataFromFile();
    }

    ExtractDataFromFile () {
        this.fileName = this.driveAppFile.getName();

        let fileOwner = this.driveAppFile.getOwner();
        if (fileOwner.getEmail() == TEACHER_EMAIL) {
            this.turnedInStatus = true;
            console.log("Turned in!");

            const viewers = this.driveAppFile.getViewers();
            const students = viewers.filter(viewer => this.fileName.includes(viewer.getName()));

            if (students.length == 0) {
                throw new StudentNotFoundError(`File with id [${this.driveAppFile.getId()}] has no student owner`, this.driveAppFile);
            } else {
                this.name = students[0].getName();
                this.email = students[0].getEmail();
            }

        }
        else {
            this.turnedInStatus = false;

            this.name = fileOwner.getName();
            this.email = fileOwner.getEmail();
        }

        this.feedbackFile = new FeedbackFile(this.email);
    }

    /**
     * Initializes the feedback file by creating its header.
     * @returns {string} -- returns the datetime that the test run began
     */
    prepFeedbackFile () {
        this.feedbackFile.reset();
        return this.feedbackFile.createHeader(this.name, this.url);
    }

    /**
     * Writes to the student's feedback file
     * @param {string} msg 
     */
    logFeedback (msg) {
        this.feedbackFile.log(msg);
    }

    /**
     * Clean up testing, flush feedback to .txt file
     */
    finalizeTesting () {
        this.feedbackFile.flush();
        this.spreadsheet
            .getSheetByName(CHECKLIST_SHEET_NAME)
            .getRange(FEEDBACK_FILE_STAMP_CELL)
            .setFormula(`=HYPERLINK("${this.feedbackFile.feedbackFile.getUrl()}", "see detailed feedback")`);
        MasterSpreadsheet.recordGrades(this);
    }

    /**
     * Saves a copy of the test results to student data. 
     * @param {bool[]} testResults 
     */
    recordTestResults (testResults) {
        this.results.push.apply(this.results, testResults);
    }

    isLastEditByStudent() {
        let lastEditorEmail = this.getLastEditor();
        return lastEditorEmail !== TEACHER_EMAIL && lastEditorEmail !== COTEACHER_EMAIL;
    }

    getLastEditor () {
        let lastEditorEmail = this.email;
        try {
            const revisions = Drive
                .Revisions
                .list(this.driveAppFile.getId());

            let numRevisions = revisions.items.length;
            if (!revisions.items || numRevisions == 0) {
                console.log(`WARNING: ${this.name}'s spreadsheet has no revision history`);
            }

            lastEditorEmail = revisions
                .items[numRevisions - 1]
                .lastModifyingUser
                .emailAddress;

        } catch (e) {
            // do nothing
            console.log(`Error accessings ${this.name}'s revision history: ${e}`);
        }

        console.log(`last edited by ${lastEditorEmail}`);
        return lastEditorEmail;
    }
}