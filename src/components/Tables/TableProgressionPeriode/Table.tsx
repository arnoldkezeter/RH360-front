import { useDispatch, useSelector } from "react-redux";
import LoadingTable from "../common/LoadingTable";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import createToast from "../../../hooks/toastify";
import { createPDF, extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";
import { generateProgressionPeriodeEnseignement, getPeriodesEnseignement } from "../../../api/api_periode_enseignement";
import { setErrorPagePeriodeEnseignement, setPeriodeEnseignementLoading, setPeriodeEnseignements } from "../../../_redux/features/progession_periode_slice";
import Download from "../common/Download";

interface TablePeriodeEnseignementProps {
    data: PeriodeEnseignementType;
    periodes:PeriodeEnseignementType[];
}

const Table = ({ data, periodes }: TablePeriodeEnseignementProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const departements = useSelector((state: RootState) => state.dataSetting.dataSetting.departementsAcademique) ?? [];
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const pageIsLoading = useSelector((state: RootState) => state.progressionPeriodeEnseignementSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [periode, setPeriode] = useState<PeriodeEnseignementType>();
    const [filteredPeriode, setFilteredPeriode] = useState<PeriodeEnseignementType | undefined>(data);
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemester);

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
                setCycle(cycles.find(cycle=>cycle._id ===result[0]._id))
                filterNiveauxByCycle(cycle?._id)
            }else{
                setSelectIdCycle(undefined);
                setCycle(undefined);
                filterNiveauxByCycle(undefined);
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

    const handleDownloadSelect = async (selected: string) => {
        try{
            setIsDownload(true);

            let title = "progression_par_periode";
            if(lang !== 'fr'){
                title = "periodes_progression";
            }
            const departement=section && departements.find(dep=>dep._id && dep._id.toString()===section.departement.toString());
            if(selected === 'PDF'){
                
                if(section && cycle && niveau && departement){
                    if(filteredPeriode){
                        await generateProgressionPeriodeEnseignement({ periode: filteredPeriode, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, annee:selectedYear, semestre:selectedSemestre, fileType:'pdf'}).then((blob)=>{
                            // Créer un objet URL pour le blob PDF
                            if(blob){
                                createPDF(blob, title);
                            }
                        })
                    }
                    
                }
                
            }else{
                if(section && cycle && niveau && departement){
                    if(filteredPeriode){
                        await generateProgressionPeriodeEnseignement({ periode: filteredPeriode, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, annee:selectedYear, semestre:selectedSemestre, fileType:'xlsx'}).then((blob)=>{
                            // Créer un objet URL pour le blob PDF
                            if(blob){
                                createPDF(blob, title, 'xlsx');
                            }
                        })
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

    // recuperer l'id de la section suite au click sur l'input select
    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (selected?._id) {
            setSelectIdSection(selected._id);
            filterCycleBySection(selected._id);
            setSection(selected);
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

    const handlePeriodeSelect = (selected: PeriodeEnseignementType | undefined) => {
        setFilteredPeriode(selected);
        setPeriode(selected)
    };
     
    //fournir initialement les données à la page
    // Effet pour filtrer les options des CustomDropDown
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
    }, [filteredCycle]);
    // Effet pour récupérer les événements initiaux lorsque le composant est monté ou lorsque la page change
    useEffect(() => {
        const fetchPeriodeEnseignements = async () => {
            dispatch(setPeriodeEnseignementLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyPeriodes : ProgressionPeriodeEnseignementReturnGetType = {
                    periodes: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                } ;
                if (selectNiveauId) {
                    const fetchedPeriodeEnseignements = await getPeriodesEnseignement({ niveauId: selectNiveauId, annee:selectedYear, semestre:selectedSemestre });
                    if (fetchedPeriodeEnseignements) { // Vérifiez si fetchedPeriodeEnseignements n'est pas faux, vide ou indéfini
                        dispatch(setPeriodeEnseignements(fetchedPeriodeEnseignements));
                       
                    } else {
                        dispatch(setPeriodeEnseignements(emptyPeriodes));
                    }
                }else{
                    dispatch(setPeriodeEnseignements(emptyPeriodes));
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPagePeriodeEnseignement(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setPeriodeEnseignementLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    
        fetchPeriodeEnseignements();
    }, [dispatch, selectedYear, selectedSemestre, selectNiveauId, t]);
    useEffect(() => {
        if (periodes && periodes.length > 0) {
            
            // Sélectionner la première matière et mettre à jour les états nécessaires
            setFilteredPeriode(periodes[0]);
            setPeriode(periodes[0]);
            // setProgress(calculateProgress(matieres[0]));
        }else{
            setFilteredPeriode(undefined);
            // setProgress(0);
        }
    }, [periodes]);

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    // const [filteredData, setFilteredData] = useState<PeriodeEnseignementType[]>(data); 

    return (
        <div>

            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.periodes_enseignement')} </h1>
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
                                items={[1, 2, 3]}
                                defaultValue={currentSemester} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            <CustomDropDown2<PeriodeEnseignementType>
                                title={t('label.periode')}
                                selectedItem={periode}
                                items={periodes}
                                defaultValue={periodes[0]} // ou spécifie une valeur par défaut
                                displayProperty={(periode: PeriodeEnseignementType) => `${lang === 'fr' ? periode.periodeFr : periode.periodeEn}`}
                                onSelect={handlePeriodeSelect}
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
                                items={[1, 2, 3]}
                                defaultValue={currentSemester} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />

                            <CustomDropDown2<PeriodeEnseignementType>
                                title={t('label.periode')}
                                selectedItem={periode}
                                items={periodes}
                                defaultValue={periodes[0]} // ou spécifie une valeur par défaut
                                displayProperty={(periode: PeriodeEnseignementType) => `${lang === 'fr' ? periode.periodeFr : periode.periodeEn}`}
                                onSelect={handlePeriodeSelect}
                            />
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {
                            pageIsLoading ?
                                <LoadingTable />:
                                // : !data.chapitres?
                                //     <NoDataTable/> :
                                    <HeaderTable />
                        }
                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredPeriode} />
                        }
                    </table>
                </div>

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}

            </div>

        </div>
    );
};


export default Table;