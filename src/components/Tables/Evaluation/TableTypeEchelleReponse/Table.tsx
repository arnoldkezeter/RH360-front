import { useDispatch, useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";

import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import InputSearch from "../../common/SearchTable";
import { RootState } from "../../../../_redux/store";
import { getFilteredTypeEchelleReponses } from "../../../../services/evaluations/typeEchelleReponseAPI";
import { NoData } from "../../../NoData";
import Pagination from "../../../Pagination/Pagination";
import { setErrorPageTypeEchelleReponse, setTypeEchelleReponseLoading } from "../../../../_redux/features/evaluations/typeEchelleResponseSlice";



interface TableTypeEchelleReponseProps {
    data: TypeEchelleReponse[];
    selectedTheme?:ThemeFormation;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEdit: (typeEchelleReponse : TypeEchelleReponse) => void;
}

const Table = ({ data, selectedTheme, currentPage, onPageChange, onEdit}: TableTypeEchelleReponseProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const pageIsLoading = useSelector((state: RootState) => state.typeEchelleReponseSlice.pageIsLoading);
    

    
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);

    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.typeEchelleReponseSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.typeEchelleReponseSlice.data.totalItems);
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
    const [filteredData, setFilteredData] = useState<TypeEchelleReponse[]>(data);
    

    const latestQueryTypeEchelleReponse = useRef('');
    useEffect(() => {
        dispatch(setTypeEchelleReponseLoading(true));
        latestQueryTypeEchelleReponse.current = searchText;
        
        try{
            
            const filterTypeEchelleReponseByContent = async () => {
                if (searchText === '') {
                    // if(isSearch){
                        // sections.length>0?setSection(sections[0]):setSection(undefined);
                        // filterCycleBySection(section?._id);
                        // filterNiveauxByCycle(cycle?._id);
                        
                        const result: TypeEchelleReponse[] = data;
                        setFilteredData(result); 
                        
                    // }
                }else{
                    // setSection(undefined);
                    // setCycle(undefined);
                    // setNiveau(undefined);
                    // setFilteredCycle([]);
                    // setFilteredNiveaux([]);
                    let typeEchelleReponsesResult : TypeEchelleReponse[] = [];
                    
                    await getFilteredTypeEchelleReponses({page:1, search:searchText, lang}).then(result=>{
                        if (latestQueryTypeEchelleReponse.current === searchText) {
                            if(result){
                                typeEchelleReponsesResult = result.typeEchelleReponses;
                                setFilteredData(typeEchelleReponsesResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            
            filterTypeEchelleReponseByContent();
        }catch(e){
            dispatch(setErrorPageTypeEchelleReponse(t('message.erreur')));
        }finally{
            if (latestQueryTypeEchelleReponse.current === searchText) {
                dispatch(setTypeEchelleReponseLoading(false)); // Définissez le loading à false après le chargement
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
                                    hintText={t('recherche.rechercher')+t('recherche.type_echelle_reponse')} 
                                    value={searchText} 
                                    onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="w-full mb-4 mt-4">
                        <InputSearch 
                            hintText={t('recherche.rechercher')+t('recherche.type_echelle_reponse')} 
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