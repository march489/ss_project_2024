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

            let studentSortedNames = studentDataTestSheet
                .getRange(STUDENT_DATA_NAMES_RANGE)
                .getValues();

            let cellNameMatrix = Utils.createCellNameArray(2, 1, 30, 1);

            let zippedArray = Utils
                .createZippedTwoArray(cellNameMatrix, studentSortedNames)
                .map(([row]) => row);

            let problematicCells = zippedArray
                .filter(([_c, name], index) => name != SORTED_NAMES[index])

            if (problematicCells.length > 0) {
                result = false;
                problematicCells.forEach(([cell, name], index) => {
                    errBuffer += `\n\t\t\tERROR: In ${cell}, expected ${SORTED_NAMES[index]} but got ${name}`;
                });
            }

            let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are students sorted alphabetically first by major and then by name?`;
            student.logFeedback(message + errBuffer);
            return result;
    }
}