function Run() {
    let file = DriveApp.getFileById("1Kh8WNFDtveKfZX-gdxMRTZk8klz0qP5zCOSNuGpR1uw");
    let student = new Student(file);
    console.log(student.name);
    TestDriver.runAmazonPurchaseTest(student);
}
