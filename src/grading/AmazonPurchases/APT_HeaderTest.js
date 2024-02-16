APTHeaderTests =
{
    /**
     * Sets up a property called range with the A1:G1 range from the 
     * amazon purchases test sheet
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    Setup: function (student, amazonPurchasesSheet) {
        amazonPurchasesSheet.activate();
        this.range = amazonPurchasesSheet.getRange('A1:G1');
        return true;
    },

    /**
     * Checks whether the student changed the background color on the title row
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckBackgroundColor: function (student, amazonPurchasesSheet) {
        let backgroundColors = this.range.getBackgrounds().flat();

        for (color of backgroundColors) {
            if (color == '#ffffff') {
                student.logFeedback("\t\tFAIL -- Check Background Color");
                return false;
            }
        }

        student.logFeedback("\t\tPASS -- Check Background Color");
        return true;
    },

    /**
     * Checks whether the student's column heading are correct, and if 
     * they're spelled correctly
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckColumnHeadings: function (student, amazonPurchasesSheet) {
        const referenceHeadings = [
            'itemname',
            'link',
            'department',
            'deliverydate',
            'unitprice',
            'quantity',
            'subtotal'];

        let titleRowHeadings = this.range
            .getValues()
            .flat()
            .map((s) => s.toLowerCase())
            .map(s => s.replaceAll(" ", ""));

        if (referenceHeadings.length != titleRowHeadings.length) {
            student.logFeedback("\t\tFAIL -- Check Column Headings");
            return false;
        }

        // else keep going
        for (let i = 0; i < referenceHeadings.length; i++) {
            if (referenceHeadings[i] !== titleRowHeadings[i]) {
                student.logFeedback("\t\tFAIL -- Check Column Headings");
                return false;
            }
        }

        // everything checks out
        student.logFeedback("\t\tPASS -- Check Column Headings");
        return true;
    },

    /**
     * Checks if the column headings are all bolded
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckHeadersBolded: function () {
        let fontWeights = this.range.getFontWeights().flat();

        for (fw of fontWeights) {
            if (fw != 'bold') {
                student.logFeedback("\t\tFAIL -- Check Headers Are Bolded");
                return false;
            }
        }

        student.logFeedback("\t\tPASS -- Check Headers Are Bolded");
        return true;
    },

    /**
     * Checks that the column headings are aligned center. 
     * @param {Student} student
     * @param {GoogleAppsScript.Spreadsheet.Sheet}
     * @returns {bool}
     */
    CheckHeadersCentered: function () {
        let alignments = this.range.getHorizontalAlignments().flat();

        for (a of alignments) {
            if (a != 'center') {
                student.logFeedback("\t\tFAIL -- Check Headers Are Centered")
                return false;
            }
        }

        student.logFeedback("\t\tPASS -- Check Headers Are Centered");
        return true;
    }
}