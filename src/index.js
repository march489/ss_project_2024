function Run() {
    let file = DriveApp.getFileById("1Kh8WNFDtveKfZX-gdxMRTZk8klz0qP5zCOSNuGpR1uw");
    let studentFile = new StudentFile(file);
    console.log(studentFile.studentName);
}