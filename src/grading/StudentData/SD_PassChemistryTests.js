PassChemistryTests = {
    CheckValues: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = '';

        let expectedChemResults = studentDataTestSheet
            .getRange(STUDENT_DATA_CHEM_SCORE_RANGE)
            .getValues()
            .map(([score]) => {
                if (score < 75) {
                    return 75 - score;
                } else {
                    return 'PASS';
                }
            });
        let actualChemResults = studentDataTestSheet
            .getRange(STUDENT_DATA_CHEM_RESULT_RANGE)
            .getValues()
            .flat();
        let cellNameArray = Utils
            .createCellNameArray(2, 10, 30, 1);

        let problematicCells = Utils
            .createZippedThreeArrayFlat(cellNameArray, expectedChemResults, actualChemResults)
            .filter(([_c, expected, actual]) => {
                if (typeof expected !== typeof actual) {
                    return true;
                } else if (typeof expected === 'number') {
                    // both numbers
                    return Math.abs(expected - actual) > TOLERANCE;
                } else {
                    // both strings
                    return expected !== actual;
                }
            });

        if (problematicCells.length > 0) {
            result = false;
            problematicCells.forEach(([cell, expected, actual]) => {
                errBuffer += `\n\t\t\tERROR: In ${cell}, expected ${expected} but got ${actual}`;
            })
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you determine if students passed/failed correctly?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckFormulas: function (student, studentDataTestSheet) {
        // TODO implement
        return true;
    }
}