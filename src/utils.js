Utils = {
    /**
     * 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
     * @param {GoogleAppsScript.Spreadsheet.Range} range 
     * @param {string[]} arr 
     */
    GetRowA1Notations: function (sheet, range, arr = []) {
        let numRows = range.getNumRows();

        if (numRows == 0) {
            return arr;
        } else if (numRows == 1) {
            arr.push(range.getA1Notation());
            return arr;
        } else {
            let topRowIndex = range.getRowIndex();
            let lastRowIndex = range.getLastRow();
            let leftColIndex = range.getColumnIndex();
            let rightColIndex = range.getLastColumn();
            let topRowRangeString = `R${topRowIndex}C${leftColIndex}:R${topRowIndex}C${rightColIndex}`
            let restRangeString = `R${topRowIndex + 1}C${leftColIndex}:R${lastRowIndex}C${rightColIndex}`

            arr.push(sheet.getRange(topRowRangeString).getA1Notation());
            return Utils.GetRowA1Notations(sheet, sheet.getRange(restRangeString), arr);
        }
    }
}