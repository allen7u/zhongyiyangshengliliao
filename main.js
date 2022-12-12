








// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const colors = require('colors');

puppeteer.use(StealthPlugin())

var sell_time = new Date(2022,11,13,00,30,00,000).getTime();
var seconds_ahead = 1
var build_request_safe_margin = 0
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
            if ( Date.now() > sell_time + build_request_safe_margin * 1000 ) {
                request.continue();
                console.log('=>'.green, print_current_time(), request.method(), request.url().slice(0, 70))
                clearInterval(pending);
            }
        }, 10);
    } else if (request.url().includes('trade.order.create')) {
        // request.abort();
        request.continue();
        console.log('<>'.red, print_current_time(), request.method(), request.url().slice(0, 70))
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
            // await page.reload(  { waitUntil: ['networkidle0', 'domcontentloaded'] }  );
            // await page.reload(  { waitUntil: ['domcontentloaded'] }  );
            // await page.reload(  { waitUntil: ['networkidle0'] }  );
            // await page.reload(  { waitUntil: ['networkidle2'] }  );
            // await page.reload( { waitUntil: ['load'] } );
            await page.reload();
            console.log( print_current_time() + ' reloaded');

            const submit_order = await page.waitForXPath('//*[@id="submitBlock_1"]/div/div/div/div[3]')
            await submit_order.click();
            console.log( print_current_time() + ' submit order button clicked');

            var submit_turn = 0;
            var punish_turn = 1;
            var pre_cash_turn = 1;
            var password_turn = 1;
            var submit_waiting = 0;
            var punish_waiting = 0;
            var pre_cash_waiting = 0;
            var password_waiting = 0;
            var submit_lock = 0;
            var punish_lock = 0;
            var pre_cash_lock = 0;
            var password_lock = 0;

            // check the submit order button with setInterval
            var submit = setInterval( async () => {

                if( submit_turn != 1 || submit_waiting == 1 || submit_lock == 1 ) {                    
                    // console.log( print_current_time() + ' submit_turn: ' + submit_turn + ' submit_lock: ' + submit_lock + ' submit_waiting: ' + submit_waiting);
                    return }
                
                submit_waiting = 1;
                const submit_order = await page.waitForXPath('//*[@id="submitBlock_1"]/div/div/div/div[3]',
                    {timeout: 500}).catch(() => {
                        submit_waiting = 0;
                        // console.log( print_current_time() + ' no submit order button');
                });
                submit_waiting = 0;

                if (submit_order ) {

                    console.log( print_current_time() + ' submit order button found');
                    submit_lock = 1;

                        // random delay between 125 and 175 ms
                        // var random_milliseconds = Math.floor(Math.random() * 50) + 125;
                        var random_milliseconds = Math.floor(Math.random() * 0) + 0;
                        setTimeout( async () => {
                            try{
                                await submit_order.click();
                                console.log( print_current_time() + ' submit order button clicked in ' + random_milliseconds + ' ms');
                                // clearInterval(submit);
                                submit_turn = 0;
                                submit_lock = 0;
                                punish_turn = 1;
                                pre_cash_turn = 1;
                                password_turn = 1;
                            } catch (e) {
                                console.log( print_current_time() + ' submit order button clicked error: '.red + e);
                            }
                        },  random_milliseconds );                   
                }
            }, 50);

            // check the punishment dialog with setInterval
            var punish = setInterval( async () => {

                if( punish_turn != 1 || punish_waiting == 1 || punish_lock == 1 ) { 
                    // // console.log( print_current_time() + ' punish_turn: ' + punish_turn + ' punish_lock: ' + punish_lock + ' punish_waiting: ' + punish_waiting);                    
                    return }
                
                punish_waiting = 1;
                const punish_dialog = await page.waitForXPath('/html/body/div[4]/div[2]/div',
                 {timeout: 500}).catch(() => {
                    punish_waiting = 0;
                    // console.log( print_current_time() + ' no punish dialog');
                });
                punish_waiting = 0;

                if (punish_dialog) {

                    console.log( print_current_time() + ' punish dialog found');
                    punish_lock = 1;

                    // random delay between 125 and 175 ms
                    // var random_milliseconds = Math.floor(Math.random() * 50) + 125;
                    var random_milliseconds = Math.floor(Math.random() * 0) + 0;
                    setTimeout( async () => {
                        try{
                            await punish_dialog.click();
                            console.log( print_current_time() + ' punish dialog clicked in ' + random_milliseconds + ' ms');
                            // clearInterval(punish);
                            punish_turn = 0;
                            punish_lock = 0;
                            submit_turn = 1;
                            pre_cash_turn = 0;
                            password_turn = 0;
                        }catch(e){
                            console.log( print_current_time() + ' punish dialog clicked error: '.red + e);
                        }
                    },  random_milliseconds );                    
                }
            }, 50);

            // check the pre cash confirm button with setInterval
            var pre_cash = setInterval( async () => {

                if( pre_cash_turn != 1 || pre_cash_waiting == 1 || pre_cash_lock == 1 ) {
                    // // console.log( print_current_time() + ' pre_cash_turn: ' + pre_cash_turn + ' pre_cash_lock: ' + pre_cash_lock + ' pre_cash_waiting: ' + pre_cash_waiting);
                    return }

                pre_cash_waiting = 1;
                const cashierPreConfirm = await page.waitForSelector
                ('#cashierPreConfirm > div.v2020v2-action > button', 
                {timeout: 500, visible: true }).catch(() => {
                    pre_cash_waiting = 0;
                    // console.log( print_current_time() + ' no cashierPreConfirm button');
                });
                pre_cash_waiting = 0;

                if (cashierPreConfirm) {

                    pre_cash_lock = 1;
                    console.log( print_current_time() + ' cashierPreConfirm button found');
                    await cashierPreConfirm.click();
                    console.log( print_current_time() + ' cashierPreConfirm button clicked');
                    pre_cash_lock = 0;

                    clearInterval(pre_cash);
                    clearInterval(punish);
                    clearInterval(submit);
                }
            }, 50);

            // check the password validation button with setInterval
            var password = setInterval( async () => {

                if( password_turn != 1 || password_waiting == 1 || password_lock == 1 ) {
                    // // console.log( print_current_time() + ' password_turn: ' + password_turn + ' password_lock: ' + password_lock + ' password_waiting: ' + password_waiting);
                    return }

                password_waiting = 1;
                const passwordConfirm = await page.waitForSelector
                ('#pwd_unencrypt',
                {timeout: 500, visible: true }).catch(() => {
                    password_waiting = 0;
                    // console.log( print_current_time() + ' no password input found');
                });
                password_waiting = 0;

                if (passwordConfirm) {

                    password_lock = 1;
                    console.log( print_current_time() + ' password input found');
                    await passwordConfirm.type('12345');
                    console.log( print_current_time() + ' password input clicked');
                    password_lock = 0;

                    clearInterval(password);
                    clearInterval(pre_cash);
                    clearInterval(punish);
                    clearInterval(submit);
                }
            }, 50);


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