CardBalanceOverTimeTests = {
    SheetIsSetUp: function (student, cbotTestSheet) {
        student.logFeedback("\n\tCard Balance Over Time Tests -- Running Sheet Is Set Up Tests...\n");
        const results = new Array();

        Object.values(SheetIsSetUpTests).forEach((f) => {
            if (typeof f === 'function') {
                results.push(f.call(this, student, cbotTestSheet));
            }
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("\n\tCard Balance Over Time Tests -- Sheet Is Set Up Tests: " + message + '\n');
        return finalResult;
    },

    RepaymentSchedule: function (student, cbotTestSheet) {
        student.logFeedback("\n\tCard Balance Over Time Tests -- Running Repayment Schedule Tests...\n");
        const results = new Array();
        Object.values(RepaymentScheduleTests).forEach((f) => {
            if (typeof f === 'function') {
                results.push(f.call(this, student, cbotTestSheet));
            }
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("\n\tCard Balance Over Time Tests -- Repayment Schedule Tests: " + message + '\n');
        return finalResult;
    },

    SummaryStats: function (student, cbotTestSheet) {
        student.logFeedback("\n\tCard Balance Over Time Tests -- Running Summary Stats Tests...\n");
        const results = new Array();
        Object.values(SummaryStatsTests).forEach((f) => {
            if (typeof f === 'function') {
                results.push(f.call(this, student, cbotTestSheet));
            }
        });

        let finalResult = results.reduce((b1, b2) => b1 && b2, true);

        let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
        student.logFeedback("\n\tCard Balance Over Time Tests -- Summary Stats Tests: " + message + '\n');
        return finalResult;
    }
}