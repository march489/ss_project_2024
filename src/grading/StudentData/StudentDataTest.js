StudentDataTests = {
	RunDoubleSortedTests: function (student, studentDataTestSheet) {
		student.logFeedback("\n\tStudent Data Tests -- Running Double Sort Tests...\n");
		const results = new Array();
		Object.values(DoubleSortTests).forEach((f) => {
			results.push(f.call(this, student, studentDataTestSheet));
		});

		let finalResult = results.reduce((b1, b2) => b1 && b2, true);

		let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
		student.logFeedback("\n\tStudent Data Tests -- Double Sort Tests: " + message + '\n');
		return finalResult;
	},

	RunHeadersTests: function (student, studentDataTestSheet) {
		student.logFeedback("\n\tStudent Data Tests -- Running Headers Tests...\n");
		const results = new Array();
		Object.values(SDHeadersTests).forEach((f) => {
			results.push(f.call(this, student, studentDataTestSheet));
		});

		let finalResult = results.reduce((b1, b2) => b1 && b2, true);

		let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
		student.logFeedback("\n\tStudent Data Tests -- headers Tests: " + message + '\n');
		return finalResult;
	},
}