import { browserManager } from "./BrowserManager";
// import { uploadSnapshot } from "./storage";
import { BrowserTaskInput, BrowserTaskOutput } from "./types";

export async function runBrowserTask(
    input: BrowserTaskInput
): Promise<BrowserTaskOutput> {
    const start = Date.now();
    const browser = await browserManager.getBrowser();
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    });

    const page = await context.newPage();

    try {
        await page.goto(input.url, {
            timeout: 45_000,
            waitUntil: "domcontentloaded"
        });

        if (input.waitFor?.selector) {
            await page.waitForSelector(
                input.waitFor.selector,
                { timeout: input.waitFor.timeoutMs ?? 20_000 }
            );
        }

        const html = await page.content();
        // const screenshot = await page.screenshot({ fullPage: true });

        // const screenshotUrl = await uploadSnapshot(
        //     input.runId,
        //     input.source,
        //     screenshot
        // );

        return {
            html,
            // screenshotUrl,
            latencyMs: Date.now() - start,
            debug: {
                userAgent: await page.evaluate(
                    () => navigator.userAgent
                ),
                viewport: page.viewportSize()!
            }
        };
    } finally {
        await page.close();
        await context.close();
    }
}
