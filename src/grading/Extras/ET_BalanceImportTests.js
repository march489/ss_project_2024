BalanceImportTests = {
    Check: function (student, cbotTestSheet) {
        let result = true;
        let errBuffer = '';

        if (CardBalanceOverTimeTests.numRows <= 1) {
            result = false;
            errBuffer += `\n\t\t\tERROR: You have no data.`;
        } else {
            let currentValue = cbotTestSheet
                .getRange(CBOT_AMAZON_TOTAL_CELL)
                .getValue();
            let updatedValue = currentValue + 10;

            MasterSpreadsheet
                .getAmazonTestSheet()
                .getRange(AMAZON_TOTAL_COST_VALUE_RANGE)
                .setValue(updatedValue);

            let checkValue = cbotTestSheet
                .getRange(CBOT_AMAZON_TOTAL_CELL)
                .getValue();

            if (Math.abs(updatedValue - checkValue) > TOLERANCE) {
                result = false;
                errBuffer += `\n\t\t\tERROR: CBOT sheet does not update when the Total Cost`
                    + `\n\t\t\t\       on Amazon Purchases is updated.`;
            }
        }

        let message = `\t\t${result ? 'PASS' : 'FAIL'}: Is the total cost from Amazon Purchases imported into CBOT?`;
        student.logFeedback(message + errBuffer);
        return result;
    }
}