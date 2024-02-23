DataValidationTests = {
    IsValidationPresent: function (student, studentDataTestSheet) {
        let validation = studentDataTestSheet
            .getRange(STUDENT_DATA_DATA_VALIDATION_RANGE)
            .getDataValidation()

        let result = validation !== null;

        let errBuffer = result ? '' : '\n\t\t\tERROR: No validation rule set on M3';
        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does M3 have a data validation rule active?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckInvalidInput: function (student, studentDataTestSheet) {
        let result = true;
        const INVALID_INPUT = 'invalidvalue';

        try {
            // first set valid value
            studentDataTestSheet
                .getRange(STUDENT_DATA_DATA_VALIDATION_RANGE)
                .setValue('Alexandra');

            // then try to set bad value
            studentDataTestSheet
                .getRange(STUDENT_DATA_DATA_VALIDATION_RANGE)
                .setValue(INVALID_INPUT);

            SpreadsheetApp.flush();
            // if the following line executes, error validation didn't trigger
            result = false;
        } catch (e) {
            // check Alexandra's value persists
            result = 1360 == studentDataTestSheet
                .getRange(STUDENT_DATA_LOOKUP_RANGE)
                .getValue();
        }

        let errBuffer = result ? '' : '\n\t\t\tERROR: Data validation didn\'t throw an error given invalid input';
        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does the data validation throw an error given invalid input?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}