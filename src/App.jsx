import { useMemo } from "react";
import Card from "./components/Card";
import FilterButton from "./components/FilterButton";
import { useState } from "react";

function App() {
    // Query Text
    const [inputQuery, setInputQuery] = useState("");

    // User Input Filters
    const [selectedBase, setSelectedBase] = useState("all");
    const [showActive, setShowActive] = useState(true);
    const [showThisYear, setShowThisYear] = useState(true);


    const foods = [
        {
            "id": "P00202",
            "location": {
                "base": 3,
                "code": 6
            },
            "storeName": "からきち屋",
            "category": "food",
            "lastUpdated": "2026-03-21",
            "isActive": true,
            "tags": ["唐揚げ", "弁当", "大盛り"],
            "productName": "唐揚げ弁当",
            "price": 1300,
            "size": "大盛り",
            "options": "唐揚げ4個・ライス350g"
        },
        {
            "id": "P00202",
            "location": {
                "base": 1,
                "code": 6
            },
            "storeName": "からきち屋",
            "category": "food",
            "lastUpdated": "2025-03-21",
            "isActive": true,
            "tags": ["唐揚げ", "弁当", "大盛り"],
            "productName": "唐揚げ弁当",
            "price": 1300,
            "size": "大盛り",
            "options": "唐揚げ4個・ライス350g"
        }
    ]

    const filteredFoods = useMemo(() => {
        return foods.filter(food => {
            // 販売終了フィルタ
            if (showActive && !food.isActive) return false;

            // 今年確認済みフィルタ
            if (showThisYear) {
                const currentYear = new Date().getFullYear();
                const foodYear = new Date(food.lastUpdated).getFullYear();
                if (foodYear !== currentYear) return false;
            }

            // 塁側フィルタ
            if (selectedBase !== 'all' && food.location?.base !== selectedBase) return false;

            // 検索クエリ（商品名・店舗名）
            if (inputQuery) {
                const query = inputQuery.toLowerCase();
                const matchProduct = food.productName.toLowerCase().includes(query);
                const matchStore = food.storeName.toLowerCase().includes(query);
                if (!matchProduct && !matchStore) return false;
            }

            return true;
        });
    }, [foods, inputQuery, selectedBase, showActive, showThisYear]);

    return (
        <div className="App">
            <h1>獅子まんま 検索システム🔍️</h1>
            <input
                className="search-input"
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="商品名、店舗名で検索..."
            />

            <div class="filters">
                <FilterButton
                    label="すべて"
                    isActive={selectedBase === 'all'}
                    onClick={() => setSelectedBase('all')}
                />
                <FilterButton
                    label="1塁側"
                    isActive={selectedBase === 1}
                    onClick={() => setSelectedBase(1)}
                />
                <FilterButton
                    label="3塁側"
                    isActive={selectedBase === 3}
                    onClick={() => setSelectedBase(3)}
                />
                <FilterButton
                    label="販売終了を含める"
                    isActive={!showActive}
                    onClick={() => setShowActive(prev => !prev)}
                />
                <FilterButton
                    label="今年確認済みのみ"
                    isActive={showThisYear}
                    onClick={() => setShowThisYear(prev => !prev)}
                />

            </div>
            <div className="results">
                {filteredFoods.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666" }}>該当する商品がありません。</p>
                ) : (
                    filteredFoods.map(food => <Card key={food.id} data={food} />)
                )}
            </div>
        </div>
    );
}

export default App;
