DoubleSortTests = {
    CheckNames: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = '';

        const SORTED_NAMES = [
            'Becky',
            'Carl',
            'Fiona',
            'Lisa',
            'Nick',
            'Patrick',
            'Thomas',
            'Alexandra',
            'Anna',
            'Benjamin',
            'Carrie',
            'Edward',
            'Joseph',
            'Karen',
            'Robert',
            'Andrew',
            'Dorothy',
            'Dylan',
            'Jonathan',
            'Josephine',
            'Pamela',
            'Stacy',
            'Will',
            'Ellen',
            'John',
            'Kevin',
            'Mary',
            'Maureen',
            'Olivia',
            'Sean'];

        const SORTED_GPAS = [
            2.954,
            1.557,
            2.372,
            3.259,
            2.864,
            3.027,
            2.590,
            4.025,
            2.993,
            3.427,
            2.331,
            2.769,
            3.016,
            3.405,
            3.793,
            2.974,
            3.154,
            4.202,
            2.686,
            4.081,
            3.367,
            2.841,
            2.029,
            4.371,
            2.052,
            3.238,
            1.180,
            3.398,
            4.352,
            4.349];

        let studentSortedNames = studentDataTestSheet
            .getRange(STUDENT_DATA_NAMES_RANGE)
            .getValues();

        let cellNameMatrixStudentNames = Utils.createCellNameArray(2, 1, 30, 1);

        let problematicNameCells = Utils
            .createZippedTwoArray(cellNameMatrixStudentNames, studentSortedNames)
            .map(([row]) => row)
            .filter(([_c, studentName], index) => studentName != SORTED_NAMES[index])

        if (problematicNameCells.length > 0) {
            result = false;
            problematicNameCells.forEach(([cell, name], index) => {
                errBuffer += `\n\t\t\tERROR: In ${cell}, expected ${SORTED_NAMES[index]} but got ${name}`;
            });
        } else {
            let cellNameMatrixGPAs = Utils.createCellNameArray(2, 5, 30, 1);
            let sortedStudentGpas = studentDataTestSheet
                .getRange(STUDENT_DATA_GPA_RANGE)
                .getValues();
            let problematicGpaCells = Utils
                .createZippedTwoArray(cellNameMatrixGPAs, sortedStudentGpas)
                .map(([row]) => row)
                .filter(([_c, gpa], index) => Math.abs(gpa - SORTED_GPAS[index]) > TOLERANCE);

            if (problematicGpaCells.length > 0) {
                result = false;


                errBuffer += `\n\t\t\tERROR: You only sorted columns A and C, not the whole table, `;
                errBuffer += `\n\t\t\t       breaking the tie between students and their data.`;
                errBuffer += `\n\t\t\t       You may need to ask for a clean copy of StudentData.`
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are students sorted alphabetically`
            + `\n\t\t     first by major and then by name?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}