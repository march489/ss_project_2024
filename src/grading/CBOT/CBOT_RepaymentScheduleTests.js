RepaymentScheduleTests = {
    CheckFinalBalanceIsZero: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            let finalBalance = cbotTestSheet
                .getRange(CardBalanceOverTimeTests.numRows, 4, 1, 1)
                .getValue();

            if (finalBalance === undefined || finalBalance === null || Math.abs(finalBalance) > TOLERANCE) {
                result = false;
                errBuffer += `\n\t\t\tERROR: Final balance is ${finalBalance ? Utils.asMoney(finalBalance) : 'blank'}`
                    + `\n\t\t\t       instead of $0.00`;
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the final balance after payment in column D exactly $0.00?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

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

    CheckMinimumPayments: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 2) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            const validateMinPayment = (unpaidBalance, minPayment) => {
                if (typeof unpaidBalance === 'number' && typeof minPayment === 'number') {
                    const FOUR_PERCENT = CBOT_MIN_PAYMENT_PERCENTAGE * unpaidBalance;
                    if (unpaidBalance <= CBOT_MIN_PAYMENT_AMOUNT) {
                        return Math.abs(minPayment - unpaidBalance) < TOLERANCE ||
                            Math.abs(minPayment - CBOT_MIN_PAYMENT_AMOUNT) < TOLERANCE;
                    } else if (FOUR_PERCENT <= CBOT_MIN_PAYMENT_AMOUNT) {
                        return Math.abs(minPayment - CBOT_MIN_PAYMENT_AMOUNT) < TOLERANCE;
                    } else {
                        return Math.abs(minPayment - FOUR_PERCENT) < TOLERANCE;
                    }
                } else {
                    return false;
                }
            };

            let unpaidBalances = cbotTestSheet
                .getRange(2, 2, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat();

            let minPayments = cbotTestSheet
                .getRange(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
                .getValues()
                .flat();

            let cellNames = Utils
                .createCellNameArray(2, 3, CardBalanceOverTimeTests.numRows - 1, 1)
                .flat();

            let badBalances = Utils
                .createZippedThreeArrayFlat(cellNames, unpaidBalances, minPayments)
                .filter(([_cell, unpaidBal, minPay]) => !validateMinPayment(unpaidBal, minPay));

            if (badBalances.length > 0) {
                result = false;
                badBalances.forEach(([cell, expected, actual]) => {
                    errBuffer += `\n\t\t\tERROR: Minimum payment in ${cell} is incorrect`
                })
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Are the minimum payments calculated correctly?`;
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

    CheckUnpaidBalancesFormulas: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            let exponentialFormula = cbotTestSheet
                .getRange(CBOT_EXPONENTIAL_FORMULA_CELL)
                .getFormula();

            if (exponentialFormula === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Cell ${CBOT_EXPONENTIAL_FORMULA_CELL} is a hard-coded value. Use a formula.`;
            } else {
                let originalFinalBalance = cbotTestSheet
                    .getRange(CardBalanceOverTimeTests.numRows, 4)
                    .getValue();

                cbotTestSheet
                    .getRange(CBOT_EXPONENTIAL_FORMULA_CELL)
                    .autoFill(cbotTestSheet.getRange(3, 2, CardBalanceOverTimeTests.numRows - 2, 1),
                        SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

                let finalBalance = cbotTestSheet
                    .getRange(CardBalanceOverTimeTests.numRows, 4)
                    .getValue();

                if (finalBalance !== originalFinalBalance) {
                    result = false;
                    errBuffer += `\n\t\t\tERROR: Unpaid balance formula inconsistent or incorrect;`
                        + `\n\t\t\t       Please check formula in ${CBOT_EXPONENTIAL_FORMULA_CELL} and drag down again.`;
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the Unpaid Balance formula calculating interest coreectly?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckBalancesAfterFormula: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            let balancesAfterFormula = cbotTestSheet
                .getRange(CBOT_BALANCE_AFTER_FORMULA_CELL)
                .getFormula();

            if (balancesAfterFormula === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Cell ${CBOT_BALANCE_AFTER_FORMULA_CELL} is a hard-coded value. Use a formula.`;
            } else {
                let originalFinalBalance = cbotTestSheet
                    .getRange(CardBalanceOverTimeTests.numRows, 4)
                    .getValue();

                cbotTestSheet
                    .getRange(CBOT_BALANCE_AFTER_FORMULA_CELL)
                    .autoFill(cbotTestSheet.getRange(2, 4, CardBalanceOverTimeTests.numRows - 1, 1),
                        SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

                let finalBalance = cbotTestSheet
                    .getRange(CardBalanceOverTimeTests.numRows, 4)
                    .getValue();

                if (finalBalance !== originalFinalBalance) {
                    result = false;
                    errBuffer += `\n\t\t\tERROR: Unpaid balance formula inconsistent or incorrect;`
                        + `\n\t\t\t       Please check formula in ${CBOT_BALANCE_AFTER_FORMULA_CELL} and drag down again.`;
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the Balance After formula calculating balances correctly?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckTotalPaidFormula: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You don't have enough data`;
        } else {
            let balancesAfterFormula = cbotTestSheet
                .getRange(CBOT_TOTAL_PAID_FORMULA_CELL)
                .getFormula();

            if (balancesAfterFormula === '') {
                result = false;
                errBuffer += `\n\t\t\tERROR: Cell ${CBOT_TOTAL_PAID_FORMULA_CELL} is a hard-coded value. Use a formula.`;
            } else {
                let originalFinalBalance = cbotTestSheet
                    .getRange(CardBalanceOverTimeTests.numRows, 5)
                    .getValue();

                cbotTestSheet
                    .getRange(CBOT_TOTAL_PAID_FORMULA_CELL)
                    .autoFill(cbotTestSheet.getRange(3, 5, CardBalanceOverTimeTests.numRows - 2, 1),
                        SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

                let finalBalance = cbotTestSheet
                    .getRange(CardBalanceOverTimeTests.numRows, 5)
                    .getValue();

                if (finalBalance !== originalFinalBalance) {
                    result = false;
                    errBuffer += `\n\t\t\tERROR: Total Paid to Date formula inconsistent or incorrect;`
                        + `\n\t\t\t       Please check formula in ${CBOT_TOTAL_PAID_FORMULA_CELL} and drag down again.`;
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the Total Paid to Date formula`
            + `\n\t\t     calculating balances correctly?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}