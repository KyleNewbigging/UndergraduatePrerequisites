
const playwright = require('playwright');
const { test, expect } = require('@playwright/test');
 
test('test1 - Course Search', async ({ page }) => {
   const browser = await playwright.chromium.launch({
     headless: true
   });
 
   page = await browser.newPage( {ignoreHTTPSErrors: true});
   await page.goto('https://131.104.49.103/')
   // Click text=Course Search
   await page.locator('text=Course Search').click();
   await expect(page).toHaveURL('https://131.104.49.103/UniSearch');
   // Select University of Guelph
   await page.locator('text=UniversityUniversity of Guelph >> select').selectOption('University of Guelph');
  
   // Select Computing and Information Science (CIS)
   await page.locator('text=DepartmentAccounting (ACCT)Agriculture (AGR)Animal Science (ANSC)Anthropology (A >> select').selectOption('Computing and Information Science (CIS)');
  
   // Fill [placeholder="Example\: \"1300\""]
   await page.locator('[placeholder="Example\\: \\"1300\\""]').fill('3760');
   // Fill [placeholder="Example\: \"0\.5\""]
   await page.locator('[placeholder="Example\\: \\"0\\.5\\""]').fill('0.75');
   // Click text=Submit
   await page.locator('text=Submit').click();
 
   // Test Output
   await expect(page.locator('.table')).toHaveText('CourseCourse NameSemesterCreditCIS*3760Software EngineeringFall and Winter0.75');
   console.log("done1");
});
 
test('test2 - Graph Search', async ({ page }) => {
     const browser = await playwright.chromium.launch({
     headless: true
   });
    page = await browser.newPage( {ignoreHTTPSErrors: true});
   await page.goto('https://131.104.49.103/')
   // Click text=Graph Search
   await page.locator('text=Graph Search').click();
   await expect(page).toHaveURL('https://131.104.49.103/GraphSearch');
   // Select University of Guelph
   await page.locator('text=UniversityUniversity of Guelph >> select').selectOption('University of Guelph');
   // Select Computing and Information Science (CIS)
   await page.locator('#courseSelect').selectOption('Computing and Information Science (CIS)');
    // Click text=Submit
   await page.locator('text=Submit').click();
   // Click svg:has-text("CIS*1000CIS*1050CIS*1200CIS*1250CIS*1300CIS*1500CIS*1910CIS*2030CIS*2500CIS*2170")
   await expect(page.locator('svg:has-text("CIS*1000CIS*1050CIS*1200CIS*1250CIS*1300CIS*1500CIS*1910CIS*2030CIS*2500CIS*2170")')).toHaveText("CIS*1000CIS*1050CIS*1200CIS*1250CIS*1300CIS*1500CIS*1910CIS*2030CIS*2500CIS*2170CIS*2250CIS*2430CIS*2520ENGG*1420ENGG*1500MATH*2000CIS*2750CIS*2910ENGG*1410CIS*3050CIS*3110CIS*3090ENGG*3640ENGG*2410.CIS*3120CIS*3130STAT*2040CIS*3150CIS*3490CIS*3190work experience in a related field.CIS*3210CIS*3250CIS*3260CIS*3760CIS*3530CIS*3700CIS*3750CIS*24609.00 credits  CIS*2520CIS*4010CIS*4020MATH*1160CIS*4030CIS*4050CIS*4150ENGG*4450CIS*4250CIS*4300CIS*4450CIS*4500CIS*4510CIS*4520CIS*4650CIS*4720CIS*4780CIS*4800CIS*4820CIS*49007.00 credits in CISCIS*4910");
    //await page.locator('text=CIS*3760').click();
   console.log("done2");
});









//test('test1', async ({ page }) => {
//    try{
//        await page.goto('https://131.104.49.103/UniSearch');
//        await page.selectOption('select#universitySelect', {label: 'University of Guelph'} );
//        await page.selectOption('select#departmentSelect', {label: 'Computing and Information Science (CIS)'} );
//       await page.fill('#coursecodeTextInput', '1300');
//        await page.click('text=Submit');
//        const course = await page.$$eval("tr", (Course) =>
//            Course.map((e) => e.textContent)
//        );
//        expect(course[1]).toBe('CIS*1300ProgrammingFall Only0.50');
//        page();
//    } catch(error){
//        page(error);
//    }
//});

//test('test2', async ({ page }) => {
//    await page.goto('https://131.104.49.103/UniSearch');
//    await expect(page).toHaveTitle('CIS 3760 Team 3');
//});
