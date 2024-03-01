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

/**
 * Use once to set up project links and
 * links to feedback files
 */
function SetupGradeSheet() {
    MasterSpreadsheet.setUpGradesheet();
}

/**
 * Checks the integrity of students' work
 */
function CheckIntegrity() {
    Integrity.runIntegrityChecks();
}