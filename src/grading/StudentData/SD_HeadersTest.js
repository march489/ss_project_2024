SDHeadersTests =
{
    /**
     * Checks whether the student changed the background color on the title row
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckBackgroundColor: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = "";

        let backgroundColors = studentDataTestSheet
            .getRange(STUDENT_DATA_HEADER_RANGE)
            .getBackgrounds();
        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 10);
        let zippedArray = Utils.createZippedTwoArray(headerRowsCellNames, backgroundColors);

        let [row] = zippedArray;    // TODO fix needless destructuring
        let problemCells = row.filter(([_, color]) => color == '#ffffff');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: You haven't changed the background color in cell ${cell}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you change the background color on the header row?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the student's column heading are correct, and if 
     * they're spelled correctly
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckColumnHeadings: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = "";
        const referenceHeadings = [
            'studentname',
            'year',
            'major',
            'numberofsiblings',
            'gpa',
            'satverbal',
            'satmath',
            'chemistrymidtermscore',
            'totalsatscore',
            'passedchemistry'
        ];

        let titleRowHeadings = studentDataTestSheet
            .getRange(STUDENT_DATA_HEADER_RANGE)
            .getValues()
            .flat()
            .map((s) => String(s).toLowerCase().replaceAll(/\s/gi, ""));

        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 10)[0];
        let zippedArray = Utils.createZippedThreeArrayFlat(headerRowsCellNames, titleRowHeadings, referenceHeadings);

        let problemCells = zippedArray
            .filter(([_, studentHeading, referenceHeading]) => studentHeading !== referenceHeading);

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _0, _1]) => {
                errBuffer += `\n\t\t\tERROR: The heading in ${cell} is either blank or incorrect.` 
                    + `\n\t\t\t       Did you make a typo?`;
            })
        }

        let message = `\t\t${result ? "PASS" : "FAIL"}: Did you enter the correct column headings` 
            + `\n\t\t      and check the spelling?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks if the column headings are all bolded
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckHeadersBolded: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = "";

        let fontWeights = studentDataTestSheet
            .getRange(STUDENT_DATA_HEADER_RANGE)
            .getFontWeights();
        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 10);
        let zippedArray = Utils.createZippedTwoArray(headerRowsCellNames, fontWeights);

        let [row] = zippedArray;    // TODO fix needless destructuring
        let problemCells = row.filter(([_, weight]) => weight != 'bold');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: You didn't bold the header in cell ${cell}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you make the column headings bold?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks that the column headings are aligned center. 
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckHeadersCentered: function (student, studentDataTestSheet) {
        let result = true;
        let errBuffer = "";

        let alignments = studentDataTestSheet
            .getRange(STUDENT_DATA_HEADER_RANGE)
            .getHorizontalAlignments();
        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 10);
        let zippedArray = Utils.createZippedTwoArray(headerRowsCellNames, alignments);

        let [row] = zippedArray;    // TODO fix needless destructuring
        let problemCells = row.filter(([_, weight]) => weight != 'center');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: The header in cell ${cell} is not aligned center`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are the column headings aligned center?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}