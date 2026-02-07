export function similarity(a: string, b: string): number {
    if (a === b) return 1;
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    if (longer.length === 0) return 1;

    const costs = [];
    for (let i = 0; i <= shorter.length; i++) costs[i] = i;

    for (let i = 1; i <= longer.length; i++) {
        let prev = i;
        for (let j = 1; j <= shorter.length; j++) {
            const curr = Math.min(
                costs[j] + 1,
                prev + 1,
                costs[j - 1] + (longer[i - 1] === shorter[j - 1] ? 0 : 1)
            );
            costs[j - 1] = prev;
            prev = curr;
        }
        costs[shorter.length] = prev;
    }

    const distance = costs[shorter.length];
    return 1 - distance / longer.length;
}
