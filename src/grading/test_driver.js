TestDriver = {
    /**
     * Runs the Amazon Purchases tests on the student file.
     * @param {Student} student 
     */
    runAmazonPurchaseTest: function (student) {
        MasterSpreadsheet.initialize();
        MasterSpreadsheet.createAmazonTestSheet(student);
        let datetime = student.prepFeedbackFile();

        const results = new Array();

        // let amazonPurchasesTestSheet = MasterSpreadsheet.getAmazonTestSheet();

        for (const [name, f] of Object.entries(AmazonPurchasesTest)) {
            results.push(f.call(AmazonPurchasesTest, student, MasterSpreadsheet.getAmazonTestSheet()));
        }   

        student.finalizeTesting();
    }
}