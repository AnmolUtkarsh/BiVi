function parseTestId(testid) {
    if (typeof testid !== "string") {
        return null;
    }

    const match = testid.match(/^BV-(\d+)ii$/);

    if (!match) {
        return null;
    }

    const testId = Number(match[1]);

    return Number.isSafeInteger(testId) ? testId : null;
}