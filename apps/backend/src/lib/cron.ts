export function frequencyToCron(frequency: string): string | null {
    switch (frequency) {
        case "daily":
        return "0 2 * * *";     // every day at 02:00 UTC
        case "weekly":
        return "0 3 * * 1";     // every Monday at 03:00 UTC
        case "manual":
        return null;
        default:
        return null;
    }
}
