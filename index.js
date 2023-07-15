import puppeteer from "puppeteer";

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

class WebsiteAutomator {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch({
            headless: false, defaultViewport: null,

        })
        this.page = await this.browser.newPage();
    }

    async selectAndClick(className, text, index) {
        await this.page.waitForSelector(className);
        await this.page.click(className);

        await this.page.waitForXPath(`//*[contains(text(), '${text}')]`);
        let elements = await this.page.$x(`//*[contains(text(), '${text}')]`);
        console.log(elements);
        await elements[index].click();
    }



    async selectCoin(coin, index) {
        await this.page.waitForSelector('.css-qjhap');
        const elements = await this.page.$$('.css-qjhap');
        await elements[index].click();
        await this.page.waitForSelector('.css-s1d1f4');
        await this.page.type('.css-s1d1f4', coin);
        await delay(1000);
        try {
            const coins = await this.page.$$('.cjxQGj');
            await coins[0].click();
        } catch (error) {
            console.log(error);
        }
    }

    async goToWebsite(url) {
        await this.page.goto(url);
        try {
            await this.selectAndClick('.css-1wy0on6', 'Arbitrum One', 0);
            await this.page.waitForSelector('.css-79elbk');
            let elements = await this.page.$$('.css-79elbk');
            for (const element of elements) {
                const inputField = await element.$('input');
                if (inputField) {
                    // Set the value of the input field
                    await inputField.click({ clickCount: 3 });
                    await inputField.press('Backspace');
                    await inputField.type('12');
                    break; // Exit the loop after setting the value
                }
            }

            await this.selectCoin('WBTC', 0);
            await this.selectCoin('USD Coin', 1);
            let counter = 0, id;
            id = setInterval(async () => {
                try {
                    let routes = await this.page.$$('.RouteWrapper');
                    if (routes && routes.length > 1) {
                        await routes[1].click();

                    }
                    counter++;
                } catch (error) {
                    console.log(error);
                    counter++;
                }
                if (counter == 3) {
                    clearInterval(id);
                }
            }, 7000);

        } catch (error) {
            console.log(error);
        }
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async run(url) {
        await this.launchBrowser();
        await this.goToWebsite(url);
        setTimeout(async () => {
            await this.closeBrowser();
        }, 30 * 1000);
    }
}

(async () => {
    const automator = new WebsiteAutomator();
    try {
        await automator.run("https://swap.defillama.com/");
    } catch (error) {
        console.log("ERROR : ", error);
    }
})();

