function Card({ data }) {
    const isActive = data.isActive;

    return (
        <div className={`
            bg-white rounded-lg py-2 px-5 mb-3 shadow-sm border-l-4 transition-all duration-200
            ${isActive
                ? "border-lions-blue"
                : "border-gray-400 bg-gray-50 opacity-80"}
        `}>
            <div className="flex justify-between items-center m-0 gap-2">
                <h3 className="text-lg font-bold m-0 text-gray-900 leading-tight">
                    {data.productName}
                </h3>
                <p className="text-xl font-bold text-lions-red m-0 whitespace-nowrap">
                    ¥{data.price}
                </p>
            </div>

            <p className="text-sm text-gray-600 m-0 leading-relaxed font-sans">
                📍 {data.location.base}塁側 / 場所コード: {data.location.code}<br />
                🏪 {data.storeName}<br />
                📅 {data.lastUpdated}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-1">
                {!isActive && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                        販売終了
                    </span>
                )}
                {data.options && (
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {data.options}
                    </span>
                )}
                {data.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Card;