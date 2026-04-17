const FilterButton = ({ label, isActive, onClick }) => {
    return (
        <button
            className={`
                px-2 py-1 border rounded-full transition-all whitespace-nowrap font-sans
                ${isActive
                    ? "bg-lions-blue text-white border-lions-blue shadow-md"
                    : "bg-white text-lions-blue border-lions-blue hover:bg-blue-50"}
            `}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
export default FilterButton;