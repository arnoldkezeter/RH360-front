import { useDispatch, useSelector } from "react-redux";

import InputSearch from "../../../common/SearchTable";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { RootState } from "../../../../../_redux/store";
import Pagination from "../../../../Pagination/Pagination";
import Skeleton from "react-loading-skeleton";
import { NoData } from "../../../../NoData";

import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { setAutoEvaluationBesoinLoading, setErrorPageAutoEvaluationBesoin } from "../../../../../_redux/features/elaborations/autoEvaluationBesoinSlice";
import { getBesoinsPredefinisAvecAutoEvaluation } from "../../../../../services/elaborations/autoEvaluationBesoinAPI";
import ButtonCreate from "../../../common/ButtonCreate";
import { useNavigate } from "react-router-dom";



interface TableAutoEvaluationBesoinProps {
    data: AutoEvaluationBesoin[];
    currentPage: number;
    user:Utilisateur,
    onPageChange: (page: number) => void;
    onEdit: (AutoEvaluationBesoin : AutoEvaluationBesoin) => void;
}

const Table = ({ data, currentPage, user, onPageChange, onEdit}: TableAutoEvaluationBesoinProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const pageIsLoading = useSelector((state: RootState) => state.autoEvalualtionBesoinSlice.pageIsLoading);
    

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);

    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.autoEvalualtionBesoinSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.autoEvalualtionBesoinSlice.data.totalItems);
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
    const [filteredData, setFilteredData] = useState<AutoEvaluationBesoin[]>(data);
    

    const latestQueryAutoEvaluationBesoin = useRef('');
    useEffect(() => {
        dispatch(setAutoEvaluationBesoinLoading(true));
        latestQueryAutoEvaluationBesoin.current = searchText;
        
        try{
            
            const filterAutoEvaluationBesoinByContent = async () => {
                if (searchText === '') {
                    // if(isSearch){
                        // sections.length>0?setSection(sections[0]):setSection(undefined);
                        // filterCycleBySection(section?._id);
                        // filterNiveauxByCycle(cycle?._id);
                        
                        const result: AutoEvaluationBesoin[] = data;
                        setFilteredData(result); 
                        
                    // }
                }else{
                    // setSection(undefined);
                    // setCycle(undefined);
                    // setNiveau(undefined);
                    // setFilteredCycle([]);
                    // setFilteredNiveaux([]);
                    let autoevaluationbesoinsResult : AutoEvaluationBesoin[] = [];
                    
                    await getBesoinsPredefinisAvecAutoEvaluation({page:1, search:searchText, lang, userId:user._id}).then(result=>{
                        if (latestQueryAutoEvaluationBesoin.current === searchText) {
                            if(result){
                                autoevaluationbesoinsResult = result.autoEvaluationBesoins;
                                setFilteredData(autoevaluationbesoinsResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            
            filterAutoEvaluationBesoinByContent();
        }catch(e){
            dispatch(setErrorPageAutoEvaluationBesoin(t('message.erreur')));
        }finally{
            if (latestQueryAutoEvaluationBesoin.current === searchText) {
                dispatch(setAutoEvaluationBesoinLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);
    return (
        <div>
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-2">
    
                <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 mt-3">
                    {/* <ButtonCreate
                        title={t('button.nouvelles_competences')}
                        useTitle={true}
                        onClick={() => navigate('/elaboration-programme/besoins-formation/exprimer/nouvelle-competence')}
                    /> */}
                    <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.besoin_formation_predefini'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
                </div>

                {/* DEBUT DU TABLE */}
                {/* <div className="min-h-screen bg-gray-50 p-4">
                    
                </div> */}
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