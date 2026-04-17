export async function onRequestGet(context) {
    const availableKeys = Object.keys(context.env || {});

    if (!context.env.DB) {
        return new Response(
            JSON.stringify({
                error: "DB binding is missing",
                detected_keys: availableKeys,
                advice: "Check 'Settings > Functions > D1 database bindings' in Cloudflare Dashboard.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
    try {
        const { results } = await context.env.DB.prepare(
            "SELECT * FROM foodList",
        ).all();

        const formattedData = results.map((row) => {
            return {
                id: row.id,
                // DB(0 or 1) -> フロント(Boolean)
                isActive: row.isActive === 1,
                lastUpdated: row.lastUpdated,
                location: {
                    // DB(TEXT) -> フロント(Number)
                    base: parseInt(row.base, 10),
                    code: row.code,
                },
                storeName: row.storeName,
                productName: row.productName,
                price: row.price,
                size: row.size,
                options: row.options,
                tags: row.tags
                    ? row.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag !== "")
                    : [],
            };
        });

        return new Response(JSON.stringify(formattedData), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("D1 Error:", error);
        return new Response(
            JSON.stringify({
                error: "Failed to fetch data from D1",
                details: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
