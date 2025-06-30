import { useDispatch, useSelector } from "react-redux";

import InputSearch from "../../common/SearchTable";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";

import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import { setErrorPageStagiaire, setStagiairesLoading } from "../../../../_redux/features/stagiaire/stagiaireSlice";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import Pagination from "../../../Pagination/Pagination";
import { getStagiairesByFiltres } from "../../../../services/stagiaires/stagiaireAPI";
import { STATUTS } from "../../../../config";
import DateRangePicker, { DateRangePickerHandle } from "../../../ui/RangeDatePicker";
import Skeleton from "react-loading-skeleton";
import { NoData } from "../../../NoData";



interface TableStagiaireProps {
    data: Stagiaire[];
    structures:Structure[];
    services:Service[];
    currentPage: number;
    currentStructure?:Structure;
    currentService?:Service;
    currentStatut?:Statut;
    onPageChange: (page: number) => void;
    onServiceChange:(service:Service)=>void;
    onStructureChange:(structure:Structure)=>void;
    onStatutChange:(statut:Statut)=>void;
    onDateChange:(startDate:Date | null, endDate:Date |null)=>void;
    onResetFilters:(value:boolean)=>void;
    onEdit: (stagiaire : Stagiaire) => void;
}

const Table = ({ data, structures, services, currentPage, currentService, currentStructure, currentStatut, onPageChange, onServiceChange, onStructureChange, onStatutChange, onDateChange, onResetFilters, onEdit}: TableStagiaireProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const statuts = Object.values(STATUTS)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const pageIsLoading = useSelector((state: RootState) => state.stagiaireSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);

    const datePickerRef = useRef<DateRangePickerHandle>(null);
    
    const resetAllFilters = () => {
        datePickerRef.current?.reset(); // 👈 reset le composant enfant
    };
    
    
    
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);

    
     const handleStructureSelect = (selected: Structure | undefined) => {
        if (selected) {
            resetAllFilters()
            onStructureChange(selected);
        }
    };

    const handleServiceSelect = (selected: Service | undefined) => {
        if (selected) {
            resetAllFilters()
            onServiceChange(selected);
            
        }
    };

    const handleStatutSelect = (selected: Statut| undefined) => {

        if (selected) {
            resetAllFilters()
            onStatutChange(selected);
        }
    };

    const handleResetSelect = () => {
        resetAllFilters()
        onResetFilters(true);
        
    };
    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.stagiaireSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.stagiaireSlice.data.totalItems);
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
    const [filteredData, setFilteredData] = useState<Stagiaire[]>(data);
    

    const latestQueryStagiaire = useRef('');
    useEffect(() => {
        dispatch(setStagiairesLoading(true));
        latestQueryStagiaire.current = searchText;
        
        try{
            
            const filterStagiaireByContent = async () => {
                if (searchText === '') {
                    // if(isSearch){
                        // sections.length>0?setSection(sections[0]):setSection(undefined);
                        // filterCycleBySection(section?._id);
                        // filterNiveauxByCycle(cycle?._id);
                        
                        const result: Stagiaire[] = data;
                        setFilteredData(result); 
                        
                    // }
                }else{
                    // setSection(undefined);
                    // setCycle(undefined);
                    // setNiveau(undefined);
                    // setFilteredCycle([]);
                    // setFilteredNiveaux([]);
                    let stagiairesResult : Stagiaire[] = [];
                    
                    await getStagiairesByFiltres({page:1, search:searchText, lang}).then(result=>{
                        if (latestQueryStagiaire.current === searchText) {
                            if(result){
                                stagiairesResult = result.stagiaires;
                                setFilteredData(stagiairesResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            
            filterStagiaireByContent();
        }catch(e){
            dispatch(setErrorPageStagiaire(t('message.erreur')));
        }finally{
            if (latestQueryStagiaire.current === searchText) {
                dispatch(setStagiairesLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);
    return (
        <div>
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-2">
    
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5 py-1 border border-gray text-[12px] mb-2 flex justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}>
                        <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort />
                    </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[400px] gap-y-3">

                            {/* InputSearch pour mobile */}
                            <div className="w-full">
                                <InputSearch 
                                    hintText={t('recherche.rechercher')+t('recherche.stagiaire')} 
                                    value={searchText} 
                                    onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                                />
                            </div>

                            {/* DateRangePicker pour mobile */}
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('label.periode')}</label>
                                <DateRangePicker
                                    ref={datePickerRef}
                                    onDateChange={(start, end) => {
                                        onDateChange(start, end)
                                    }}
                                    initialStartDate={null}
                                    initialEndDate={null}
                                    language={lang==="fr"?"fr":"en"}
                                />
                            </div>

                            {/* Dropdowns */}
                            <CustomDropDown2<Structure>
                                title={t('label.structure')}
                                selectedItem={currentStructure}
                                items={structures}
                                defaultValue={undefined}
                                displayProperty={(structure: Structure) => `${lang === 'fr' ? structure.nomFr : structure.nomEn}`}
                                onSelect={handleStructureSelect}
                            />
                            <CustomDropDown2<Service>
                                title={t('label.service')}
                                selectedItem={currentService}
                                items={services}
                                defaultValue={undefined}
                                displayProperty={(service: Service) => `${lang === 'fr' ? service.nomFr : service.nomEn}`}
                                onSelect={handleServiceSelect}
                            />
                            <CustomDropDown2<Statut>
                                title={t('label.statut')}
                                selectedItem={currentStatut}
                                items={statuts}
                                defaultValue={undefined}
                                displayProperty={(statut: Statut) => `${lang === 'fr' ? statut.nomFr : statut.nomEn}`}
                                onSelect={handleStatutSelect}
                            />

                            {/* Bouton reset mobile */}
                            <div className="w-full flex justify-end mt-1">
                                <button onClick={handleResetSelect}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    {/* Ligne 1 : Filtres alignés */}
                    <div className="flex flex-wrap gap-4 items-end mt-4">

                        {/* DateRangePicker */}
                        <div className="min-w-[220px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
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

                        {/* Structure */}
                        <div className="min-w-[180px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.structure')}
                            </label>
                            <CustomDropDown2<Structure>
                                title=""
                                selectedItem={currentStructure}
                                items={structures}
                                defaultValue={undefined}
                                displayProperty={(structure: Structure) => `${lang === 'fr' ? structure.nomFr : structure.nomEn}`}
                                onSelect={handleStructureSelect}
                            />
                        </div>

                        {/* Service */}
                        <div className="min-w-[180px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.service')}
                            </label>
                            <CustomDropDown2<Service>
                                title=""
                                selectedItem={currentService}
                                items={services}
                                defaultValue={undefined}
                                displayProperty={(service: Service) => `${lang === 'fr' ? service.nomFr : service.nomEn}`}
                                onSelect={handleServiceSelect}
                                
                            />
                        </div>

                        {/* Statut */}
                        <div className="min-w-[180px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.statut')}
                            </label>
                            <CustomDropDown2<Statut>
                                title=""
                                selectedItem={currentStatut}
                                items={statuts}
                                defaultValue={undefined}
                                displayProperty={(statut: Statut) => `${lang === 'fr' ? statut.nomFr : statut.nomEn}`}
                                onSelect={handleStatutSelect}
                            />
                        </div>

                        {/* Bouton reset */}
                        <div className="min-w-[40px] flex-shrink-0">
                            <label className="text-sm lg:text-md font-medium text-transparent block mb-1">
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
                    {/* Ligne 2 : Barre de recherche pleine largeur */}
                    <div className="w-full mb-4 mt-4">
                        <InputSearch 
                            hintText={t('recherche.rechercher')+t('recherche.stagiaire')} 
                            value={searchText} 
                            onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                        />
                    </div>

                    
                </div>


                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <Skeleton count={12}/>
                                : filteredData.length === 0 ?
                                    <NoData /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}
                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit}/>
                        }
                    </table>
                </div>

                {/* Pagination */}
                {searchText==='' && filteredData && filteredData.length>0 && <Pagination
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