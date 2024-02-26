SiblingsTest = {
    CheckValue: function (student, studentDataTestSheet) {
        let errBuffer = '';

        let siblings = studentDataTestSheet
            .getRange(STUDENT_DATA_SIBLING_RANGE)
            .getValues();
        let majors = studentDataTestSheet
            .getRange(STUDENT_DATA_MAJOR_RANGE)
            .getValues();

        let expectedMathSiblings = Utils
            .createZippedTwoArray(majors, siblings)
            .map(([row]) => row)
            .filter(([major, _s]) => major === 'Math')
            .reduce((total, [_m, sibs]) => total + sibs, 0);

        let actualMathSiblings = studentDataTestSheet
            .getRange(STUDENT_DATA_SUMIF_RANGE)
            .getValue()

        let result = (expectedMathSiblings == actualMathSiblings);
        if (!result) {
            errBuffer = `\n\t\t\tERROR: In ${STUDENT_DATA_SUMIF_RANGE}, expected siblings for math majors (${expectedMathSiblings})`
                + `\n\t\t\t      doesn't match the actual amount (${actualMathSiblings})`;
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Do you correctly calculate the total sibs for math majors?`
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckFormula: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = '';

        let siblings = studentDataTestSheet
            .getRange(STUDENT_DATA_SIBLING_RANGE)
            .getValues();
        let majors = studentDataTestSheet
            .getRange(STUDENT_DATA_MAJOR_RANGE)
            .getValues();
        let zippedData = Utils
            .createZippedTwoArray(majors, siblings);

        const OTHER_MAJORS = ['Art', 'English', 'Physics'];
        let originalFormula = studentDataTestSheet
            .getRange(STUDENT_DATA_SUMIF_RANGE)
            .getFormula()
            .toString()
            .toLowerCase()
            .replaceAll(/\s/gi, '');

        for (major of OTHER_MAJORS) {
            let modifiedFormula = originalFormula.replaceAll('math', major);
            studentDataTestSheet
                .getRange(STUDENT_DATA_SUMIF_RANGE)
                .setFormula(modifiedFormula);

            let actualValue = studentDataTestSheet
                .getRange(STUDENT_DATA_SUMIF_RANGE)
                .getValue();
            let expectedValue = zippedData
                .map(([row]) => row)
                .filter(([maj, _s]) => maj === major)
                .reduce((total, [_m, sibs]) => total + sibs, 0);

            if (actualValue != expectedValue) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Modified formula ${modifiedFormula} should have`
                    + `\n\t\t\t       counted (${expectedValue}) siblings, but instead got (${actualValue})`;
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does your formula work for other majors?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}