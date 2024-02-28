Utils = {
    /**
     * An easy way to format floats as percentages in the feedback file.
     * @param {float} val 
     * @returns {string} -- value formatted as USD with commas and 2 decimal places. 
     */
    asPercent: function (val) {
        if (val !== null && val !== undefined && typeof val === 'number') {
            return `${String((100 * val).toFixed(3))}%`;
        } else {
            return '0.000%';
        };
    },

    /**
     * An easy way to format floats as money in the feedback file.
     * @param {float} val 
     * @returns {string} -- value formatted as USD with commas and 2 decimal places. 
     */
    asMoney: function (val) {
        if (val !== null && val !== undefined) {
            return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        } else {
            return '$0.00';
        };
    },

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
     * Returns a flat zipped array of trios from three flat lists.
     * The nested version works with nested lists.
     * @param {any[]} ls1 
     * @param {any[]} ls2 
     * @param {any[]} ls3 
     * @returns -- array of trios
     */
    createZippedThreeArrayFlat: function (ls1, ls2, ls3) {
        let zippedArray = [];
        ls1.forEach((item, index) => {
            zippedArray.push([item, ls2[index], ls3[index]]);
        });
        return zippedArray;
    },

    /**
     * Creates a zipped array where each entry is a 3-vector consisting of 
     * the cell address, the formula it contains, and its value. 
     * @param {string[][]} cellNameMatrix 
     * @param {string[][]} formulaMatrix 
     * @param {string[][]} valueMatrix 
     * @returns {string[][][]}
     */
    createZippedThreeArrayNested: function (cellNameMatrix, formulaMatrix, valueMatrix) {
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