import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../../common/ButtonCreate";
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
import { searchCategorieProfessionnelle } from "../../../../services/settings/categorieProfessionnelleAPI";
import { setErrorPageCategorieProfessionnelle, setCategorieProfessionnelleLoading } from "../../../../_redux/features/parametres/categorieProfessionnelleSlice";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import { FaFilter, FaSort } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { NoData } from "../../../NoData";

interface TableCategorieProfessionnelleProps {
    data: CategorieProfessionnelle[];
    grades:Grade[]
    currentPage: number;
    currentGrade:Grade;
    onPageChange: (page: number) => void;
    onGradeChange:(grade:Grade)=>void;
    onCreate:()=>void;
    onEdit: (categorieprofessionnelle:CategorieProfessionnelle) => void;
}

const Table = ({data, grades, currentPage, currentGrade, onPageChange, onGradeChange, onCreate, onEdit}: TableCategorieProfessionnelleProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.categorieProfessionnelleSlice.pageIsLoading);
    const userRole = useSelector((state: RootState) => state.utilisateurSlice.utilisateur.role);
    const roles = config.roles;
     const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    
    const dispatch = useDispatch();

    
    
   // variable pour la pagination
   
   const itemsPerPage =  useSelector((state: RootState) => state.categorieProfessionnelleSlice.data.pageSize); // nombre d'éléments maximum par page
   const count = useSelector((state: RootState) => state.categorieProfessionnelleSlice.data.totalItems);
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
    const [filteredData, setFilteredData] = useState<CategorieProfessionnelle[]>(data);

    useEffect(() => {
       if(searchText!==''){
            setIsSearch(true);
       }else{
            setIsSearch(false);
       }
    }, [searchText]);
    const latestQueryCategorieProfessionnelle = useRef('');
    useEffect(() => {
        dispatch(setCategorieProfessionnelleLoading(true));
        latestQueryCategorieProfessionnelle.current = searchText;
        
        try{
            
            const filterCategorieProfessionnelleByContent = async () => {
                if (searchText === '') {
                   
                    const result: CategorieProfessionnelle[] = data;
                    setFilteredData(result); 
                }else{
                    let categorieprofessionnellesResult : CategorieProfessionnelle[] = [];
                  
                    await searchCategorieProfessionnelle({ searchString:searchText, lang:lang}).then(result=>{
                        if (latestQueryCategorieProfessionnelle.current === searchText) {
                            if(result){
                                categorieprofessionnellesResult = result.categorieProfessionnelles;
                                setFilteredData(categorieprofessionnellesResult);
                            }
                        }
                        
                    })
                    
                }
        
                
            };
            filterCategorieProfessionnelleByContent();
        }catch(e){
            dispatch(setErrorPageCategorieProfessionnelle(t('message.erreur')));
        }finally{
            if (latestQueryCategorieProfessionnelle.current === searchText) {
                dispatch(setCategorieProfessionnelleLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

    const handleGradeSelect = (selected: Grade | undefined) => {
        console.log(selected)
        if (selected) {
            onGradeChange(selected);
        }
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(roles.admin === userRole || roles.superAdmin === userRole) && <ButtonCreate
                    title={t('boutton.nouvel_categorieprofessionnelle')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.categorie_professionnelle'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">     
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.categorie_professionnelle')} </h1>
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<Grade>
                                title={t('label.grade')}
                                selectedItem={currentGrade}
                                items={grades}
                                defaultValue={grades[0]} // ou spécifie une valeur par défaut
                                displayProperty={(grade: Grade) => `${lang === 'fr' ? grade.nomFr : grade.nomEn}`}
                                onSelect={handleGradeSelect}
                            />
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<Grade>
                                title={t('label.grade')}
                                selectedItem={currentGrade}
                                items={grades}
                                defaultValue={grades[0]} // ou spécifie une valeur par défaut
                                displayProperty={(grade: Grade) => `${lang === 'fr' ? grade.nomFr : grade.nomEn}`}
                                onSelect={handleGradeSelect}
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
                                <Skeleton count={15}/>
                                : filteredData?.length === 0 ?
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

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};

export default Table;