import { chromium, Browser } from "playwright";

class BrowserManager {
    private browsers: Browser[] = [];

    async getBrowser(): Promise<Browser> {
        if (this.browsers.length < 3) {
            const browser = await chromium.launch({
                headless: true,
                args: [
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox"
                ]
            });
            this.browsers.push(browser);
            return browser;
        }

        return this.browsers[
            Math.floor(Math.random() * this.browsers.length)
        ];
    }
}

export const browserManager = new BrowserManager();
