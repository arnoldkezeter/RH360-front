import { useDispatch, useSelector } from "react-redux";

import InputSearch from "../../common/SearchTable";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";

import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import Pagination from "../../../Pagination/Pagination";
import DateRangePicker, { DateRangePickerHandle } from "../../../ui/RangeDatePicker";
import Skeleton from "react-loading-skeleton";
import { NoData } from "../../../NoData";
import { setErrorPageFormation, setFormationLoading } from "../../../../_redux/features/elaborations/formationSlice";
import { getFormationsForGantt } from "../../../../services/elaborations/formationAPI";
import GanttChart from "../../../ui/GanttChart";
import ProgrammeFormations from "../../../../pages/Elaboration/ProgrammesFormation";
import GanttDiagram from "../../../ui/GanttDiagram";



interface TableFormationProps {
    data: Formation[];
    familles:FamilleMetier[];
    axeStrategiques:AxeStrategique[];
    programmeFormations:ProgrammeFormation[]
    currentPage: number;
    currentFamille?:FamilleMetier;
    currentAxe?:AxeStrategique;
    currentProgramme:ProgrammeFormation
    onPageChange: (page: number) => void;
    onProgrammeChange:(programme:ProgrammeFormation)=>void;
    onAxeChange:(axeStrategique:AxeStrategique)=>void;
    onFamilleChange:(familleMetier:FamilleMetier)=>void;
    onDateChange:(startDate:Date | null, endDate:Date |null)=>void;
    onResetFilters:(value:boolean)=>void;
    onEdit: (Formation : Formation) => void;
}
    

const Table = ({ data, programmeFormations, familles, axeStrategiques, currentPage, currentProgramme, currentAxe, currentFamille, onPageChange, onProgrammeChange, onAxeChange, onFamilleChange, onDateChange, onResetFilters, onEdit}: TableFormationProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const pageIsLoading = useSelector((state: RootState) => state.formationSlice.pageIsLoading);

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

    const handleProgrammeSelect = (selected: ProgrammeFormation | undefined) => {
        if (selected) {
            onProgrammeChange(selected);
        }
    };
    
    const handleFamilleMetierSelect = (selected: FamilleMetier | undefined) => {
        if (selected) {
            resetAllFilters()
            onFamilleChange(selected);
        }
    };

    const handleAxeStrategiqueSelect = (selected: AxeStrategique | undefined) => {
        if (selected) {
            resetAllFilters()
            onAxeChange(selected);
            
        }
    };


    const handleResetSelect = () => {
        resetAllFilters()
        onResetFilters(true);
        
    };
    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.formationSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.formationSlice.data.totalItems);
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
    const [filteredData, setFilteredData] = useState<Formation[]>(data);
    

    const latestQueryFormation = useRef('');
    useEffect(() => {
        dispatch(setFormationLoading(true));
        latestQueryFormation.current = searchText;
        
        try{
            
            const filterFormationByContent = async () => {
                if (searchText === '') {
                    // if(isSearch){
                        // sections.length>0?setSection(sections[0]):setSection(undefined);
                        // filterCycleBySection(section?._id);
                        // filterNiveauxByCycle(cycle?._id);
                        
                        const result: Formation[] = data;
                        setFilteredData(result); 
                        
                    // }
                }else{
                    // setSection(undefined);
                    // setCycle(undefined);
                    // setNiveau(undefined);
                    // setFilteredCycle([]);
                    // setFilteredNiveaux([]);
                    let FormationsResult : Formation[] = [];
                    
                    await getFormationsForGantt({page:1, search:searchText, programmeFormation:currentProgramme.annee, lang}).then(result=>{
                        if (latestQueryFormation.current === searchText) {
                            if(result){
                                FormationsResult = result.formations;
                                setFilteredData(FormationsResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            
            filterFormationByContent();
        }catch(e){
            dispatch(setErrorPageFormation(t('message.erreur')));
        }finally{
            if (latestQueryFormation.current === searchText) {
                dispatch(setFormationLoading(false)); // Définissez le loading à false après le chargement
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
                                    hintText={t('recherche.rechercher')+t('recherche.formation')} 
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
                            <CustomDropDown2<ProgrammeFormation>
                                title={t('label.programme_formation')}
                                selectedItem={currentProgramme}
                                items={programmeFormations}
                                defaultValue={currentProgramme}
                                displayProperty={(programme: ProgrammeFormation) => `${programme.annee}`}
                                onSelect={handleProgrammeSelect}
                            />
                            <CustomDropDown2<FamilleMetier>
                                title={t('label.famille_metier')}
                                selectedItem={currentFamille}
                                items={familles}
                                defaultValue={undefined}
                                displayProperty={(familleMetier: FamilleMetier) => `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`}
                                onSelect={handleFamilleMetierSelect}
                            />
                            <CustomDropDown2<AxeStrategique>
                                title={t('label.axe_strategique')}
                                selectedItem={currentAxe}
                                items={axeStrategiques}
                                defaultValue={undefined}
                                displayProperty={(axeStrategique: AxeStrategique) => `${lang === 'fr' ? axeStrategique.nomFr : axeStrategique.nomEn}`}
                                onSelect={handleAxeStrategiqueSelect}
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

                        <div className="min-w-[175px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.programme_formation')}
                            </label>
                            <CustomDropDown2<ProgrammeFormation>
                                title=""
                                selectedItem={currentProgramme}
                                items={programmeFormations}
                                defaultValue={currentProgramme}
                                displayProperty={(programme: ProgrammeFormation) => `${programme.annee}`}
                                onSelect={handleProgrammeSelect}
                            />
                        </div>

                        {/* DateRangePicker */}
                        <div className="min-w-[215px] flex-1">
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

                        {/* FamilleMetier */}
                        <div className="min-w-[175px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.famille_metier')}
                            </label>
                            <CustomDropDown2<FamilleMetier>
                                title=""
                                selectedItem={currentFamille}
                                items={familles}
                                defaultValue={undefined}
                                displayProperty={(familleMetier: FamilleMetier) => `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`}
                                onSelect={handleFamilleMetierSelect}
                            />
                        </div>

                        {/* AxeStrategique */}
                        <div className="min-w-[175px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.axe_strategique')}
                            </label>
                            <CustomDropDown2<AxeStrategique>
                                title=""
                                selectedItem={currentAxe}
                                items={axeStrategiques}
                                defaultValue={undefined}
                                displayProperty={(axeStrategique: AxeStrategique) => `${lang === 'fr' ? axeStrategique.nomFr : axeStrategique.nomEn}`}
                                onSelect={handleAxeStrategiqueSelect}
                                
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
                            hintText={t('recherche.rechercher')+t('recherche.formation')} 
                            value={searchText} 
                            onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                        />
                    </div>

                    
                </div>


                {/* DEBUT DU TABLE */}
                {/* <div className="min-h-screen bg-gray-50 p-4">
                    
                </div> */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    {pageIsLoading ?
                                <Skeleton count={12}/>
                                : filteredData.length === 0 ?
                                    <NoData /> :
                    <GanttChart formations={filteredData} lang={lang} />}
                     {/* <table className="w-full table-auto"> */}
                        {/* en tete du tableau */}
                        {/* {
                            pageIsLoading ?
                                <Skeleton count={12}/>
                                : filteredData.length === 0 ?
                                    <NoData /> :
                                    <HeaderTable />
                        } */}

                        {/* corp du tableau*/}
                        {/* {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit}/>
                        } */}
                    {/* </table>  */}
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