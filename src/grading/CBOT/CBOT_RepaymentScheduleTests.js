RepaymentScheduleTests = {
    CheckUnpaidBalances: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 2) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            let apr = cbotTestSheet
                .getRange(CBOT_APR_CELL_RANGE)
                .getValue();
            const APR = apr ? apr : CBOT_DEFAULT_APR;

            // skip the last one
            let expectedUnpaidBalances = cbotTestSheet
                .getRange(2, 4, CardBalanceOverTimeTests.numRows - 2, 1)
                .getValues()
                .flat()
                .map(val => val * Math.exp(APR * 30 / 365));

            // skip the first one
            let actualUnpaidBalances = cbotTestSheet
                .getRange(3, 2, CardBalanceOverTimeTests.numRows - 2, 1)
                .getValues()
                .flat();

            let cellNames = Utils
                .createCellNameArray(3, 2, CardBalanceOverTimeTests.numRows - 2, 1)
                .flat();

            let badBalances = Utils
                .createZippedThreeArrayFlat(cellNames, expectedUnpaidBalances, actualUnpaidBalances)
                .filter(([_cell, expected, actual]) => Math.abs(expected - actual) > TOLERANCE);

            if (badBalances.length > 0) {
                result = false;
                badBalances.forEach(([cell, expected, actual]) => {
                    errBuffer += `\n\t\t\tERROR: Unpaid balance in ${cell} should be ${Utils.asMoney(expected)},`
                        + `\n\t\t\t       but instead got ${Utils.asMoney(actual)}`
                })
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are unpaid balances calculated with 30 days of interest`
            + `\n\t\t      from the previous balance after payment?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckBalancesAfter: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            // skip the first one
            let unpaidBalances = cbotTestSheet
                .getRange(2, 2, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat();

            let payments = cbotTestSheet
                .getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat();

            let actualAfterBalances = cbotTestSheet
                .getRange(2, 4, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat();

            let expectedAfterBalances = unpaidBalances
                .map((unpaidBal, index) => unpaidBal - payments[index]);

            let cellNames = Utils
                .createCellNameArray(2, 4, CardBalanceOverTimeTests.numRows - 1, 1)
                .flat();

            let badBalances = Utils
                .createZippedThreeArrayFlat(cellNames, expectedAfterBalances, actualAfterBalances)
                .filter(([_cell, expected, actual]) => Math.abs(expected - actual) > TOLERANCE);

            if (badBalances.length > 0) {
                result = false;
                badBalances.forEach(([cell, expected, actual]) => {
                    errBuffer += `\n\t\t\tERROR: Unpaid balance in ${cell} should be ${Utils.asMoney(expected)},`
                        + `\n\t\t\t       but instead got ${Utils.asMoney(actual)}`
                })
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are balances after payment calculated by subtracting`
            + `\n\t\t      the minimum payment from the unpaid balance?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckTotalsToDate: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            let actualTotalstd = cbotTestSheet
                .getRange(2, 5, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat();

            let payments = cbotTestSheet
                .getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat();

            // can we do this better?
            let expectedTotalstd = [];
            let partialSum = 0;
            for (let index = 0; index < CardBalanceOverTimeTests.numRows - 1; index++) {
                partialSum += payments[index];
                expectedTotalstd.push(partialSum);
            }

            let cellNameMatrix = Utils
                .createCellNameArray(2, 5, CardBalanceOverTimeTests.numRows - 1, 1);

            let badBalances = Utils
                .createZippedThreeArrayFlat(cellNameMatrix, expectedTotalstd, actualTotalstd)
                .filter(([_cell, expected, actual]) => Math.abs(expected - actual) > TOLERANCE);

            if (badBalances.length > 0) {
                result = false;
                badBalances.forEach(([cell, expected, actual]) => {
                    errBuffer += `\n\t\t\tERROR: Unpaid balance in ${cell} should be ${Utils.asMoney(expected)},`
                        + `\n\t\t\t       but instead got ${Utils.asMoney(actual)}`
                })
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are totals paid to date the sum of all payments up to`
            + `\n\t\t      and including that row?`;
        student.logFeedback(message + errBuffer);
        return result;
    },
}