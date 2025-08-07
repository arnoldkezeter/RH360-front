import { useDispatch, useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";

import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import DateRangePicker, { DateRangePickerHandle } from "../../../ui/RangeDatePicker";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import Skeleton from "react-loading-skeleton";
import { NoData } from "../../../NoData";
import Pagination from "../../../Pagination/Pagination";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";



interface TableTacheStagiaireProps {
    data: TacheStagiaire[];
    statuts:StatutTacheStagiaire[];
    currentPage: number;
    currentStatut?:StatutTacheStagiaire;
    onPageChange: (page: number) => void;
    onStatutChange:(statut:Statut)=>void;
    onDateChange:(startDate:Date | null, endDate:Date |null)=>void;
    onResetFilters:(value:boolean)=>void;
    onEdit: (tacheStagiaire : TacheStagiaire) => void;
    isLoading:boolean
}

const Table = ({ data, statuts, currentPage, currentStatut, isLoading, onPageChange, onStatutChange, onDateChange, onResetFilters, onEdit}: TableTacheStagiaireProps) => {
    const {t}=useTranslation();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const pageIsLoading = isLoading
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };
    const datePickerRef = useRef<DateRangePickerHandle>(null);
    
    const resetAllFilters = () => {
        datePickerRef.current?.reset(); // 👈 reset le composant enfant
    };
    
    
    
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };


    
    const handleStatutSelect = (selected: Statut | undefined) => {
        if (selected) {
            console.log(selected)
            resetAllFilters()
            onStatutChange(selected);
        }
    };

   

    

    const handleResetSelect = () => {
        resetAllFilters()
        onResetFilters(true);
        
    };
    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.tacheStagiaireSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.tacheStagiaireSlice.data.totalItems);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    // Render page numbers
    const pageNumbers :number[]= [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<TacheStagiaire[]>(data);
    
   
    return (
        <div>
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 mt-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    
                
                {/* Filtres principaux (Programme, Formation, Thème) */}
                {/* Bouton pour afficher/masquer les filtres - visible uniquement sur mobile */}
                <div className="block md:hidden mb-4 mt-5">
                    <button
                        onClick={toggleFilters}
                        className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-800">
                                {t('filtre.filtrer')}
                            </span>
                        </div>
                        {isFiltersVisible ? (
                        <ChevronUp className="w-5 h-5 text-blue-600" />
                        ) : (
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                        )}
                    </button>
                </div>
            
                {/* Conteneur des filtres */}
                <div className={`
                    transition-all duration-300 ease-in-out md:overflow-visible
                    md:block md:opacity-100 md:max-h-none relative z-50
                    ${isFiltersVisible 
                        ? 'block opacity-100 max-h-96 overflow-visible' 
                        : 'hidden md:block opacity-0 md:opacity-100 max-h-0 md:max-h-none overflow-hidden'
                    }
                `}>
                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 mb-3 mt-5">
                        {/* Programme Formation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('label.periode')}
                            </label>
                            <DateRangePicker
                                ref={datePickerRef}
                                onDateChange={(start, end) => {
                                    onDateChange(start, end)
                                }}
                                language={lang==="fr"?"fr":"en"}
                            />
                        </div>
            
                        {/* Statut */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('label.statut')}
                            </label>
                            <CustomDropDown2<StatutTacheStagiaire>
                                title=""
                                selectedItem={currentStatut}
                                items={statuts}
                                defaultValue={undefined}
                                displayProperty={(statut: Statut) => `${lang==='fr'?statut.nomFr:statut.nomEn}`}
                                onSelect={handleStatutSelect}
                            />
                        </div>
            
                        {/* Thème */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2 lg:mb-5">
                                &nbsp;
                            </label>
                            <button onClick={handleResetSelect}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <Skeleton count={12}/>
                                : data && data.length === 0 ?
                                    <NoData /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}
                        {
                            !pageIsLoading && <BodyTable data={data} onEdit={onEdit}/>
                        }
                    </table>
                </div>

                {/* Pagination */}
                {data && data.length>0 && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={onPageChange}
                />}
            </div>
        </div>
    );
};


export default Table;