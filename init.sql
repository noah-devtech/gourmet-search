CREATE TABLE IF NOT EXISTS "foodList" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "base" TEXT NOT NULL,
    "code" INTEGER,
    "storeName" TEXT NOT NULL,
    "category" TEXT,
    "lastUpdated" TEXT NOT NULL,
    "isActive" INTEGER NOT NULL CHECK ("isActive" IN (0, 1)) DEFAULT 1,
    "tags" TEXT,
    "productName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "size" TEXT,
    "options" TEXT
);