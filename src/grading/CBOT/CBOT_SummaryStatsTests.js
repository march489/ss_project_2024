SummaryStatsTests = {
     /**
     * Checks if the headings are present and spelled correctly
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
     * @returns {bool}
     */
    CheckHeadings: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        const HEADINGS = [
            'apr',
            'minimumpaymentpercentage',
            'minimummonthlypayment',
            '',
            'monthsspentinrepayment',
            'totalamountpaid',
            'totalinterestpaid',
            'effectiveinterestrate'];

        let cellNames = Utils
            .createZippedTwoArray(1, 7, 8, 1)
            .flat();

        let headings = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getValues()
            .flat()
            .map(h => String(h).toLowerCase().replaceAll(/\s/gi, ''));

        let problematicHeadings = Utils
            .createZippedThreeArrayFlat(cellNames, HEADINGS, headings)
            .filter(([_name, expected, actual]) => expected !== actual);

        if (problematicHeadings.length > 0) {
            result = false;
            problematicHeadings.forEach(([name, _expected, _actual]) => {
                errBuffer += `\n\t\t\tERROR: Cell ${cell} is incorrectly labeled`
                    + `\n\t\t\t       Did you make a typo?`
            })
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are the summary stat headings correct?`
        student.logFeedback(message + errBuffer);
        return result;
    },

     /**
     * Checks if the column headings are all bolded
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
     * @returns {bool}
     */
     CheckHeadersBolded: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let fontWeights = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getFontWeights();
        let headerRowsCellNames = Utils.createCellNameArray(1, 7, 8, 1);
        let zippedArray = Utils
            .createZippedTwoArray(headerRowsCellNames, fontWeights)
            .map(([row]) => row)
            .filter((_arr, index) => index != 3);

        console.log(zippedArray);

        let problemCells = zippedArray.filter(([_, weight]) => weight != 'bold');

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
     * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
     * @returns {bool}
     */
    CheckHeadersCentered: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let alignments = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getHorizontalAlignments();
        let headerRowsCellNames = Utils.createCellNameArray(1, 7, 8, 1);
        let zippedArray = Utils
            .createZippedTwoArray(headerRowsCellNames, alignments)
            .map(([row]) => row)
            .filter((_arr, index) => index != 3);

        let problemCells = zippedArray.filter(([_, weight]) => weight != 'center');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: The header in cell ${cell} is not aligned center`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are the column headings aligned center?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    /**
     * Checks whether the student changed the background color on the title row
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet} cbotTestSheet
     * @returns {bool}
     */
    CheckBackgroundColor: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = "";

        let backgroundColors = cbotTestSheet
            .getRange(CBOT_SUMMARY_STAT_HEADER_RAGE)
            .getBackgrounds();
        let headerRowsCellNames = Utils.createCellNameArray(1, 7, 8, 1);

        let zippedArray = Utils
            .createZippedTwoArray(headerRowsCellNames, backgroundColors)
            .map(([row]) => row)
            .filter((_arr, index) => index != 3);

        let problemCells = zippedArray.filter(([_, color]) => color == '#ffffff');

        if (problemCells.length > 0) {
            result = false;
            problemCells.forEach(([cell, _]) => {
                errBuffer += `\n\t\t\tERROR: You haven't changed the background color in cell ${cell}`;
            });
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Did you change the background color in the header column?`;
        student.logFeedback(message + errBuffer);
        return result;
    },
}