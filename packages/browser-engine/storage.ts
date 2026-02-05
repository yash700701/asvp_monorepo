import fs from "fs/promises";
import path from "path";

const DEFAULT_SNAPSHOT_DIR = path.resolve(
    process.cwd(),
    "data",
    "snapshots"
);

function sanitize(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function timestampSafe(): string {
    return new Date().toISOString().replace(/[:.]/g, "-");
}

export async function storeSnapshot(input: {
    runId: string;
    source: string;
    html: string;
    screenshot: Buffer;
}): Promise<{ htmlPath: string; screenshotPath: string }> {
    const baseDir = process.env.SNAPSHOT_DIR || DEFAULT_SNAPSHOT_DIR;
    const dir = path.join(
        baseDir,
        sanitize(input.source),
        sanitize(input.runId)
    );

    await fs.mkdir(dir, { recursive: true });

    const ts = timestampSafe();
    const htmlPath = path.join(dir, `${ts}.html`);
    const screenshotPath = path.join(dir, `${ts}.png`);

    await fs.writeFile(htmlPath, input.html, "utf8");
    await fs.writeFile(screenshotPath, input.screenshot);

    return { htmlPath, screenshotPath };
}
