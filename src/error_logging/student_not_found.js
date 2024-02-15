class StudentNotFoundError extends Error {
    constructor(message, file) {
        super(message);
        this.name = "StudentNotFoundError";
        this.driveAppFile = file;
    }
}