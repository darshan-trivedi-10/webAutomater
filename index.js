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
            headless: false,
            defaultViewport: null,
        })
        this.page = await this.browser.newPage();
    }

    async selectAndClick(className, text, index) {
        // Wait for the selector to appear and click on the element
        await this.page.waitForSelector(className);
        await this.page.click(className);

        // Find the element using XPath that contains the specified text and click on it
        const elementXPath = `//*[contains(text(), '${text}')]`;
        await this.page.waitForXPath(elementXPath);
        let elements = await this.page.$x(elementXPath);
        await elements[index].click();
    }

    async selectCoin(coin, index) {

        // Wait for the coin selector to appear and click on the specified index
        await this.page.waitForSelector('.css-qjhap');
        const elements = await this.page.$$('.css-qjhap');
        await elements[index].click();

        // Wait for the input field to appear, type the coin name, and add a delay
        await this.page.waitForSelector('.css-s1d1f4');
        await this.page.type('.css-s1d1f4', coin);
        await delay(1000);

        try {
            // Attempt to click on the first coin option (if available)
            const coins = await this.page.$$('.cjxQGj');
            await coins[0].click();
        } catch (error) {
            console.log(error);
        }
    }

    async goToWebsite(url) {

        await this.page.goto(url);

        try {
            // Select 'Arbitrum One' from the dropdown menu
            await this.selectAndClick('.css-1wy0on6', 'Arbitrum One', 0);

            // Set the value of the input field to '12'
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

            // Select coins 'WBTC' and 'USD Coin'
            await this.selectCoin('WBTC', 0);
            await this.selectCoin('USD Coin', 1);

            // Click on the second route after a delay of 7 seconds, repeated 3 times
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

