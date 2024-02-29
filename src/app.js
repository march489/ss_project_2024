/**
 * Grading application entry point.
 */
function Run() {
    TestDriver.runTests();
}

/**
 * Entry point for updating student files. 
 */
function UpdateFiles() {
    Update.runUpdate();
}

function SetupGradeSheet() {
    MasterSpreadsheet.setUpGradesheet();
}