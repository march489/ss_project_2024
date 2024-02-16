class Student {
    constructor(driveAppFile) {
        this.driveAppFile = driveAppFile;
        this.ExtractDataFromFile();
    }

    ExtractDataFromFile() {
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
                this.studentName = students[0].getName();
                this.studentEmail = students[0].getEmail();
            }

        }
        else {
            this.turnedInStatus = false;

            this.studentName = fileOwner.getName();
            this.studentEmail = fileOwner.getEmail();
        }

        this.feedbackFile = new FeedbackFile(this.studentEmail);
    }

    /**
     * Initializes the feedback file by creating its header.
     * @returns {string} -- returns the datetime that the test run began
     */
    prepFeedbackFile() {
        return this.feedbackFile.createHeader();
    }

    /**
     * Writes to the student's feedback file
     * @param {string} msg 
     */
    logFeedback(msg) {
        this.feedbackFile.log(msg);
    }

    /**
     * Clean up testing, flush feedback to .txt file
     */
    finalizeTesting() {
        this.feedbackFile.flush();
    }

}