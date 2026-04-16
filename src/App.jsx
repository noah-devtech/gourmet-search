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
            "isActive": false,
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
        <div className="max-w-[500px] mx-auto p-4 font-sans min-h-screen bg-gray-50">
            <h1 className="text-2xl font-black text-lions-blue mb-6 flex items-center gap-2 tracking-tight">
                獅子まんま 検索システム
                <span className="text-xl" role="img" aria-label="search">🔍️</span>
            </h1>

            <div className="relative mb-6">
                <input
                    className="
                        w-full p-3.5 text-base border border-gray-300 rounded-xl shadow-sm
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-lions-blue focus:border-transparent
                        transition-all duration-200
                        bg-white
                    "
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="商品名、店舗名で検索..."
                />
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <div className="filters">
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
            </div>

            <div className="space-y-3">
                {filteredFoods.length === 0 ? (
                    <p className="text-center color-gray-500 mt-10">該当する商品がありません。</p>
                ) : (
                    filteredFoods.map(food => <Card key={food.id} data={food} />)
                )}
            </div>
        </div>
    );
}

export default App;
