TotalSATTests = {
    CheckValues: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = '';

        let actualTotals = studentDataTestSheet
            .getRange(STUDENT_DATA_SAT_TOTAL_RANGE)
            .getValues();
        let expectedTotals = studentDataTestSheet
            .getRange(STUDENT_DATA_SAT_SUBSECTION_RANGE)
            .getValues()
            .map(([verbal, math]) => [verbal + math]);
        let cellNameArray = Utils
            .createCellNameArray(2, 9, 30, 1);
        let problematicCells = Utils
            .createZippedThreeArrayNested(cellNameArray, actualTotals, expectedTotals)
            .filter(([_c, actual, expected]) => actual != expected);

        if (problematicCells.length > 0) {
            result = false;
            problematicCells.forEach(([cell, actual, expected]) => {
                errBuffer += `\n\t\t\tERROR: In ${cell}, expected ${expected}, got ${actual}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are total scores the sum of students' math and verbal scores?`
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckFormulas: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = '';

        let currentSubsectionScores = studentDataTestSheet
            .getRange(STUDENT_DATA_SAT_SUBSECTION_RANGE)
            .getValues();
        let newExpectedTotalScores = currentSubsectionScores
            .map(([verbal, math]) => verbal + math + 50);
        let newSubsectionScores = currentSubsectionScores
            .map(([verbal, math]) => [verbal + 20, math + 30]);

        studentDataTestSheet
            .getRange(STUDENT_DATA_SAT_SUBSECTION_RANGE)
            .setValues(newSubsectionScores);

        let newActualTotalScores = studentDataTestSheet
            .getRange(STUDENT_DATA_SAT_TOTAL_RANGE)
            .getValues()
            .flat();
        let cellNameArray = Utils
            .createCellNameArray(2, 9, 30, 1);

        let problematicCells = Utils
            .createZippedThreeArrayFlat(cellNameArray, newExpectedTotalScores, newActualTotalScores)
            .filter(([_c, expected, actual]) => expected != actual);

        if (problematicCells.length > 1) {
            result = false;
            problematicCells.forEach(([cell, expected, actual]) => {
                errBuffer += `\n\t\t\tERROR: In ${cell}, expected ${expected}, but got ${actual}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are total scores calculated with formulas,`
            + `\n\t\t      and do they produce valid results when inputs change?`
        student.logFeedback(message + errBuffer);
        return result;
    },
}
