TestDriver = {
    /**
     * Runs the Amazon Purchases tests on the student file.
     * @param {Student} student 
     */
    runAmazonPurchaseTest: function (student) {
        MasterSpreadsheet.initialize();
        MasterSpreadsheet.createAmazonTestSheet(student);
        student.logFeedback("Running Amazon Purchases Test...");

        const results = new Array();
        let datetime = student.prepFeedbackFile();
        // let amazonPurchasesTestSheet = MasterSpreadsheet.getAmazonTestSheet();

        for (const [name, f] of Object.entries(AmazonPurchasesTest)) {
            results.push(f.call(null, student, MasterSpreadsheet.getAmazonTestSheet()));
        }   

        student.finalizeTesting();
    }
}