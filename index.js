const puppeteer = require('puppeteer');
const log = require('./Functions/log');
const fs = require('fs');


(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    log('Opened browser');
    const page = await browser.newPage();
    
    // Navigate the page to a URL
    await page.goto('http://pt.edu.lv/pt/stundas.php?id=m&g=IPb21');
    
    const tablesSelector = 'td[valign=top]';
    await page.waitForSelector(tablesSelector);
    log('Page loaded');
    
    const lessonsJSON = await page.evaluate(() => {
        let tables = document.querySelectorAll('td[valign=top]');
        let rtn = [];
        

        for (table of tables) {
            // Filter out wrong tables
            if (/grupa|diena/gmi.test(table.textContent)) {
                continue;
            }


            let rows = table.querySelectorAll('table');
            
            // Convert object to array
            rows = Object.entries(rows).map(x => x[1]);
            let lessons = rows.map(row => row.textContent.split('\n'));

            rtn.push(lessons);
        }

        return rtn;
    });

    fs.writeFileSync('lessons.json', JSON.stringify(lessonsJSON, null, 4));
    log('Wrote lessons.json file');
    
    browser.close();
})();