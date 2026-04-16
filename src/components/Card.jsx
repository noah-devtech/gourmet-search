function Card({ data }) {
    return (
        <div className={`card ${data.isActive ? "" : "inactive"}`} >
            <div className="card-header">
                <h3 className="product-name">{data.productName}</h3>
                <p className="price">¥{data.price}</p>
            </div>
            <p class="meta-info">
                📍 {data.location.base}塁側 / 場所コード: {data.location.code}<br />
                🏪 {data.storeName}<br />
                📅 {data.lastUpdated}
            </p>
            <div style={{ marginTop: '8px' }}>
                {
                    !data.isActive
                        ? <span class="badge inactive">販売終了</span>
                        : ""
                }
                <span className="badge">{data.options}</span>
                {data.tags.map(tag => (
                    <span key={tag} className="badge">{tag}</span>
                ))}
            </div>
        </div >
    );
}

export default Card;
