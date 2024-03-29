AmazonPurchasesTest = {
  /**
   * Runs the Header test on the amazonPurchasesSheet on the Master Spreadsheet,
   * which is a copy of the student's version. The reference to the Student is used 
   * to log feedback
   * @param {Student} student 
   * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
   * @returns {bool} -- did all of the tests pass?
   */
  RunHeaderTests: function (student, amazonPurchasesTestSheet) {
    student.logFeedback("\n\tAmazon Purchases Test -- Running Header Tests...\n");
    const results = new Array();
    Object.values(APTHeaderTests).forEach((f) => {
      results.push(f.call(this, student, amazonPurchasesTestSheet));
    });

    let finalResult = results.reduce((b1, b2) => b1 && b2, true);

    let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
    student.logFeedback("\n\tAmazon Purchases Test -- Header Tests: " + message + '\n');
    return finalResult;
  },

  /**
   * Runs the Data Table Is Complete test on the amazonPurchasesSheet on the Master Spreadsheet,
   * which is a copy of the student's version. The reference to the Student is used 
   * to log feedback
   * @param {Student} student 
   * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
   * @returns {bool} -- did all of the tests pass?
   */
  RunDataTableCompleteTests: function (student, amazonPurchasesTestSheet) {
    student.logFeedback("\n\tAmazon Purchases Test -- Running Data Table Complete Tests...\n");
    const results = new Array();
    Object.values(APTDataTableCompleteTests).forEach((f) => {
      if (typeof f === 'function') {
        results.push(f.call(this, student, amazonPurchasesTestSheet));
      }
    });

    let finalResult = results.reduce((b1, b2) => b1 && b2, true);

    let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
    student.logFeedback("\n\tAmazon Purchases Test -- Data Table Complete Tests: " + message + '\n');
    return finalResult;
  },

  /**
   * Runs the Row Subtotal test on the amazonPurchasesSheet on the Master Spreadsheet,
   * which is a copy of the student's version. The reference to Student is used
   * to log feedback. 
   * @param {Student} student 
   * @param {GoogleAppsScript.Spreadsheet.Sheet} amazonPurchasesTestSheet 
   * @returns {bool} -- did all of the tests pass?
   */
  RunRowSubtotalTest: function (student, amazonPurchasesTestSheet) {
    student.logFeedback("\n\tAmazon Purchases Test -- Running Row Subtotal Tests...\n");
    const results = new Array();
    Object.values(APTRowRubtotalTests).forEach((f) => {
      if (typeof f === 'function') {
        results.push(f.call(this, student, amazonPurchasesTestSheet));
      }
    });

    let finalResult = results.reduce((b1, b2) => b1 && b2, true);

    let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
    student.logFeedback("\n\tAmazon Purchases Test -- Row Subtotal Tests: " + message + '\n');
    return finalResult;
  },

  RunTotalCostTest: function (student, amazonPurchasesTestSheet) {
    student.logFeedback('\n\tAmazon Purchases Test -- Runing Total Cost Tests...\n');
    const results = new Array();
    Object.values(APTTotalCostTests).forEach((f) => {
      if (typeof f === 'function') {
        results.push(f.call(this, student, amazonPurchasesTestSheet));
      }
    });

    let finalResult = results.reduce((b1, b2) => b1 && b2, true);
    
    let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
    student.logFeedback("\n\tAmazon Purchases Test -- Total Cost Tests: " + message + '\n');
    return finalResult;
  },

  RunAverageCostTest: function (student, amazonPurchasesTestSheet) {
    student.logFeedback('\n\tAmazon Purchases Test -- Runing Average Cost Tests...\n');
    const results = new Array();
    Object.values(AverageCostTests).forEach((f) => {
      if (typeof f === 'function') {
        results.push(f.call(this, student, amazonPurchasesTestSheet));
      }
    });

    let finalResult = results.reduce((b1, b2) => b1 && b2, true);
    
    let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
    student.logFeedback("\n\tAmazon Purchases Test -- Average Cost Tests: " + message + '\n');
    return finalResult;
  },

  RunMostExpensiveTest: function (student, amazonPurchasesTestSheet) {
    student.logFeedback('\n\tAmazon Purchases Test -- Runing Most Expensive Tests...\n');
    const results = new Array();
    Object.values(MostExpensiveTests).forEach((f) => {
      if (typeof f === 'function') {
        results.push(f.call(this, student, amazonPurchasesTestSheet));
      }
    });

    let finalResult = results.reduce((b1, b2) => b1 && b2, true);
    
    let message = finalResult ? "ALL TESTS PASS" : "INCOMPLETE";
    student.logFeedback("\n\tAmazon Purchases Test -- Most Expensive Tests: " + message + '\n');
    return finalResult;
  }
}