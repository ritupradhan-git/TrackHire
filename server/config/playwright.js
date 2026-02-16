import {chromium} from 'playwright';

let browser;

export const getBrowser = async () =>{
    if (!browser){ //if no browser then create a browser instance
        browser = await chromium.launch({
            headless:true,
            args:['--no-sandbox'],
        });
    }
    return browser; // or else return existing browser if broswer is present
}

export const closeBrowser = async ()=>{
    if(browser){
        await browser.close();
        browser=null;
    }
};