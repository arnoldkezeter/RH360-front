import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../../common/ButtonCreate";
import LoadingTable from "../../common/LoadingTable";
import NoDataTable from "../../common/NoDataTable";
import InputSearch from "../../common/SearchTable";
import { setShowModal } from "../../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import Pagination from "../../../Pagination/Pagination";
import { config } from "../../../../config";
import { searchCompetence } from "../../../../services/elaborations/competenceAPI";
import { setErrorPageCompetence, setCompetenceLoading } from "../../../../_redux/features/elaborations/competenceSlice";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import { FaFilter, FaSort } from "react-icons/fa";

interface TableCompetenceProps {
    data: Competence[];
    familleMetiers:FamilleMetier[]
    currentPage: number;
    currentFamilleMetier:FamilleMetier;
    onPageChange: (page: number) => void;
    onFamilleMetierChange:(famillemetier:FamilleMetier)=>void;
    onCreate:()=>void;
    onEdit: (competence:Competence) => void;
}

const Table = ({data, familleMetiers, currentPage, currentFamilleMetier, onPageChange, onFamilleMetierChange, onCreate, onEdit}: TableCompetenceProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.posteDeTavailSlice.pageIsLoading);
    const userRole = useSelector((state: RootState) => state.utilisateurSlice.utilisateur.role);
    const roles = config.roles;
     const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    
    const dispatch = useDispatch();

    
    
   // variable pour la pagination
   
   const itemsPerPage =  useSelector((state: RootState) => state.posteDeTavailSlice.data.pageSize); // nombre d'éléments maximum par page
   const count = useSelector((state: RootState) => state.posteDeTavailSlice.data.totalItems);
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
    const [filteredData, setFilteredData] = useState<Competence[]>(data);

    useEffect(() => {
       if(searchText!==''){
            setIsSearch(true);
       }else{
            setIsSearch(false);
       }
    }, [searchText]);
    const latestQueryCompetence = useRef('');
    useEffect(() => {
        dispatch(setCompetenceLoading(true));
        latestQueryCompetence.current = searchText;
        
        try{
            
            const filterCompetenceByContent = async () => {
                if (searchText === '') {
                   
                    const result: Competence[] = data;
                    setFilteredData(result); 
                }else{
                    let competencesResult : Competence[] = [];
                  
                    await searchCompetence({ searchString:searchText, lang:lang}).then(result=>{
                        if (latestQueryCompetence.current === searchText) {
                            if(result){
                                competencesResult = result.competences;
                                setFilteredData(competencesResult);
                            }
                        }
                        
                    })
                    
                }
        
                
            };
            filterCompetenceByContent();
        }catch(e){
            dispatch(setErrorPageCompetence(t('message.erreur')));
        }finally{
            if (latestQueryCompetence.current === searchText) {
                dispatch(setCompetenceLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

    const handleFamilleMetierSelect = (selected: FamilleMetier | undefined) => {
        console.log(selected)
        if (selected) {
            onFamilleMetierChange(selected);
        }
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(roles.admin === userRole || roles.superAdmin === userRole) && <ButtonCreate
                    title={t('boutton.competence')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.competence'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">     
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.competence')} </h1>
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<FamilleMetier>
                                title={t('label.famille_metier')}
                                selectedItem={currentFamilleMetier}
                                items={familleMetiers}
                                defaultValue={familleMetiers[0]} // ou spécifie une valeur par défaut
                                displayProperty={(familleMetier: FamilleMetier) => `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`}
                                onSelect={handleFamilleMetierSelect}
                            />
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<FamilleMetier>
                                title={t('label.famille_metier')}
                                selectedItem={currentFamilleMetier}
                                items={familleMetiers}
                                defaultValue={familleMetiers[0]} // ou spécifie une valeur par défaut
                                displayProperty={(familleMetier: FamilleMetier) => `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`}
                                onSelect={handleFamilleMetierSelect}
                            />
                        </div>
                    </div>
                </div>
           

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : filteredData?.length === 0 ?
                                    <NoDataTable /> :
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

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};

export default Table;