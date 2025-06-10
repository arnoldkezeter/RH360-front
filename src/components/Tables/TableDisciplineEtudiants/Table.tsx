import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../common/SearchTable";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { createPDF, extractYear, generateYearRange } from "../../../fonctions/fonction";
import Pagination from "../../Pagination/Pagination";
import { setAnneeDisciplineEns, setEtudiantDiscipline, setEtudiantsDisciplineLoadingOnTable, setErrorPageEtudiantDiscipline, setSemestreDisciplineEns } from "../../../_redux/features/absence/discipline_etudiant_slice";
import { apiGetAbsencesWithEtudiantsByFilter, apiSearchUserDisciplineEtudiant, generateListAbsenceEtudiant } from "../../../api/discipline/api_discipline";
import LoadingOnTable from "../common/LoadingOnTable";
import createToast from "../../../hooks/toastify";
import NoDataTable from "../common/NoDataTable";
import Download from "../common/Download";
import { semestres } from "../../../pages/CommonPage/EmploiDeTemp";

interface TableDisciplineProps {
    data: UserDiscipline[];
    onEdit: (etudiant: UserDiscipline) => void;
}


const Table = ({ data, onEdit }: TableDisciplineProps) => {

    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const { t } = useTranslation();
    const dispatch = useDispatch();



    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };



    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const selectedSemestre = useSelector((state: RootState) => state.etudiantDisciplineSlice.selected.semestre)
    const [selectSemestre, setSelectSemestre] = useState(currentSemestre);
    const [selectedYear, setSelectYear] = useState(currentYear);
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const departements = useSelector((state: RootState) => state.dataSetting.dataSetting.departementsAcademique) ?? [];
    const [section, setSection] = sections.length > 0 ? useState<SectionProps | undefined>(sections[0]) : useState<SectionProps | undefined>();;
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();


    const listAnnee = generateYearRange(currentYear, firstYear);

    const [annee, setAnnee] = useState<string | undefined>(`${firstYear}/${firstYear + 1}`);
    const [semestre, setSemestre] = useState<number | undefined>(selectedSemestre ? selectedSemestre : currentSemestre);
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');

    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);
    const [filteredNiveaux, setFilteredNiveaux] = useState<NiveauProps[]>([]);

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
    const handleAnneeSelect = (selected: string | undefined) => {
        if (selected) {
            setAnnee(selected);
            setSelectYear(extractYear(selected));
            dispatch(setAnneeDisciplineEns(parseInt(selected)))
        }
        // setFonction(selected);
        // dispatch(setSelectedEtudiant({ key: "fonction", value: selected }))

    };

    const handleSemestreSelect = (selected: number | undefined) => {
        if (selected) {
            setSelectSemestre(selected)
            setSemestre(selected);
            dispatch(setSemestreDisciplineEns(selected));
        }

    };

    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (selected?._id) {
            setSelectIdSection(selected._id);
            filterCycleBySection(selected._id);
            setSection(selected);
            setSearchText("")
        }
    };

    // valeur de la l'id du cycle selectionner    
    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (selected?._id) {
            setSelectIdCycle(selected._id);
            filterNiveauxByCycle(selected._id);
            setCycle(selected);
            setSearchText("")
        }
    };

    // valeur de la l'id du niveau selectionner    
    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (selected && selected?._id) {
            setSelectIdNiveau(selected._id);
            setNiveau(selected);
            setSearchText("")
        }
    };






    // recherche
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UserDiscipline[]>(data);


    // useEffect(() => {
    //     const result = filterEtudiantByContent(data);
    //     setFilteredData(result);
    // }, [searchText, data]);

    const latestQueryDiscipline = useRef('');
   
    useEffect(() => {
        dispatch(setEtudiantsDisciplineLoadingOnTable(true));
        latestQueryDiscipline.current = searchText;
        try{
            
            const filterDisciplineByContent = async () => {
                if (searchText === '') {
                    // setAnnee(formatYear(currentYear));
                    // sections.length>0?setSection(sections[0]):setSection(undefined);
                    // filterCycleBySection(section?._id);
                    // setCycle(filteredCycle[0]);
                    // filterNiveauxByCycle(cycle?._id);
                    // setNiveau(filteredNiveaux[0]);
                    
                    const result: UserDiscipline[] = data;
                    setFilteredData(result); 
                }else{
                    // setSection(undefined);
                    // setCycle(undefined);
                    // setNiveau(undefined);
                    // setFilteredCycle([]);
                    // setFilteredNiveaux([]);
                    let disciplinesResult : UserDiscipline[] = [];
                    await apiSearchUserDisciplineEtudiant({annee:selectedYear, semestre:selectSemestre, searchText:searchText}).then(result=>{
                        if (latestQueryDiscipline.current === searchText) {
                            if(result){
                                disciplinesResult = result.etudiants;
                                setFilteredData(disciplinesResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            filterDisciplineByContent();
        }catch(e){
            dispatch(setErrorPageEtudiantDiscipline(t('message.erreur')));
        }finally{
            if (latestQueryDiscipline.current === searchText) {
                dispatch(setEtudiantsDisciplineLoadingOnTable(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);


    const pageIsLoadingOnTable = useSelector((state: RootState) => state.etudiantDisciplineSlice.pageIsLoadingOnTable);
    const [isDownload, setIsDownload] = useState(false);



    // start pagination
    const itemsPerPage =  useSelector((state: RootState) => state.etudiantDisciplineSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.etudiantDisciplineSlice.data.totalItems);
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
    
    // end --------- pagination
   
    useEffect(() => {
        // if (annee && semestre) {
        dispatch(setAnneeDisciplineEns(selectedYear));
        dispatch(setSemestreDisciplineEns(selectSemestre));
        // }



        // if (isInitialMount) {
        //     setIsInitialMount(false);
        //     return;
        // }


        const fetchEtudiantWithAbsences = async () => {
            dispatch(setEtudiantsDisciplineLoadingOnTable(true));

            try {
                const emptyEtudiants: EtudiantDisciplineListGetType = {
                    etudiants: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if (selectNiveauId) {
                    const fetchedEtudiants = await apiGetAbsencesWithEtudiantsByFilter({
                        page: currentPage, semestre: selectSemestre, annee: selectedYear, niveauId: selectNiveauId
                    });
                    if (fetchedEtudiants) {
                        dispatch(setEtudiantDiscipline(fetchedEtudiants));

                        dispatch(setErrorPageEtudiantDiscipline(null));
                    } else {
                        dispatch(setEtudiantDiscipline(emptyEtudiants));
                        dispatch(setErrorPageEtudiantDiscipline(t('message.erreur')));
                    }
                } else {
                    dispatch(setEtudiantDiscipline(emptyEtudiants));
                }
            } catch (error) {
                dispatch(setErrorPageEtudiantDiscipline(t('message.erreur')));
            } finally {
                dispatch(setEtudiantsDisciplineLoadingOnTable(false));
            }
        }

        fetchEtudiantWithAbsences();

    }, [dispatch, selectNiveauId, selectedYear, selectSemestre, currentPage, t]);



   
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const handleDownloadSelect = async (selected: string) => {
        // setFormatToDownload(selected);
        try {
            setIsDownload(true);
            let title = "liste_des_absences_etudiant";
            if (lang !== 'fr') {
                title = "abscences_teacher_list";
            }
            const departement = section && departements.find(dep => dep._id && dep._id.toString() === section.departement.toString());
            if (selected === 'PDF') {
                
                if (section && cycle && niveau && departement) {
                    await generateListAbsenceEtudiant({ annee: selectedYear, semestre: selectSemestre, departement: departement, section: section, cycle: cycle, niveau: niveau, langue: lang, fileType:'pdf' }).then((blob) => {
                        // Créer un objet URL pour le blob PDF
                        if (blob) {
                            createPDF(blob, title);
                        }
                    })
                }

            } else {
                if (section && cycle && niveau && departement) {
                    await generateListAbsenceEtudiant({ annee: selectedYear, semestre: selectSemestre, departement: departement, section: section, cycle: cycle, niveau: niveau, langue: lang, fileType:'xlsx' }).then((blob) => {
                        // Créer un objet URL pour le blob PDF
                        if (blob) {
                            createPDF(blob, title, 'xlsx');
                        }
                    })
                }
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        } finally {
            setIsDownload(false);
        }
    };

   
    useEffect(() => {
        if (!selectSectionId) {
            if (sections && sections.length > 0) {
                filterCycleBySection(sections[0]._id);
            }
        } else {
            setFilteredCycle([]);
            filterCycleBySection(selectSectionId);
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

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.etudiant')} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.etudiant')} </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<string>
                                title={t('label.annee')}
                                selectedItem={annee}
                                items={listAnnee}
                                defaultValue={annee}
                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
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
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={semestre}
                                items={semestres}
                                defaultValue={semestre}
                                onSelect={handleSemestreSelect}
                            />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">

                            <CustomDropDown2<string>
                                title={t('label.annee')}
                                selectedItem={annee}
                                items={listAnnee}
                                defaultValue={annee}
                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
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

                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={semestre}
                                items={semestres}
                                defaultValue={semestre}
                                onSelect={handleSemestreSelect}
                            />
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8 relative min-h-[250px]">
                    <table className="w-full table-auto">
                        {data.length === 0 && settingIsLoading ?
                            <NoDataTable />
                            : <HeaderTable />}

                        {
                            pageIsLoadingOnTable ?
                                <LoadingOnTable /> :
                                <BodyTable data={filteredData} onEdit={onEdit}/>

                        }
                    </table>
                </div>

                {/* Pagination */}

                {(searchText === '' && filteredData && filteredData.length>0) && <Pagination
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
                {isDownload ? <Download /> : <CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}
            </div>

        </div>
    );
};


export default Table;