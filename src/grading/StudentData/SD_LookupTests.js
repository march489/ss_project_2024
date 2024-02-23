LookupTests = {
    CheckValidity: function (student, studentDataTestSheet) {
        const NAMES = [
            'Alexandra',
            'Andrew',
            'Anna',
            'Becky',
            'Benjamin',
            'Carl',
            'Carrie',
            'Dorothy',
            'Dylan',
            'Edward',
            'Ellen',
            'Fiona',
            'John',
            'Jonathan',
            'Joseph',
            'Josephine',
            'Karen',
            'Kevin',
            'Lisa',
            'Mary',
            'Maureen',
            'Nick',
            'Olivia',
            'Pamela',
            'Patrick',
            'Robert',
            'Sean',
            'Stacy',
            'Thomas',
            'Will'];

        const SCORES = [
            1360,
            1070,
            1230,
            990,
            1300,
            1120,
            1230,
            1200,
            1190,
            1480,
            1200,
            1490,
            1530,
            1040,
            1300,
            1230,
            1120,
            1260,
            1230,
            1220,
            1340,
            1140,
            1350,
            1330,
            1160,
            1400,
            1230,
            1350,
            1000,
            1480];

        let result = true;
        let errBuffer = '';

        for (let index = 0; index < 30; index++) {
            try {
                studentDataTestSheet
                    .getRange(STUDENT_DATA_DATA_VALIDATION_RANGE)
                    .setValue(NAMES[index]);

                let expectedScore = SCORES[index];
                let actualScore = studentDataTestSheet
                    .getRange(STUDENT_DATA_LOOKUP_RANGE)
                    .getValue();

                if (expectedScore != actualScore) {
                    result = false;
                    errBuffer += `\n\t\t\tERROR: ${NAMES[index]}'s SAT score is ${expectedScore},`
                        + `\n\t\t\t       but your lookup returned ${actualScore}`;
                }
            } catch (e) {
                // protection in case student enters data validation by hand and typos
                result = false;
                errBuffer += `\n\t\t\tERROR: Lookup formula rejected valid input ${NAMES[index]}`;
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does the lookup in N3 return each student's SAT score?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckRejectsInvalidInput: function (student, studentDataTestSheet) {
        let result = true;
        const INVALID_INPUT = 'invalidvalue';

        try {
            studentDataTestSheet
                .getRange(STUDENT_DATA_DATA_VALIDATION_RANGE)
                .setValue(INVALID_INPUT);
            
                SpreadsheetApp.flush();

                result = studentDataTestSheet.getValue().replaceAll(' ','') === NA_ERROR_STRING;
        } catch(e) {
            // do nothing -- correctly rejects invalid input
        } 

        let errBuffer = result ? '' : '\n\t\t\tERROR: Lookup failed to reject an invalid student name';
        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does the lookup reject an invalid name?`;
        student.logFeedback(message + errBuffer);
    }
}