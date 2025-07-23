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
import { setBesoinFormationPredefiniLoading, setErrorPageBesoinFormationPredefini } from "../../../../_redux/features/parametres/besoinFormationPredefini";
import { searchBesoinFormationPredefini } from "../../../../services/settings/besoinFormationPredefiniAPI";
import Skeleton from "react-loading-skeleton";
import { NoData } from "../../../NoData";
import { FaFilter, FaSort } from "react-icons/fa";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";

interface TablebesoinFormationPredefiniProps {
    data: BesoinFormationPredefini[];
    currentPage: number;
    famillesMetier:FamilleMetier[];
    postesDeTravail:PosteDeTravail[];
    currentFamille?:FamilleMetier;
    currentPoste?:PosteDeTravail;
    onFamilleChange:(famille:FamilleMetier)=>void;
    onPosteChange:(poste:PosteDeTravail)=>void;
    onPageChange: (page: number) => void;
    onCreate:()=>void;
    onEdit: (besoinFormationPredefini:BesoinFormationPredefini) => void;
}

const Table = ({data,famillesMetier, postesDeTravail, currentFamille, currentPoste, currentPage, onFamilleChange, onPosteChange, onPageChange, onCreate, onEdit}: TablebesoinFormationPredefiniProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.besoinFormationPredefiniSlice.pageIsLoading);
    const userRole = useSelector((state: RootState) => state.utilisateurSlice.utilisateur.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dispatch = useDispatch();
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    
    
   // variable pour la pagination
   
   const itemsPerPage =  useSelector((state: RootState) => state.besoinFormationPredefiniSlice.data.pageSize); // nombre d'éléments maximum par page
   const count = useSelector((state: RootState) => state.besoinFormationPredefiniSlice.data.totalItems);
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
    const handleFamilleMetierSelect = (selected: FamilleMetier | undefined) => {
        if (selected) {
            onFamilleChange(selected);
        }
    };
    const handlePosteSelect = (selected: PosteDeTravail | undefined) => {
        if (selected) {
            onPosteChange(selected);
        }
    };
   
    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<BesoinFormationPredefini[]>(data);
    useEffect(() => {
       if(searchText!==''){
            setIsSearch(true);
       }else{
            setIsSearch(false);
       }
    }, [searchText]);
    const latestQuerybesoinFormationPredefini = useRef('');
    useEffect(() => {
        dispatch(setBesoinFormationPredefiniLoading(true));
        latestQuerybesoinFormationPredefini.current = searchText;
        
        try{
            
            const filterbesoinFormationPredefiniByContent = async () => {
                if (searchText === '') {
                   
                    const result: BesoinFormationPredefini[] = data;
                    setFilteredData(result); 
                }else{
                    let besoinFormationPredefinisResult : BesoinFormationPredefini[] = [];
                  
                    await searchBesoinFormationPredefini({ searchString:searchText, lang:lang}).then(result=>{
                        if (latestQuerybesoinFormationPredefini.current === searchText) {
                            if(result){
                                besoinFormationPredefinisResult = result.besoinsFormationPredefinis;
                                setFilteredData(besoinFormationPredefinisResult);
                            }
                        }
                        
                    })
                    
                }
        
                
            };
            filterbesoinFormationPredefiniByContent();
        }catch(e){
            dispatch(setErrorPageBesoinFormationPredefini(t('message.erreur')));
        }finally{
            if (latestQuerybesoinFormationPredefini.current === searchText) {
                dispatch(setBesoinFormationPredefiniLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

   

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(roles.admin === userRole || roles.superAdmin === userRole) && <ButtonCreate
                    title={t('boutton.nouvel_besoinFormationPredefini')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.besoin_formation_predefini'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">                
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5 py-1 border border-gray text-[12px] mb-2 flex justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}>
                        <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort />
                    </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start pb-2 gap-y-3 z-100">

                            <CustomDropDown2<FamilleMetier>
                                title={t('label.famille_metier')}
                                selectedItem={currentFamille}
                                items={famillesMetier}
                                defaultValue={currentFamille}
                                displayProperty={(familleMetier: FamilleMetier) => `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`}
                                onSelect={handleFamilleMetierSelect}
                            />
                            <CustomDropDown2<PosteDeTravail>
                                title={t('label.poste_de_travail')}
                                selectedItem={currentPoste}
                                items={postesDeTravail}
                                defaultValue={currentPoste}
                                displayProperty={(poste: PosteDeTravail) => `${lang === 'fr' ? poste.nomFr : poste.nomEn}`}
                                onSelect={handlePosteSelect}
                            />
                        
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    {/* Ligne 1 : Filtres alignés */}
                    <div className="flex flex-wrap gap-4 items-end mt-4">

                        {/* FamilleMetier */}
                        <div className="min-w-[175px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.famille_metier')}
                            </label>
                            <CustomDropDown2<FamilleMetier>
                                title=""
                                selectedItem={currentFamille}
                                items={famillesMetier}
                                defaultValue={undefined}
                                displayProperty={(familleMetier: FamilleMetier) => `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`}
                                onSelect={handleFamilleMetierSelect}
                            />
                        </div>

                        {/* PosteDeTravail */}
                        <div className="min-w-[175px] flex-1">
                            <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                {t('label.poste_de_travail')}
                            </label>
                            <CustomDropDown2<PosteDeTravail>
                                title=""
                                selectedItem={currentPoste}
                                items={postesDeTravail}
                                defaultValue={currentPoste}
                                displayProperty={(poste: PosteDeTravail) => `${lang === 'fr' ? poste.nomFr : poste.nomEn}`}
                                onSelect={handlePosteSelect}
                                
                            />
                        </div>

                    </div>
                    
                </div>
                {/* DEBUT DU TABLE */}
                
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8 z-0">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <Skeleton count={15}/>
                                : (!filteredData || filteredData?.length === 0) ?
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