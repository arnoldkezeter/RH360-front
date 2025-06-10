import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import ProgressBar from "@ramonak/react-progress-bar";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { setMatiereLoading, setMatieres, setErrorPageMatiere } from "../../../_redux/features/progession_matiere_slice";
import { generateProgressChapitreByEnseignant, generateProgressChapitreByNiveau, getMatieresByEnseignantNiveau, getMatieresByNiveau } from "../../../api/api_matiere";
import createToast from "../../../hooks/toastify";
import LoadingTable from "../common/LoadingTable";
import { config } from "../../../config";
import Download from "../common/Download";
import { createPDF, extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";
import { setChapitreLoading, setChapitres, setErrorPageChapitre } from "../../../_redux/features/chapitre_slice";
import { getChapitreByMatiereWithPagination, getProgressionMatiere } from "../../../api/api_chapitre";
import NoDataTable from "../common/NoDataTable";
import Pagination from "../../Pagination/Pagination";
import { semestres } from "../../../pages/CommonPage/EmploiDeTemp";

const Table = ({ data, matieres, onEdit }: { data: ChapitreType[], matieres:MatiereType[], onEdit: (chapitre:ChapitreType) => void }) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    //Calcul de la progression de chaque leçon
    const calculateProgress = async (matiere : MatiereType | undefined) => {
        if(matiere && matiere._id){
            await getProgressionMatiere({matiereId:matiere._id}).then(result=>{
                setProgress(result);
            })
        }
    };

    // let matiere:Matiere=listMatieres[0];
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const departements:CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departementsAcademique) ?? [];
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const pageIsLoading = useSelector((state: RootState) => state.chapitreSlice.pageIsLoading);
    
    const [isDownload, setIsDownload]=useState(false);
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [matiere, setMatiere] = useState<MatiereType>();
    const [filteredMatiere, setFilteredMatiere] = matieres && matieres.length>0 ? useState<MatiereType | undefined>(matieres[0]):useState<MatiereType | undefined>();
    
    const [progress, setProgress] = useState(0);
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemester);
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');

    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);
    const [filteredNiveaux, setFilteredNiveaux] = useState<NiveauProps[]>([]);

    
    // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.chapitreSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.chapitreSlice.data.totalItems);
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
    


    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: CycleProps[] = cycles.filter(cycle => cycle.section === sectionId);
            if (result.length > 0) {
                setSelectIdCycle(result[0]._id);
                setCycle(cycles.find(cycle=>cycle._id ===result[0]._id))
            }else{
                setSelectIdCycle(undefined);
                setCycle(undefined);
                setFilteredNiveaux([]);
            }
            setFilteredCycle(result);
        }else{
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
                setNiveau(niveaux.find(niveau=>niveau._id===result[0]._id))
                setFilteredNiveaux(result)
            }else{
                setSelectIdNiveau(undefined);
                setNiveau(undefined);
                setFilteredNiveaux([])
            }
            
        }else{
            setFilteredNiveaux([])
            setSelectIdNiveau(undefined);
            setNiveau(undefined);
        }
    };

    // filtrer les donnee a partir de l'id du niveau selectionner
    const filterMatiereByNiveau = (niveauId: string | undefined) => {
        
        if (niveauId && niveauId !== '') {
            
        }
    };


    // recuperer l'id de la section suite au click sur l'input select
    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (roles.delegue !== currentUser.role && roles.etudiant !== currentUser.role) {
            if (selected?._id) {
                setSelectIdSection(selected._id);
                filterCycleBySection(selected._id);
                setSection(selected);
            }
        }
    };

    // valeur de la l'id du cycle selectionner    
    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (roles.delegue !== currentUser.role && roles.etudiant !== currentUser.role) {
            if (selected?._id) {
                setSelectIdCycle(selected._id);
                filterNiveauxByCycle(selected._id);
                setCycle(selected);
            }
        }
    };

    // valeur de la l'id du niveau selectionner    
    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (roles.delegue !== currentUser.role && roles.etudiant !== currentUser.role) {
            if (selected && selected?._id) {
                setSelectIdNiveau(selected._id);
                setNiveau(selected)
            }
        }
    };

    const handleMatiereSelect = (selected: MatiereType | undefined) => {
        if(selected){
            setFilteredMatiere(selected);
            setMatiere(selected)
        }
    };

    
    const handleDownloadSelect = async (selected: string) => {

        try{
            setIsDownload(true);
            let title = "progression_par_matiere";
            if(lang !== 'fr'){
                title = "subject_progression";
            }
            const departement=section && departements.find(dep=>dep._id && dep._id.toString()===section.departement.toString());
            if(selectNiveauId && section && cycle && niveau && departement){
                if(selected === 'PDF'){
                    if(currentUser && currentUser.role===roles.enseignant){
                        await generateProgressChapitreByEnseignant({ niveauId: selectNiveauId, enseignantId: currentUser._id, annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'pdf' } ).then((blob)=>{
                            // Créer un objet URL pour le blob PDF
                            if(blob){
                                createPDF(blob, title);
                            }
                        })
                    }else{
                        if(section && cycle && niveau && departement){
                            await generateProgressChapitreByNiveau({annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'pdf'}).then((blob)=>{
                                // Créer un objet URL pour le blob PDF
                                if(blob){
                                    createPDF(blob, title);
                                }
                            })
                        }
                    }
                    
                    
                }else if (selected === 'XLSX'){
                    if(currentUser && currentUser.role===roles.enseignant){
                        await generateProgressChapitreByEnseignant({ niveauId: selectNiveauId, enseignantId: currentUser._id, annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'xlsx' } ).then((blob)=>{
                            // Créer un objet URL pour le blob PDF
                            if(blob){
                                createPDF(blob, title, 'xlsx');
                            }
                        })
                    }else{

                        if(section && cycle && niveau && departement){
                            await generateProgressChapitreByNiveau({annee:selectedYear, semestre:selectedSemestre, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'xlsx', filename:title}).then((blob)=>{
                                // Créer un objet URL pour le blob PDF
                                if(blob){
                                    createPDF(blob, title, 'xlsx');
                                }
                            })
                        }
                    }
                }
            
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }
        
    };


    const handleAnneeSelect = (selected: String | undefined) => {
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
        }
    };

    const handleSemestreSelect = (selected: number | undefined) => {
        if(selected){
            setSelectedSemestre(selected);
        }
    };

    //fournir initialement les données à la page
    useEffect(() => {
        if(!selectSectionId){
            if (sections && sections.length > 0) {
                filterCycleBySection(sections[0]._id);
                setSection(sections[0]);
            }
        }else{
            setFilteredCycle([]);
            filterCycleBySection(selectSectionId);
        }
        
        
    }, [sections, selectSectionId]);

   

    useEffect(() => {
        if (filteredCycle && filteredCycle.length > 0) {
            if(!selectCycleId){
                filterNiveauxByCycle(filteredCycle[0]?._id);
            }else{
                filterNiveauxByCycle(selectCycleId);
            }
                
        } 
        if (roles.delegue === currentUser.role || roles.etudiant === currentUser.role) {
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux.find(niveau => niveau.annee === currentYear)?.niveau);
            const currentCycle = cycles.find(cycle => cycle._id === currentNiveau?.cycle)
            setSection(sections.find(section => section._id === currentCycle?.section));
            setCycle(currentCycle);
            setNiveau(currentNiveau);
            setSelectIdSection(section?._id);
            setSelectIdCycle(cycle?._id);
            setSelectIdNiveau(niveau?._id);
        }        
    }, [filteredCycle]);

    useEffect(() => {
        if (filteredNiveaux && filteredNiveaux.length > 0) {
            if(!selectNiveauId){
                filterMatiereByNiveau(filteredNiveaux[0]?._id);
            }else{
                filterMatiereByNiveau(selectNiveauId);
            }
                
        }        
    }, [filteredNiveaux]);
    useEffect(() => {
        const fetchMatieres = async () => {
            const emptyMatieres : ProgressionMatiereReturnGetType = {
                matieres: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0
            }
            if (sections.length > 0 && cycles.length > 0 && niveaux.length > 0) {
                dispatch(setMatiereLoading(true)); // Définir le chargement à true avant de récupérer les données
                try {
                    
                   
                    if (selectNiveauId && selectedSemestre && selectedYear) {
                        
                        let fetchedMatieres : MatiereReturnGetType | null
                        if(currentUser && currentUser.role===roles.enseignant){
                            fetchedMatieres = await getMatieresByEnseignantNiveau({ niveauId: selectNiveauId, enseignantId: currentUser._id, annee:selectedYear, semestre:selectedSemestre, langue:lang });
                        }else{
                            fetchedMatieres = await getMatieresByNiveau({ niveauId: selectNiveauId, annee:selectedYear, semestre:selectedSemestre, langue:lang });
                        }

                        if(fetchedMatieres){
                            dispatch(setMatieres(fetchedMatieres));   
                        }else{
                            dispatch(setMatieres(emptyMatieres));    
                        }
                        
                    }else{
                        dispatch(setMatieres(emptyMatieres));
                    }
                    dispatch(setErrorPageMatiere(null)); // Réinitialiser les erreurs s'il y en a
                } catch (error) {
                    dispatch(setErrorPageMatiere(t('message.erreur')));
                    createToast(t('message.erreur'), "", 2);
                } finally {
                    dispatch(setMatiereLoading(false)); // Définir le chargement à false après avoir récupéré les données
                }
            }else{
                dispatch(setMatieres(emptyMatieres));
            }
        };

        fetchMatieres();
        
    }, [dispatch, selectNiveauId, selectedYear, selectedSemestre, t]);

    useEffect(() => {
        if (matieres && matieres.length > 0) {
            // Sélectionner la première matière et mettre à jour les états nécessaires
            if(matiere){
                setFilteredMatiere(matiere);
                
                calculateProgress(matiere);
                // setCurrentPage(1);
                setMatiere(matiere)
            }else{
                setFilteredMatiere(matieres[0]);
                
                calculateProgress(matieres[0]);
                setCurrentPage(1);
                setMatiere(matieres[0])

            }
            
        }else{
            setFilteredMatiere(undefined);
            setMatiere(undefined);
            setCurrentPage(1);
            setProgress(0);
            
        }
        
    }, [matieres, dispatch, t, data]);

    useEffect(() => {
        
        const fetchChapitres = async () => {
            dispatch(setChapitreLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyChapitres: ChapitreReturnGetType = {
                    chapitres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                
                if(matiere && matiere._id){
                    const fetchedChapitres = await getChapitreByMatiereWithPagination({ matiereId: matiere._id, page: currentPage, annee: selectedYear, semestre: selectedSemestre, langue:lang });
                        
                    if (fetchedChapitres) { // Vérifiez si fetchedChapitres n'est pas faux, vide ou indéfini
                        dispatch(setChapitres(fetchedChapitres));
                        // setFilteredData(fetchedChapitres.chapitres);
                    } else {
                        dispatch(setChapitres(emptyChapitres));
                        // setFilteredData(emptyChapitres.chapitres)
                    }
                }else {
                    
                    dispatch(setChapitres(emptyChapitres));
                    
                    // setFilteredData(emptyChapitres.chapitres)
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageChapitre(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setChapitreLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        
        fetchChapitres();
        
    }, [currentPage, matiere]); // Déclencher l'effet lorsque currentPage change


    return (
        <div>
            
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.progression')} </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
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
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                selectedItem={section}
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                items={filteredCycle}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                selectedItem={cycle}
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                items={filteredNiveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                selectedItem={niveau}
                                displayProperty={(niveau: CommonSettingProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />                         
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={semestres}
                                defaultValue={selectedSemestre} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            <CustomDropDown2<MatiereType>
                                title={t('label.matiere')}
                                selectedItem={matiere}
                                items={matieres}
                                defaultValue={matiere} // ou spécifie une valeur par défaut
                                displayProperty={(matiere: MatiereType) => `${lang === 'fr'?matiere.libelleFr:matiere.libelleEn}`}
                                onSelect={handleMatiereSelect}
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
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                items={sections}
                                defaultValue={section} // ou spécifie une valeur par défaut
                                selectedItem={section}
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                items={filteredCycle}
                                defaultValue={cycle} // ou spécifie une valeur par défaut
                                selectedItem={cycle}
                                displayProperty={(cycle: CommonSettingProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                items={filteredNiveaux}
                                defaultValue={niveau} // ou spécifie une valeur par défaut
                                selectedItem={niveau}
                                displayProperty={(niveau: CommonSettingProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={semestres}
                                defaultValue={selectedSemestre} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            <CustomDropDown2<MatiereType>
                                title={t('label.matiere')}
                                selectedItem={matiere}
                                items={matieres}
                                defaultValue={matiere} // ou spécifie une valeur par défaut
                                displayProperty={(matiere: MatiereType) => `${lang === 'fr'?matiere.libelleFr:matiere.libelleEn}`}
                                onSelect={handleMatiereSelect}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    {
                    progress == null ?
                        <h4 className={`text-[22px] font-bold ml-1 pb-[50px] lg:pb-[40px] `}>
                            {/* {value} */}
                        </h4> :
                        <div className="w-full mt-2">
                            <ProgressBar completed={progress}  />

                        </div>}
                </div>


                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading  ?
                                <LoadingTable />:
                                 data.length==0?
                                    <NoDataTable/> :
                                    matiere&&<HeaderTable matiere={filteredMatiere} />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={data} onEdit={onEdit}/>
                        }




                    </table>
                </div>

                {/* Pagination */}
                {data && data.length>0 && <Pagination 
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
            <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}

            </div>

        </div>
    );
};


export default Table;