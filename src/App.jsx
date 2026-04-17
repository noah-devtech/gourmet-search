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
                setFoods(data.data);
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
        <div className="max-w-[500px] mx-auto font-sans min-h-screen bg-gray-50 relative">

            <div className="py-2 px-4">
                <h1 className="text-2xl font-black text-lions-blue flex items-center justify-center gap-2 tracking-tight">
                獅子まんま 検索システム
                <span className="text-xl" role="img" aria-label="search">🔍️</span>
            </h1>
            </div>

            <header className="sticky top-0 z-10 bg-gray-50/60 px-4 py-1 border-b border-gray-200/60 backdrop-blur-sm">
                <div className="relative my-1">
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
                    {inputQuery && (
                        <button
                            onClick={() => setInputQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="検索内容をクリア"
                        >
                            {/* Tailwindと相性の良いHeroiconsなどのSVGアイコン（バツ印） */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
            </div>

                <div className="flex flex-col items-center gap-2 overflow-x-auto">
                    <div className="filters w-full">
                        <div className="flex bg-gray-200 p-1.5 rounded-xl my-1">
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
                        <div className="flex justify-center gap-2 my-1">
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
                </div>
            </header>

            <main className="px-4 py-3 space-y-3">
                {loading ? (
                    <p className="text-center text-gray-500 mt-10">読み込み中...</p>
                ) : errorMessage ? (
                    <p className="text-center text-red-500 mt-10 font-bold">{errorMessage}</p>
                ) : filteredFoods.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">該当する商品がありません。</p>
                ) : (
                    filteredFoods.map(food => <Card key={food.id} data={food} />)
                )}
            </main>
        </div>
    );
}

export default App;
