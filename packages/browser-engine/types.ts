export interface BrowserTaskInput {
    runId: string;
    source: string;
    url: string;
    waitFor?: {
        selector?: string;
        timeoutMs?: number;
    };
}

export interface BrowserTaskOutput {
    html: string;
    // screenshotUrl: string;
    latencyMs: number;
    debug: {
        userAgent: string;
        viewport: { width: number; height: number };
    };
}
