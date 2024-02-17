APTHeaderTests =
{
    /**
     * Sets up a property called range with the A1:G1 range from the 
     * amazon purchases test sheet
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    // Setup: function (student, amazonPurchasesSheet) {
    //     amazonPurchasesSheet.activate();
    //     this.range = amazonPurchasesSheet.getRange('A1:G1');
    //     return true;
    // },

    /**
     * Checks whether the student changed the background color on the title row
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckBackgroundColor: function (student, amazonPurchasesSheet) {
        // let backgroundColors = this.range.getBackgrounds().flat();
        let result = true;
        let errBuffer = "";

        let backgroundColors = amazonPurchasesSheet
            .getRange(AMAZON_HEADER_RANGE)
            .getBackgrounds();
        let headerRowsCellNames = Utils.createCellNameArray(1, 1, 1, 7);
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

    // /**
    //  * Checks whether the student's column heading are correct, and if 
    //  * they're spelled correctly
    //  * @param {Student} student
    //  * @param {GoogleAppsScript.Spreadsheet.Sheet}
    //  * @returns {bool}
    //  */
    // CheckColumnHeadings: function (student, amazonPurchasesSheet) {
    //     const referenceHeadings = [
    //         'itemname',
    //         'link',
    //         'department',
    //         'deliverydate',
    //         'unitprice',
    //         'quantity',
    //         'subtotal'];

    //     let titleRowHeadings = this.range
    //         .getValues()
    //         .flat()
    //         .map((s) => s.toLowerCase())
    //         .map(s => s.replaceAll(" ", ""));

    //     if (referenceHeadings.length != titleRowHeadings.length) {
    //         student.logFeedback("\t\tFAIL -- Check Column Headings");
    //         return false;
    //     }

    //     // else keep going
    //     for (let i = 0; i < referenceHeadings.length; i++) {
    //         if (referenceHeadings[i] !== titleRowHeadings[i]) {
    //             student.logFeedback("\t\tFAIL -- Check Column Headings");
    //             return false;
    //         }
    //     }

    //     // everything checks out
    //     student.logFeedback("\t\tPASS -- Check Column Headings");
    //     return true;
    // },

    // /**
    //  * Checks if the column headings are all bolded
    //  * @param {Student} student
    //  * @param {GoogleAppsScript.Spreadsheet.Sheet}
    //  * @returns {bool}
    //  */
    // CheckHeadersBolded: function (student, amazonPurchasesSheet) {
    //     let fontWeights = this.range.getFontWeights().flat();

    //     for (fw of fontWeights) {
    //         if (fw != 'bold') {
    //             student.logFeedback("\t\tFAIL -- Check Headers Are Bolded");
    //             return false;
    //         }
    //     }

    //     student.logFeedback("\t\tPASS -- Check Headers Are Bolded");
    //     return true;
    // },

    // /**
    //  * Checks that the column headings are aligned center. 
    //  * @param {Student} student
    //  * @param {GoogleAppsScript.Spreadsheet.Sheet}
    //  * @returns {bool}
    //  */
    // CheckHeadersCentered: function (student, amazonPurchasesSheet) {
    //     let alignments = this.range.getHorizontalAlignments().flat();

    //     for (a of alignments) {
    //         if (a != 'center') {
    //             student.logFeedback("\t\tFAIL -- Check Headers Are Centered")
    //             return false;
    //         }
    //     }

    //     student.logFeedback("\t\tPASS -- Check Headers Are Centered");
    //     return true;
    // }
}