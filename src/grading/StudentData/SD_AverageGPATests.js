AverageGPATests = {
    CheckValue: function (student, studentDataTestSheet) {
        let errBuffer = '';

        let gpas = studentDataTestSheet
            .getRange(STUDENT_DATA_GPA_RANGE)
            .getValues();
        let years = studentDataTestSheet
            .getRange(STUDENT_DATA_YEAR_RANGE)
            .getValues();

        let freshmen = Utils
            .createZippedTwoArray(years, gpas)
            .map(([row]) => row)
            .filter(([year, _gpa]) => year === 'Freshman');

        let classSize = freshmen.length;

        let expectedAverage = freshmen
            .reduce((total, [_year, gpa]) => total + gpa, 0)
            / classSize;
        let actualAverage = studentDataTestSheet
            .getRange(STUDENT_DATA_AVERAGEIF_RANGE)
            .getValue();

        let result = Math.abs(expectedAverage - actualAverage) < TOLERANCE;

        if (!result) {
            errBuffer = `\n\t\t\tERROR: In ${STUDENT_DATA_AVERAGEIF_RANGE}, expected average freshman GPA, ${expectedAverage}`
                + `\n\t\t\t      doesn't match the actual amount ${actualAverage}`;
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Do you correctly calculate the average GPA for freshmen?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckFormula: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = '';

        let gpas = studentDataTestSheet
            .getRange(STUDENT_DATA_GPA_RANGE)
            .getValues();
        let years = studentDataTestSheet
            .getRange(STUDENT_DATA_YEAR_RANGE)
            .getValues();
        let zippedData = Utils
            .createZippedTwoArray(years, gpas)
            .map(([row]) => row);

        const OTHER_CLASSES = ['Sophomore', 'Junior', 'Senior'];
        let originalFormula = studentDataTestSheet
            .getRange(STUDENT_DATA_AVERAGEIF_RANGE)
            .getFormula();

        for (cl of OTHER_CLASSES) {
            let modifiedFormula = originalFormula.replaceAll('Freshman', cl);
            studentDataTestSheet
                .getRange(STUDENT_DATA_AVERAGEIF_RANGE)
                .setFormula(modifiedFormula);

            let actualValue = studentDataTestSheet
                .getRange(STUDENT_DATA_AVERAGEIF_RANGE)
                .getValue();

            let classmates = zippedData
                .filter(([year, _gpa]) => year === cl);

            let classSize = classmates.length;
            let expectedValue = classmates
                .reduce((total, [_year, gpa]) => total + gpa, 0)
                / classSize;

            if (Math.abs(actualValue - expectedValue) > TOLERANCE) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Modified formula ${modifiedFormula} should have`
                    + `\n\t\t\t       calculated average (${expectedValue.toFixed(4)}), but instead got (${actualValue.toFixed(4)})`;
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does your formula work for other years?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}