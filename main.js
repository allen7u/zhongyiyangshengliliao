








const puppeteer = require('puppeteer');

var sell_time = new Date(2022,11,9,23,18,00,000).getTime();
var seconds_ahead = 1
var load_time = sell_time - seconds_ahead * 1000;

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
    if(request.url().includes('trade.order.build')) {
        var pending = setInterval(() => {
            if ( Date.now() > sell_time ) {
                request.continue();
                console.log('=>', print_current_time(), request.method(), request.url().slice(0, 70))
                clearInterval(pending);
            }
        }, 10);
    } else if (request.url().includes('trade.order.create')) {
        request.abort();
        console.log('<>', print_current_time(), request.method(), request.url().slice(0, 70))
    } else {
        request.continue()
        console.log('>>', print_current_time(), request.method(), request.url().slice(0, 70))
    }})

    // page.on('response', (response) => {
    // console.log('<<', print_current_time(), response.status(), response.url().slice(0, 70))
    // })

    var loop = setInterval( async () => {      

        var now = Date.now();
        if ( now > load_time ) {

            clearInterval(loop);
            console.log( print_current_time() + ' time is up');

            await page.reload();
            console.log( print_current_time() + ' reloaded');
            const button = await page.waitForXPath('//*[@id="submitBlock_1"]/div/div/div/div[3]');
            await button.click();

        } else if ( Math.floor( now/10 ) % 100 == 0 ) {
            console.log(`${Math.floor(( load_time - now )/1000)} seconds left`);
        }

    }, 10);

})()

function print_current_time() {
    var d = new Date();
    var n = d.toLocaleTimeString();
    // milliseconds part from the timestamp
    var ms = d.getMilliseconds();
    // make it 3 digits
    ms = ('000' + ms).slice(-3);
    // console.log(n);
    return n + '.' + ms;
}

// close x:
// /html/body/div[4]/div[2]/div


    // await page.reload();
    // // wait for the page to load
    // await page.waitForNavigation();

    // let page=await browser.newPage()
    // await page.goto('https://blogweb.cn');

    // wait for xpath to load and click
    
    
    // await page.close()
    // await browser.close()

    
// console.log(Math.floor( now/10 ))
// console.log(Math.floor( now/10 ) % 100)
// console.log(Math.floor( now/10 ) % 100 == 0)

// if (now - last_time > 1000) {
//     console.log(`${Math.floor((sell_time - now)/1000)} seconds left`);
//     last_time = now;
// }

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