import { FaFilter } from 'react-icons/fa';
import FilterButtons from './BoutonFiltrer';
import { RootState } from '../../_redux/store';
import { useSelector } from 'react-redux';

interface FilterTableSectionProps {
    applyFilter: boolean;
    onCancelFilter: () => void;
    onApplyFilter: () => void;
    text: string;
}

const FilterTableSection = ({ text, applyFilter, onCancelFilter, onApplyFilter }: FilterTableSectionProps) => {
    const isMobile = useSelector((state: RootState) => state.setting.isMobile);

    return (
        <div className={`flex flex-col lg:flex-row justify-start items-start lg:items-center lg:justify-between mt-3 mb-3 lg:mb-0 lg:mt-5`}>
            <h1 className="text-[12px] lg:text-[15px] font-medium flex justify-start items-center gap-x-2">
                <div className="hidden lg:block">
                    <FaFilter />
                </div>
                {text}
            </h1>

            {/* bouton pour confirmer ou réinitialiser le filtre */}
            <div className={` ${!isMobile ?
                // si je suis sur desktop
                '' :
                // sur mobile ou tablet 
                `${applyFilter ? "opacity-100  transition-opacity duration-300" : "opacity-0 transition-opacity duration-300 hidden "}
                w-full items-center py-2
                `}
              `} >
                <FilterButtons
                    applyFilter={applyFilter}
                    onCancelFilter={onCancelFilter}
                    onApplyFilter={onApplyFilter}
                />

            </div>
        </div >
    );
}

export default FilterTableSection;
