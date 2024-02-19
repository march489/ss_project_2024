APTDataTableCompleteTests = {
    CheckDimensions: function (student, amazonPurchasesTestSheet) {
        APTDataTableCompleteTests.numRows = amazonPurchasesTestSheet
            .getRange(AMAZON_DATA_RANGE_START_CELL)
            .getDataRegion()
            .getValues()
            .map(row => row.filter(String))
            .filter(String)
            .length;

        let result = APTDataTableCompleteTests.numRows > 10;
        let errBuffer = "";

        if (!result) {
            errBuffer += `\n\t\t\tERROR: Expected at least 10 rows of data, but you have ${APTDataTableCompleteTests.numRows} rows`
        }
        let message = `\t\t${result ? "PASS" : "FAIL"}: Do you have at least 10 rows of data in your table (excluding headers)?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckNoNonemptyCells: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = "";

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer = "\n\t\t\tERROR: You have no data";
        } else {
            let valueMatrix = amazonPurchasesTestSheet
                .getRange(AMAZON_DATA_RANGE_START_CELL)
                .getDataRegion()
                .getValues()
                .slice(0, APTDataTableCompleteTests.numRows)
                .map(row => row.slice(0, 7));

            valueMatrix.shift();    // removes header row

            let cellNameMatrix = Utils.createCellNameArray(2, 1, APTDataTableCompleteTests.numRows - 1, 7);
            let zippedArray = Utils.createZippedTwoArray(cellNameMatrix, valueMatrix);
            let emptyCells = zippedArray
                .map(row => row.filter(([_, val]) => val.toString().trim() === "").map(([cell, _]) => cell))
                .flat();

            if (emptyCells.length > 1) {
                result = false;
                errBuffer = `\n\t\t\tERROR: The following cells are missing data: ${emptyCells}`;
            }
        }

        let message = `\t\t${result ? "PASS" : "FAIL"}: Is the data table completely filled in with no empty cells?`;
        student.logFeedback(message + errBuffer);
        return result;

    }
}