class StudentFile {
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
            console.log("Not turned in!");

            this.studentName = fileOwner.getName();
            this.studentEmail = fileOwner.getEmail();
        }

        let studentEmailId = this.studentEmail.match("[^@]+");
        this.feedbackFileName = `${studentEmailId}_feedback.txt`;

        console.log(`Feedback file: ${this.feedbackFileName}`);
    }

    Test() {
        // #TODO call to testing module
    }
}