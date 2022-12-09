








const puppeteer = require('puppeteer');

(async()=>{
    const browserURL = 'http://localhost:9222'
    let browser=await puppeteer.connect({ 
        browserURL : browserURL, 
        defaultViewport : null 
     });

    let pages = await browser.pages();
    let page = pages[0];
    console.log(await page.title());

    await page.setRequestInterception(true)

    page.on('request', (request) => {        
    console.log('>>', print_current_time(), request.method(), request.url().slice(0, 70))
    request.continue()
    })

    page.on('response', (response) => {
    console.log('<<', print_current_time(), response.status(), response.url().slice(0, 70))
    })

    await page.reload();
    // // wait for the page to load
    // await page.waitForNavigation();

    // let page=await browser.newPage()
    // await page.goto('https://blogweb.cn');

    // wait for xpath to load and click
    const button = await page.waitForXPath('//*[@id="__next"]/div[1]/div/div[2]');
    await button.click();
    
    // await page.close()
    // await browser.close()
})()

function print_current_time() {
    var d = new Date();
    var n = d.toLocaleTimeString();
    // milliseconds part from the timestamp
    var ms = d.getMilliseconds();
    // console.log(n);
    return n + '.' + ms;
}

// await page.setRequestInterception(true)

// page.on('request', (request) => {
//   console.log('>>', request.method(), request.url())
//   request.continue()
// })

// page.on('response', (response) => {
//   console.log('<<', response.status(), response.url())
// })


// await page.setUserAgent(
//     "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/16.0 Mobile/14E304 Safari/602.1"
//   )

// await browser.disconnect()

// for (const page of pages) {
    //     console.log(await page.title());
    // }

// // start time in milliseconds
// const start = new Date().getTime();
// // current time in milliseconds
// const now = new Date().getTime();
// // time difference in milliseconds
// const diff = now - start;
// // convert to seconds
// const seconds = Math.floor(diff / 1000);
// // extract milliseconds
// const ms = diff % 1000;
// // format as 00:00:00.000
// const time = `${seconds}.${ms}`;