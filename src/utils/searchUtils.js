export const matchSearchQuery = (food, query) => {
    if (!query) return true;

    const q = query.toLowerCase();

    const targets = [
        food.productName?.toLowerCase(),
        food.storeName?.toLowerCase(),
        food.options?.toLowerCase(),
        ...(food.tags || []).map((t) => t.toLowerCase()),
    ];

    return targets.some((target) => target?.includes(q));
};
