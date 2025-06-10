import React from "react";

interface FilterButtonsProps {
    onCancelFilter: () => void;
    onApplyFilter: () => void;
    applyFilter?: boolean
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ applyFilter, onCancelFilter, onApplyFilter }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-y-2 lg:gap-y-0 gap-x-2 text-[10px] lg:text-sm min-w-[150px]">
            <button className="rounded py-1 px-4 border border-[#6c69692d] hover:bg-[#d6d4d455] duration-200 transition-all" onClick={onCancelFilter}>
                Annuler le filtre
            </button>
            <button className={`rounded py-1 px-4 border-[#6c69692d] hover:bg-primary border hover:border-primary hover:text-white duration-200 transition-all ${applyFilter ? 'bg-primary text-white duration-300 transition-all' : "border"}`} onClick={onApplyFilter}>
                Appliquer le filtre
            </button>
        </div>
    );
};

export default FilterButtons;
