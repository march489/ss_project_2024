Utils = {
    /**
     * Creates a zipped array where each entry is a 2-vector consisting of 
     * the cell address, the formula it contains, and its value. 
     * @param {string[][]} cellNameMatrix 
     * @param {string[][]} formulaMatrix 
     * @returns {string[][][]}
     */
    createZippedTwoArray: function (cellNameMatrix, formulaMatrix) {
        let zippedMatrix = [];
        let numRows = cellNameMatrix.length;

        for (let i = 0; i < numRows; i++) {
            let zippedRow = cellNameMatrix[i].map((cellName, index) => {
                return [cellName,
                    formulaMatrix[i][index]];
            });

            zippedMatrix.push(zippedRow);
        }

        return zippedMatrix;
    },

    /**
     * Creates a zipped array where each entry is a 3-vector consisting of 
     * the cell address, the formula it contains, and its value. 
     * @param {string[][]} cellNameMatrix 
     * @param {string[][]} formulaMatrix 
     * @param {string[][]} valueMatrix 
     * @returns {string[][][]}
     */
    createZippedThreeArray: function (cellNameMatrix, formulaMatrix, valueMatrix) {
        let zippedMatrix = [];
        let numRows = cellNameMatrix.length;

        for (let i = 0; i < numRows; i++) {
            let zippedRow = cellNameMatrix[i].map((cellName, index) => {
                return [cellName,
                    formulaMatrix[i][index],
                    valueMatrix[i][index]];
            });

            zippedMatrix.push(zippedRow);
        }

        return zippedMatrix;
    },

    /**
     * Returns a nested array of cell names
     * @param {number} topRow - row number for the first row in the grid
     * @param {number} leftCol - col number for the left column, where A = 1
     * @param {number} numRows 
     * @param {number} numCols 
     * @returns {string[][]}
     */
    createCellNameArray(topRow, leftCol, numRows, numCols) {
        let result = [];

        for (let row = topRow; row < topRow + numRows; row++) {
            let tmp = [];

            for (let ch = 64 + leftCol; ch < 64 + leftCol + numCols; ch++) {
                tmp.push(String.fromCharCode(ch) + String(row));
            }

            result.push(tmp);
        }

        return result;
    }
}