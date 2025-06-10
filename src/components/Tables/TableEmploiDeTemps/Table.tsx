import { useDispatch, useSelector } from "react-redux";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import { jours } from "../../../pages/CommonPage/EmploiDeTemp";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import { setShowModalElement, setShowModalPresence, setShowModalSignalerAbsence } from "../../../_redux/features/setting";
import ButtonCreate from "../common/ButtonCreate";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { createPDF, extractYear, formatYear, generateYearRange, premierElement } from "../../../fonctions/fonction";
import { setPeriodeLoading, setPeriodes, setErrorPagePeriode } from "../../../_redux/features/periode_slice";
import { generateEmploisDuTemps, getPeriodesByNiveau } from "../../../api/api_periode";
import createToast from "../../../hooks/toastify";
import Download from "../common/Download";


interface TablePeriodeProps {
    data: PeriodeType[];
    onCreate:()=>void;
    onEdit: (periode : PeriodeType) => void;
}

const Table = ({ data, onCreate, onEdit }: TablePeriodeProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.periodeSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    const dispatch = useDispatch();
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const typesEnseignement=useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement); 
    const sallesCours=useSelector((state: RootState) => state.dataSetting.dataSetting.sallesDeCours); 
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou 
    const index = useSelector((state: RootState) => state.setting.periodeIndex); // index courant à modifier
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const userNiveaux = useSelector((state: RootState) => state.user.niveaux);
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageSchedulePermission = userPermissions.includes('gerer_emplois_du_temps');

    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const ouvrirFormulairePeriode = (periode?: PeriodeType) => {
        if(periode){
            
            onEdit(periode);
        }else{
            onCreate();
        }
        if(hasManageSchedulePermission){
            dispatch(setShowModalElement());
        }else{
            // if(periode && periode.enseignantsPrincipaux){
            //     const enseignantsPrincipaux = periode?.enseignantsPrincipaux || [];
            //     const enseignantsSuppleants = periode?.enseignantsSuppleants || [];
            //     const existEnsP = enseignantsPrincipaux.find(ens=>ens._id === currentUser._id)
            //     const existEnsS = enseignantsSuppleants.find(ens=>ens._id === currentUser._id)
            //     if(userRole===roles.enseignant && (existEnsP || existEnsS)){
            //         dispatch(setShowModalPresence());
            //     }

            //     if(userRole===roles.etudiant || userRole===roles.delegue){
            //         dispatch(setShowModalSignalerAbsence());   
            //     }
                
            // }

            if (periode && periode.enseignements && periode.enseignements.length>0) {
                // Parcours des matières de la période
                const enseignements = periode.enseignements || [];
                
                // Recherche si l'enseignant est principal ou suppléant dans l'une des matières
                const existEnsP = enseignements.some(e => e.enseignantPrincipal._id === currentUser._id);
                const existEnsS = enseignements.some(e => e.enseignantSuppleant?._id === currentUser._id);
            
                // Si l'utilisateur est un enseignant et existe dans les enseignants principaux ou suppléants
                if (userRole === roles.enseignant && (existEnsP || existEnsS)) {
                    dispatch(setShowModalPresence());
                }
            
                // Si l'utilisateur est un étudiant ou un délégué
                if (userRole === roles.etudiant || userRole === roles.delegue) {
                    dispatch(setShowModalPresence());
                }
            }
            
        }
        
        
    };
    

    useEffect(() => {
        const table = document.getElementById('myTable') as HTMLTableElement;
        // Trie des évènements par date de début la plus récente
        const sortedPeriodes = [...data].sort((a, b) => {
            const heureDebutA = convertirHeureVersMinutes(a.heureDebut);
            const heureDebutB = convertirHeureVersMinutes(b.heureDebut);
            return heureDebutA - heureDebutB;
        });
    
        if (table) {
            table.innerHTML = '';
            const groupedPeriodes: { [key: string]: PeriodeType[] } = {};
    
            // Les évènements de la même période de cours sont groupés entre eux
            sortedPeriodes.forEach((periode) => {
                const horaire = `${periode.heureDebut} - ${periode.heureFin}`;
                if (!groupedPeriodes[horaire]) {
                    groupedPeriodes[horaire] = [];
                }
                groupedPeriodes[horaire].push(periode);
            });
    
            Object.entries(groupedPeriodes).forEach(([horaire, periodes], index) => {
                const row = table.insertRow();
    
                const classNames = index % 2 === 0 ?
                    "border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black" :
                    "border-b border-[#eee] py-0 px-0 dark:border-strokedark";
                row.className = classNames;
                const horaireCell = row.insertCell();
                horaireCell.textContent = horaire;
                horaireCell.style.width = '90px';
    
                jours.forEach((jour) => {
                    const jourCell = row.insertCell();
                    const coursJour = periodes.find((cours) => cours.jour == jour.ordre);
    
                    jourCell.style.textAlign = 'center';
                    jourCell.onmouseover = () => {
                        jourCell.style.backgroundColor = '#afeeee';
                    };
                    jourCell.onmouseout = () => {
                        jourCell.style.backgroundColor = '';
                    };
    
                    if (coursJour) {
                        // Itération sur les matières
                        const matieresLibelle = coursJour.enseignements && coursJour.enseignements.length > 0
                            ? coursJour.enseignements.map(e => lang === 'fr' ? e.matiere.libelleFr : e.matiere.libelleEn).join('/ ')
                            : '';
    
                        // Itération sur les enseignants principaux et suppléants
                        const enseignantsLibelle = coursJour.enseignements && coursJour.enseignements.length > 0
                            ? coursJour.enseignements.map(e => {
                                const enseignantPrincipal = e.enseignantPrincipal;
                                const enseignantSuppleant = e.enseignantSuppleant;
                                const principalLibelle = `${premierElement(enseignantPrincipal.nom)} ${enseignantPrincipal.prenom ? premierElement(enseignantPrincipal.prenom) : ""}`;
                                const suppléantLibelle = enseignantSuppleant ? `${premierElement(enseignantSuppleant.nom)} ${enseignantSuppleant.prenom ? premierElement(enseignantSuppleant.prenom) : ""}` : "-";
                                return `${principalLibelle}/${suppléantLibelle}`;
                            }).join(', ')
                            : "-";
    
                        // Itération sur les salles de cours
                        
                        const sallesLibelle = coursJour.enseignements && coursJour.enseignements.length > 0 
                            ? [...new Set(coursJour.enseignements.map(e => sallesCours?.find(sc => sc._id === e.salleCours)?.[lang === 'fr' ? 'libelleFr' : 'libelleEn'] || ''))]
                            .filter(libelle => libelle) // Filtrer les valeurs vides ou nulles
                                .join('/ ')
                            : '';
                        jourCell.textContent = t('label.pause');
    
                        if (!coursJour.pause) {
                            jourCell.textContent = `
                                ${matieresLibelle} - 
                                ${enseignantsLibelle} - 
                                ${sallesLibelle}`;
                        }
    
                        // Gestion de l'édition du cours
                        jourCell.onclick = () => ouvrirFormulairePeriode(coursJour);
                        jourCell.style.cursor = 'pointer';
                        jourCell.style.width = '100px';
                    } else {
                        const heureDebut = horaire.split("-")[0].trim();
                        const heureFin = horaire.split("-")[1].trim();
                        if (selectNiveauId) {
                            const periode: PeriodeType = {
                                pause: false,
                                jour: jour.ordre,
                                semestre: selectedSemestre,
                                annee: selectedYear,
                                niveau: selectNiveauId,
                                heureDebut: heureDebut,
                                heureFin: heureFin,
                                enseignements: [],  // Assurez-vous d'inclure la structure correcte
                            };
                            jourCell.onclick = () => ouvrirFormulairePeriode(periode);
                            jourCell.style.cursor = 'pointer';
                            jourCell.style.width = '100px';
                        }
                    }
                });
            });
        }
    }, [data]);
    

    function convertirHeureVersMinutes(heure: string): number {
        const [heures, minutes] = heure.split(':').map(Number);
        return heures * 60 + minutes;
    }

    const [showAddRowButton, setShowAddRowButton] = useState(false);

    const handleCellMouseEnter = () => {
        setShowAddRowButton(true);
    };

    const handleCellMouseLeave = () => {
        setShowAddRowButton(false);
    };

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemester);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
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
    

    
    const [formatToDownload, setFormatToDownload] = useState("");
    const handleDownloadSelect = async (selected: string) => {
        setFormatToDownload(selected);
        
        try{
            setIsDownload(true);
            let title = "emploie_de_temps"+formatYear(selectedYear)+"_semestre_"+selectedSemestre;
            if(lang !== 'fr'){
                title = "timetable"+formatYear(selectedYear)+"_semester_"+selectedSemestre;;
            }
            if(selected === 'PDF'){
                if(section && cycle && niveau){
                    await generateEmploisDuTemps({section : section, cycle:cycle, niveau:niveau, langue:lang, annee: selectedYear, semestre: selectedSemestre, fileType:'pdf' }).then((blob)=>{
                        // Créer un objet URL pour le blob PDF
                        if(blob){
                            createPDF(blob, title);
                        }
                    })
                }
                
            }else{
                // exportToExcel(title+'.xlsx')
                if(section && cycle && niveau){
                    await generateEmploisDuTemps({section : section, cycle:cycle, niveau:niveau, langue:lang, annee: selectedYear, semestre: selectedSemestre, fileType:'xlsx' }).then((blob)=>{
                        // Créer un objet URL pour le blob PDF
                        if(blob){
                            createPDF(blob, title, 'xlsx');
                        }
                    })
                }
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }
    };
    

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

   
    const filterNiveauxForUser = () => {
        const filteredNiveaux = niveaux.filter(niveau => {
            for (const prop in userNiveaux) {
                if (userNiveaux.hasOwnProperty(prop)) {
                    if (userNiveaux[prop].niveau === niveau._id) {
                        return true;
                    }
                }
            }
            return false;
        });
    };
    
    
    useEffect(() => {
        filterNiveauxForUser();
        if (filteredCycle && filteredCycle.length > 0) {
            if(!selectCycleId){
                filterNiveauxByCycle(filteredCycle[0]?._id);
            }else{
                filterNiveauxByCycle(selectCycleId);
            }
                
        }   
        if (roles.delegue === currentUser.role || roles.etudiant === currentUser.role) {
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux.find(niveau => niveau.annee === selectedYear)?.niveau);
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
        const fetchPeriodes = async () => {
            dispatch(setPeriodeLoading(true));
            try {
                
                const periodes:PeriodeReturnGetType={
                    periodes: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                };
                
                if (selectNiveauId) {
                    const fetchedPeriodes = await getPeriodesByNiveau({ niveauId: selectNiveauId, annee: selectedYear, semestre: selectedSemestre });
                    dispatch(setPeriodes(fetchedPeriodes));
                }else{
                    dispatch(setPeriodes(periodes)); 
                }
                dispatch(setErrorPagePeriode(null));
            } catch (error) {
                dispatch(setErrorPagePeriode(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setPeriodeLoading(false));
            }
        };

        fetchPeriodes();
    }, [dispatch, selectedYear, selectedSemestre, selectNiveauId, t]);
    

    return (
        <div>
            {hasManageSchedulePermission && <div className="flex justify-after items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.periode_cours')}
                    onClick={() => { onCreate();dispatch(setShowModalElement()) }}
                />
            </div>}

            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.emploie_temps')}</h1>
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
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />

                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2, 3]}
                                defaultValue={currentSemester} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
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
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />

                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2, 3]}
                                defaultValue={currentSemester} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
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
                                : data.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <tbody id="myTable"></tbody>
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