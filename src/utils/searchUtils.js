export const matchSearchQuery = (food, query) => {
    const targets = [
        food.productName,
        food.storeName,
        food.options,
        ...(food.tags || []),
    ];

    return targets.some(
        (target) => typeof target === "string" && target.toLowerCase().includes(query)
    );
};
