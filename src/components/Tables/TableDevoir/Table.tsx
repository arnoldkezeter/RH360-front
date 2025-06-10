import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { setErrorPageDevoir, setDevoirLoading, setDevoirs } from "../../../_redux/features/devoir_slice";
import { apiSearchDevoir, apiSearchDevoirByEnseignant, getDevoirsByEnseignantPaginated, getDevoirsByNiveauPaginated } from "../../../services/api_devoir";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";
import { extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";

interface TableDevoirProps {
    data: DevoirType[];
    onCreate: () => void;
    onEdit: (devoir: DevoirType) => void;
}

const Table = ({ data, onCreate, onEdit}: TableDevoirProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    // const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const pageIsLoading = useSelector((state: RootState) => state.devoirSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023; 
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageHomeworkPermission = userPermissions.includes('gerer_cahiers_exercices');

    // // Filtrer les niveaux de l'utilisateur enseignant
    // const niveauxEnseignant = niveaux.filter(niveau => niveau._id && niveauxEnseignantIds.includes(niveau._id));
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>();
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>();
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>();
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>();

    const [filteredSection, setFilteredSection] = useState<SectionProps[]>([]);
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);
    const [filteredNiveaux, setFilteredNiveaux] = useState<NiveauProps[]>([]);
    const [searchText, setSearchText] = useState<string>('');



    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: CycleProps[] = cycles.filter(cycle => cycle.section === sectionId);
            if (result.length > 0) {
                setSelectIdCycle(result[0]._id);
                setCycle(cycles.find(cycle => cycle._id === result[0]._id))
                filterNiveauxByCycle(cycle?._id)
            } else {
                setSelectIdCycle(undefined);
                setCycle(undefined);
                filterNiveauxByCycle(undefined);
                setFilteredNiveaux([]);
            }
            setFilteredCycle(result);
        } else {
            setFilteredCycle([])
            setSelectIdCycle(undefined);
            setCycle(undefined);
        }
    };

    // filtrer les donnee a partir de l'id du cycle selectionner
    const filterNiveauxByCycle = (cycleId: string | undefined) => {

        if (cycleId && cycleId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: NiveauProps[] = niveaux.filter(niveau => niveau.cycle === cycleId);
            if (result.length > 0) {
                setSelectIdNiveau(result[0]._id);
                setNiveau(niveaux.find(niveau => niveau._id === result[0]._id))
                setFilteredNiveaux(result)
            } else {
                setSelectIdNiveau(undefined);
                setNiveau(undefined);
                setFilteredNiveaux([])
            }

        } else {
            setFilteredNiveaux([])
            setSelectIdNiveau(undefined);
            setNiveau(undefined);
        }
    };
    const [formatToDownload, setFormatToDownload] = useState("");


    // const handleDownloadSelect = async (selected: string) => {
    //     setFormatToDownload(selected);
    //     try{
    //         setIsDownload(true);
    //         let title =`maquette_pédagogique_${formatYear(selectedYear)}_semestre_${selectedSemestre}`.replace("-","_")
    //         if (lang !== 'fr') {
    //             title = `pedagogical_framework_${formatYear(selectedYear)}_semester_${selectedSemestre}`.replace("-","_")
    //         }
    //         const departement=section && departements.find(dep=>dep._id && dep._id.toString()===section.departement.toString());
    //         if(selectNiveauId && section && cycle && niveau && departement){
    //             if(selected === 'PDF'){
                    
    //                 if(hasManageSubjectPermission || currentUser.role === roles.etudiant || currentUser.role === roles.delegue){
    //                     if(selectedYear){
    //                         await generateListMatByNiveau({annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'pdf'}).then((blob)=>{
    //                             // Créer un objet URL pour le blob PDF
    //                             if(blob){
    //                                 createPDF(blob, title);
    //                             }
    //                         })
    //                     }else{
    //                         alert(t("label.message_telecharger"));
    //                     }
    //                 }else{
    //                     if(currentUser && currentUser.role===roles.enseignant && selectedYear && selectedSemestre){
    //                         await generateListMatByEnseignantNiveau({ niveauId: selectNiveauId, enseignantId: currentUser._id, annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'pdf' } ).then((blob)=>{
    //                             // Créer un objet URL pour le blob PDF
    //                             if(blob){
    //                                 createPDF(blob, title);
    //                             }
    //                         })
    //                     }
    //                 }
                    
    //             }else{
    //                 if(hasManageSubjectPermission || currentUser.role === roles.etudiant || currentUser.role === roles.delegue){
    //                     if(selectedYear){
    //                         await generateListMatByNiveau({annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'xlsx'}).then((blob)=>{
    //                             // Créer un objet URL pour le blob PDF
    //                             if(blob){
    //                                 createPDF(blob, title, 'xlsx');
    //                             }
    //                         })
    //                     }else{
    //                         alert(t("label.message_telecharger"));
    //                     }
    //                 }else{
    //                     if(currentUser && currentUser.role===roles.enseignant && selectedYear && selectedSemestre){
    //                         await generateListMatByEnseignantNiveau({ niveauId: selectNiveauId, enseignantId: currentUser._id, annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'xlsx' } ).then((blob)=>{
    //                             // Créer un objet URL pour le blob PDF
    //                             if(blob){
    //                                 createPDF(blob, title, 'xlsx');
    //                             }
    //                         })
    //                     }
    //                 }
                    
    //             }
    //         }else{
    //             alert(t("label.message_telecharger"));
    //         }
    //     } catch (error) {
    //         createToast(t('message.erreur'), "", 2);
    //     }finally {
    //         setIsDownload(false);
    //     }

    // };


    const handleAnneeSelect = (selected: String | undefined) => {
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
            if(!selectedSemestre || !section){
                sections.length>0 && setSection(sections[0]);
                sections.length>0 && setSelectIdSection(sections[0]._id);
                sections.length>0 && filterCycleBySection(sections[0]._id);
                setSelectedSemestre(currentSemestre);
                setSearchText('');
            }
        }
    };

    
    // recuperer l'id de la section suite au click sur l'input select
    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (selected?._id) {
            if(!selectedSemestre || !selectedYear){
                setSelectedYear(currentYear);
                setSelectedSemestre(currentSemestre);
            }
            setSelectIdSection(selected._id);
            filterCycleBySection(selected._id);
            setSection(selected);
            setSearchText('');
        }
    };

    // valeur de la l'id du cycle selectionner    
    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (selected?._id) {
            setSelectIdCycle(selected._id);
            filterNiveauxByCycle(selected._id);
            setCycle(selected);
        }
    };

    // valeur de la l'id du niveau selectionner    
    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (selected && selected?._id) {
            setSelectIdNiveau(selected._id);
            setNiveau(selected)
        }
    };

    // Filtrer les matières en fonction de la langue



    // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.devoirSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.devoirSlice.data.totalItems);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    
    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Render page numbers
    const pageNumbers :number[]= [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    

    //fournir initialement les données à la page
    // Effet pour filtrer les options des CustomDropDown

    // const filteredCycles = cycles.filter(cycle =>
    //     niveauxEnseignant.some(niveau => niveau.cycle === cycle._id)
    // );
    // const filteredSections = sections.filter(section =>
    //     filteredCycles.some(cycle => cycle.section === section._id)
    // );
    useEffect(() => {
        setFilteredSection(sections);
    }, []);
    useEffect(() => {
        
        if (currentUser && currentUser.role === roles.enseignant) {
            setSelectedYear(currentYear);
            setSelectedSemestre(currentSemestre);
            if (!selectSectionId) {
                if (sections && sections.length > 0) {
                    filterCycleBySection(sections[0]._id);
                    setSection(sections[0]);
                }
            } else {
                setFilteredCycle([]);
                filterCycleBySection(selectSectionId);
            }
        }else {
            setSelectedYear(currentYear);
            setSelectedSemestre(currentSemestre);
            if (!selectSectionId) {
                if (sections && sections.length > 0) {
                    filterCycleBySection(sections[0]._id);
                    setSection(sections[0]);
                }
            } else {
                setFilteredCycle([]);
                filterCycleBySection(selectSectionId);
            }
        }
        


    }, [sections, selectSectionId]);

    useEffect(() => {
        if (filteredCycle && filteredCycle.length > 0) {
            if (!selectCycleId) {
                filterNiveauxByCycle(filteredCycle[0]?._id);
            } else {
                filterNiveauxByCycle(selectCycleId);
            }

        }
    }, [filteredCycle]);

    useEffect(() => {
        
        const fetchDevoirs = async () => {
            dispatch(setDevoirLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyDevoirs: DevoirReturnGetType = {
                    devoirs: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if(hasManageHomeworkPermission || currentUser.role === roles.etudiant || currentUser.role === roles.delegue){
                    if (selectNiveauId) {
                        const fetchedDevoirs = await getDevoirsByNiveauPaginated({ niveauId: selectNiveauId, page: currentPage, annee: selectedYear });
                        
                        if (fetchedDevoirs) { // Vérifiez si fetchedDevoirs n'est pas faux, vide ou indéfini
                            dispatch(setDevoirs(fetchedDevoirs));
                        } else {

                            dispatch(setDevoirs(emptyDevoirs));
                        }
                    } else {
                        let fetchedDevoirs = emptyDevoirs;
                        if(!section){
                            fetchedDevoirs = await getDevoirsByEnseignantPaginated({ enseignantId: currentUser._id, page: currentPage, annee: selectedYear});
                        }
                        if (fetchedDevoirs) { // Vérifiez si fetchedDevoirs n'est pas faux, vide ou indéfini
                            dispatch(setDevoirs(fetchedDevoirs));
                        } else {

                            dispatch(setDevoirs(emptyDevoirs));
                        }
                    }
                }else{
                    if (currentUser && currentUser.role === roles.enseignant) {
                        if (selectNiveauId) {
                            let fetchedDevoirs: DevoirReturnGetType | undefined;
                            if(selectedYear && selectedSemestre){
                                 fetchedDevoirs = await getDevoirsByEnseignantPaginated({ enseignantId: currentUser._id, page: currentPage, annee: selectedYear});
                            }
                            
    
                            if (fetchedDevoirs) { // Vérifiez si fetchedDevoirs n'est pas faux, vide ou indéfini
                                dispatch(setDevoirs(fetchedDevoirs));
                            } else {
    
                                dispatch(setDevoirs(emptyDevoirs));
                            }
                        } else{
                            dispatch(setDevoirs(emptyDevoirs));
                        }
                    }
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageDevoir(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setDevoirLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchDevoirs();
    },[dispatch, currentPage, selectedYear, selectNiveauId, t]); // Déclencher l'effet lorsque currentPage change
    

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<DevoirType[]>(data);

   
    
    const latestQueryDevoir = useRef('');
    useEffect(() => {
        dispatch(setDevoirLoading(true));
        latestQueryDevoir.current = searchText;
        try{
            
            const filterDevoirByContent = async () => {
                if (searchText === '') {
                    
                    
                    const result: DevoirType[] = data;
                    setFilteredData(result); 
                }else{
                    
                    let devoirsResult : DevoirType[] = [];
                    if(hasManageHomeworkPermission || currentUser.role === roles.etudiant || currentUser.role === roles.delegue){
                        
                        await apiSearchDevoir({ searchString:searchText, limit:10, langue:lang }).then(result=>{
                            if (latestQueryDevoir.current === searchText) {
                                if(result){
                                    devoirsResult = result.devoirs;
                                    setFilteredData(devoirsResult);
                                }else{
                                    setFilteredData(devoirsResult)
                                }
                            }
                            
                        })
                    }else{
                        if(currentUser.role === roles.enseignant){
                            if(selectedYear){
                                await apiSearchDevoirByEnseignant({ searchString:searchText, limit:10, langue:lang, enseignantId:currentUser._id }).then(result=>{
                                    if (latestQueryDevoir.current === searchText) {
                                        if(result){
                                            devoirsResult = result.devoirs;
                                            setFilteredData(devoirsResult);
                                        }else{
                                            setFilteredData(devoirsResult)
                                        }
                                    }
                                    
                                })
                            }
                        }
                    }
                    
                }                
            };
            filterDevoirByContent();
        }catch(e){
            dispatch(setErrorPageDevoir(t('message.erreur')));
        }finally{
            if (latestQueryDevoir.current === searchText) {
                dispatch(setDevoirLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);



    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {hasManageHomeworkPermission && (<ButtonCreate
                    onClick={() => { onCreate(); dispatch(setShowModal()); } } title={""}                />)}
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.devoir')} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.devoir')} 
                </h1>
                
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut
                                onSelect={handleAnneeSelect}
                            />
                            
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={filteredSection}
                                defaultValue={filteredSection[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={cycle} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={filteredNiveaux[0]} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(selectedYear)} // ou spécifie une valeur par défaut
                                onSelect={handleAnneeSelect}
                            />
                            
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={filteredSection}
                                defaultValue={section} // ou spécifie une valeur par défaut
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={cycle} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={niveau} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
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
                                : filteredData.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit} />
                        }




                    </table>
                </div>

                {/* Pagination */}

                {((searchText ==='') && (hasManageHomeworkPermission) && (filteredData && filteredData.length>0)) && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}
                />}

            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}
            </div> */}

        </div>
    );
};


export default Table;