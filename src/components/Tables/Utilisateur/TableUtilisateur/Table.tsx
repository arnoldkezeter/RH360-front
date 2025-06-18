import { useDispatch, useSelector } from "react-redux";
import LoadingTable from "../../common/LoadingTable";
import NoDataTable from "../../common/NoDataTable";
import InputSearch from "../../common/SearchTable";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";

import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import { setErrorPageUtilisateur, setUtilisateursLoading } from "../../../../_redux/features/utilisateurs/utilisateurSlice";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import Pagination from "../../../Pagination/Pagination";
import { searchUtilisateur } from "../../../../services/utilisateurs/utilisateurAPI";
import { ROLES } from "../../../../config";


interface TableUtilisateurProps {
    data: Utilisateur[];
    structures:Structure[];
    services:Service[];
    currentPage: number;
    currentStructure?:Structure;
    currentService?:Service;
    currentRole?:Role;
    onPageChange: (page: number) => void;
    onServiceChange:(service:Service)=>void;
    onStructureChange:(structure:Structure)=>void;
    onRoleChange:(role:Role)=>void;
    onResetFilters:(value:boolean)=>void;
    onEdit: (utilisateur : Utilisateur) => void;
}

const Table = ({ data, structures, services, currentPage, currentService, currentStructure, currentRole, onPageChange, onServiceChange, onStructureChange, onRoleChange, onResetFilters, onEdit}: TableUtilisateurProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const roles = Object.values(ROLES)
    const userRole = useSelector((state: RootState) => state.user.role);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const pageIsLoading = useSelector((state: RootState) => state.utilisateurSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);

    
     const handleStructureSelect = (selected: Structure | undefined) => {
        if (selected) {
            onStructureChange(selected);
        }
    };

    const handleServiceSelect = (selected: Service | undefined) => {
        if (selected) {
            onServiceChange(selected);
        }
    };

    const handleRoleSelect = (selected: Role| undefined) => {
        if (selected) {
            onRoleChange(selected);
        }
    };

    const handleResetSelect = () => {
        onResetFilters(true);
    };

   

    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.utilisateurSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.utilisateurSlice.data.totalItems);
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
    const [filteredData, setFilteredData] = useState<Utilisateur[]>(data);
    

    const latestQueryUtilisateur = useRef('');
    useEffect(() => {
        dispatch(setUtilisateursLoading(true));
        latestQueryUtilisateur.current = searchText;
        
        try{
            
            const filterUtilisateurByContent = async () => {
                if (searchText === '') {
                    // if(isSearch){
                        // sections.length>0?setSection(sections[0]):setSection(undefined);
                        // filterCycleBySection(section?._id);
                        // filterNiveauxByCycle(cycle?._id);
                        
                        const result: Utilisateur[] = data;
                        setFilteredData(result); 
                        
                    // }
                }else{
                    // setSection(undefined);
                    // setCycle(undefined);
                    // setNiveau(undefined);
                    // setFilteredCycle([]);
                    // setFilteredNiveaux([]);
                    let utilisateursResult : Utilisateur[] = [];
                    
                    await searchUtilisateur({ searchString:searchText, lang}).then(result=>{
                        if (latestQueryUtilisateur.current === searchText) {
                            if(result){
                                utilisateursResult = result.utilisateurs;
                                setFilteredData(utilisateursResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            
            filterUtilisateurByContent();
        }catch(e){
            dispatch(setErrorPageUtilisateur(t('message.erreur')));
        }finally{
            if (latestQueryUtilisateur.current === searchText) {
                dispatch(setUtilisateursLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);
    return (
        <div>
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-2">
    
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-y-2">
                            {/* InputSearch pour mobile */}
                            <div className="w-full">
                                <InputSearch 
                                    hintText={t('recherche.rechercher')+t('recherche.utilisateur')} 
                                    value={searchText} 
                                    onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                                />
                            </div>
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
                            <CustomDropDown2<Role>
                                title={t('label.role')}
                                selectedItem={currentRole}
                                items={roles}
                                defaultValue={undefined}
                                displayProperty={(role: Role) => `${lang === 'fr' ? role.nomFr : role.nomEn}`}
                                onSelect={handleRoleSelect}
                            />
                            
                            {/* Bouton refresh pour mobile */}
                            <div className="w-full flex justify-end mt-2">
                                <button 
                                    onClick={handleResetSelect}
                                    className=""
                                >
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

                    {/* Structure */}
                    <div className="min-w-[180px] flex-1">
                        <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            {t('label.structure')}
                        </label>
                        <CustomDropDown2<Structure>
                            title={""}
                            selectedItem={currentStructure}
                            items={structures}
                            defaultValue={undefined}
                            displayProperty={(structure: Structure) => `${lang === 'fr' ? structure.nomFr : structure.nomEn}`}
                            onSelect={handleStructureSelect}
                        />
                    </div>

                    {/*Service*/}
                    <div className="min-w-[180px] flex-1">
                        <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            {t('label.service')}
                        </label>
                        <CustomDropDown2<Service>
                            title={""}
                            selectedItem={currentService}
                            items={services}
                            defaultValue={undefined}
                            displayProperty={(service: Service) => `${lang === 'fr' ? service.nomFr : service.nomEn}`}
                            onSelect={handleServiceSelect}
                        />
                    </div>

                    {/* Role */}
                    <div className="min-w-[180px] flex-1">
                        <label className="text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            {t('label.role')}
                        </label>
                        <CustomDropDown2<Role>
                            title={""}
                            selectedItem={currentRole}
                            items={roles}
                            defaultValue={undefined}
                            displayProperty={(role: Role) => `${lang === 'fr' ? role.nomFr : role.nomEn}`}
                            onSelect={handleRoleSelect}
                            
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
                        hintText={t('recherche.rechercher')+t('recherche.utilisateur')} 
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
                                <LoadingTable />
                                : filteredData.length === 0 ?
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
        </div>
    );
};


export default Table;