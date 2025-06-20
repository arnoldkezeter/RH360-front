import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../../common/ButtonCreate";
import InputSearch from "../../common/SearchTable";
import { setShowModal } from "../../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import Pagination from "../../../Pagination/Pagination";
import { config } from "../../../../config";
import { setErrorPageCohorte, setCohorteLoading} from "../../../../_redux/features/parametres/cohorteSlice";
import { searchCohorte } from "../../../../services/settings/cohorteAPI";
import { NoData } from "../../../NoData";
import Skeleton from "react-loading-skeleton";

interface TableCohorteProps {
    data: Cohorte[];
    currentPage: number;
    onPageChange: (page: number) => void;
    onCreate:()=>void;
    onEdit: (cohorte:Cohorte) => void;
    openUserCohorteManage:()=>void;
}

const Table = ({data, currentPage, onPageChange, onCreate, onEdit, openUserCohorteManage}: TableCohorteProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.cohorteSlice.pageIsLoading);
    const userRole = useSelector((state: RootState) => state.utilisateurSlice.utilisateur.role);
    const roles = config.roles;
    
    const dispatch = useDispatch();

    
    
   // variable pour la pagination
   
   const itemsPerPage =  useSelector((state: RootState) => state.cohorteSlice.data.pageSize); // nombre d'éléments maximum par page
   const count = useSelector((state: RootState) => state.cohorteSlice.data.totalItems);
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
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);

   
    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<Cohorte[]>(data);

    useEffect(() => {
       if(searchText!==''){
            setIsSearch(true);
       }else{
            setIsSearch(false);
       }
    }, [searchText]);
    const latestQueryCohorte = useRef('');
    useEffect(() => {
        dispatch(setCohorteLoading(true));
        latestQueryCohorte.current = searchText;
        
        try{
            
            const filterCohorteByContent = async () => {
                if (searchText === '') {
                   
                    const result: Cohorte[] = data;
                    setFilteredData(result); 
                }else{
                    let cohortesResult : Cohorte[] = [];
                  
                    await searchCohorte({ searchString:searchText, lang:lang}).then(result=>{
                        if (latestQueryCohorte.current === searchText) {
                            if(result){
                                cohortesResult = result.cohortes;
                                setFilteredData(cohortesResult);
                            }
                        }
                        
                    })
                    
                }
        
                
            };
            filterCohorteByContent();
        }catch(e){
            dispatch(setErrorPageCohorte(t('message.erreur')));
        }finally{
            if (latestQueryCohorte.current === searchText) {
                dispatch(setCohorteLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

   

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(roles.admin === userRole || roles.superAdmin === userRole) && <ButtonCreate
                    title={t('boutton.nouvel_cohorte')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.cohorte'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">                

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <Skeleton count={15}/>
                                : filteredData?.length === 0 ?
                                    <NoData /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit} openUserCohorteManage={openUserCohorteManage}/>
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

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};

export default Table;