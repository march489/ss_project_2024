ExtraTests = {
    BalanceImport: function (student, cbotTestSheet) {
        student.logFeedback("\n\tExtra Tests -- Running Balance Import Tests...\n");
        const results = new Array();

        Object.values(BalanceImportTests).forEach((f) => {
            if (typeof f === 'function') {
                results.push(f.call(this, student, cbotTestSheet));
            }
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("\n\tExtra Tests -- Balance Import Tests: " + message + '\n');
        return finalResult;
    },

    DateIncrement: function (student, cbotTestSheet) {
        student.logFeedback("\n\tExtra Tests -- Running Date Increment Tests...\n");
        const results = new Array();

        Object.values(DateIncrementTests).forEach((f) => {
            if (typeof f === 'function') {
                results.push(f.call(this, student, cbotTestSheet));
            }
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("\n\tExtra Tests -- Date Increment Tests: " + message + '\n');
        return finalResult;
    },

    NoOverpayment: function (student, cbotTestSheet) {
        student.logFeedback("\n\tExtra Tests -- Running No Overpayment Tests...\n");
        const results = new Array();

        Object.values(NoOverpaymentTests).forEach((f) => {
            if (typeof f === 'function') {
                results.push(f.call(this, student, cbotTestSheet));
            }
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("\n\tExtra Tests -- No Overpayment Tests: " + message + '\n');
        return finalResult;
    }
}