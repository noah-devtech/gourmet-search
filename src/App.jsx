import { useMemo } from "react";
import Card from "./components/Card";
import FilterButton from "./components/FilterButton";
import { useState } from "react";
import { useEffect } from "react";

const ENDPOINT = '/api/master-data';

function App() {
    // Query Text
    const [inputQuery, setInputQuery] = useState("");

    // User Input Filters
    const [selectedBase, setSelectedBase] = useState("all");
    const [showActive, setShowActive] = useState(true);
    const [showThisYear, setShowThisYear] = useState(true);

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await fetch(ENDPOINT, {
                    method: 'GET',
                    redirect: 'follow'
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setFoods(data);
            } catch (error) {
                console.error('データ取得エラー:', error);
                setErrorMessage('データの読み込みに失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

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
            <h1 className="text-2xl font-black text-lions-blue mb-1 flex items-center justify-center gap-2 tracking-tight">
                獅子まんま 検索システム
                <span className="text-xl" role="img" aria-label="search">🔍️</span>
            </h1>

            <div className="relative mb-2">
                <input
                    className="
                        w-full p-2 text-base border border-gray-300 rounded-xl shadow-sm
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

            <div className="flex flex-col items-center gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                <div className="filters">
                    <div className="flex bg-gray-200 p-1 rounded-xl mb-1">
                        {['all', 1, 3].map(base => (
                            <button
                                key={base}
                                className={`flex-1 py-1 text-sm font-bold rounded-lg transition-all ${selectedBase === base ? "bg-white shadow-sm text-lions-blue" : "text-gray-500"
                                    }`}
                                onClick={() => setSelectedBase(base)}
                            >
                                {base === 'all' ? "全エリア" : `${base}塁側`}
                            </button>
                        ))}
                    </div>
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
