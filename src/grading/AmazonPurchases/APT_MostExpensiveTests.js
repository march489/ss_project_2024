MostExpensiveTests = {
    CheckValue: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = '';

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You have no data`;
            MostExpensiveTests.maxUnitPrice = null;
        } else {
            let unitPrices = amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .flat();

            MostExpensiveTests.maxUnitPrice = Math.max.apply(null, unitPrices);
            let maxUnitPriceIndex = unitPrices
                .indexOf(MostExpensiveTests.maxUnitPrice);

            let expectedMostExpensiveItem = amazonPurchasesTestSheet
                .getRange(2, 1, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .flat()[maxUnitPriceIndex];
            let actualMostExpensiveItem = amazonPurchasesTestSheet
                .getRange(AMAZON_MOST_EXPENSIVE_VALUE_RANGE)
                .getValue();

            result = (actualMostExpensiveItem === expectedMostExpensiveItem);
            errBuffer += result ? '' : `\n\t\t\tERROR: The most expensive item is ${expectedMostExpensiveItem},`
                + `\n\t\t\t       but J3 says it's ${actualMostExpensiveItem}`;
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does J3 show the most expensive item by unit price?`;
        student.logFeedback(message + errBuffer);
        return result;
    },

    CheckValidity: function (student, amazonPurchasesTestSheet) {
        let result = true;
        let errBuffer = '';

        if (APTDataTableCompleteTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You have no data`;
            MostExpensiveTests.maxUnitPrice = null;
        } else {
            let unitPricesRange = amazonPurchasesTestSheet
                .getRange(2, 5, APTDataTableCompleteTests.numRows - 1, 1);

            let rows = APTDataTableCompleteTests.numRows - 1;

            let items = amazonPurchasesTestSheet
                .getRange(2, 1, APTDataTableCompleteTests.numRows - 1, 1)
                .getValues()
                .flat();

            for (let row = 1; row <= rows; row++) {
                let newPrice = MostExpensiveTests.maxUnitPrice + row;
                unitPricesRange
                    .getCell(row, 1)
                    .setValue(newPrice);

                let expectedItem = items[row - 1];
                let actualItem = amazonPurchasesTestSheet
                    .getRange(AMAZON_MOST_EXPENSIVE_VALUE_RANGE)
                    .getValue();

                if (actualItem !== expectedItem) {
                    result = false;
                    errBuffer += `\n\t\t\tERROR: When the most expensive item was ${expectedItem.slice(0,10)}...,`
                        + `\n\t\t\t      J3 reported the most expensive was ${actualItem.slice(0,10)}...`;
                }
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Does the formula adapt as the most expensive item changes?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}