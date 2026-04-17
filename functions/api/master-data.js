export async function onRequestGet(context) {
    if (!context.env.DB) {
        console.error(
            "DB binding is missing. Available keys:",
            Object.keys(context.env || {}),
        );

        return new Response(
            JSON.stringify({
                error: "Internal Server Error",
                message: "データベースの接続設定に問題が発生しています。",
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

        return new Response(JSON.stringify({ data: formattedData }), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("D1 Fetch Error:", error.message, error.stack);

        return new Response(
            JSON.stringify({
                error: "Internal Server Error",
                message: "データの取得中にエラーが発生しました。",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
