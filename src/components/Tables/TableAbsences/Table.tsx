import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { calculAbsence, extractYear, formatYear, generateYearRange, nbTotalAbsences, nbTotalAbsencesJustifier, nbTotalAbsencesNonJustifier } from "../../../fonctions/fonction";
import { apiGetAbsencesByUserAndFilter } from "../../../services/discipline/api_discipline";
import { updateUserAbsences } from "../../../_redux/features/user_slice";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { MdDateRange, MdExpandLess, MdExpandMore, MdClose, MdDone } from "react-icons/md";



interface TableProps {
    data: UserState;
    absences:AbsenceType[];
    onEdit: (user: UserState | null) => void;
    handleAbsencesChange:(absences:AbsenceType[])=>void;

}

const Table = ({ data, absences, onEdit, handleAbsencesChange }: TableProps) => {
    const { t } = useTranslation();
    const [pageIsLoading, setPageIsLoading] = useState(false);
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemester);
    

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filtreSection, setFiltreSemestre] = useState("");
    const [formatToDownload, setFormatToDownload] = useState("");


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
    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };
    // const currentUser = useSelector((state: RootState) => state.user);
    useEffect(() => {
        
        const fetchData = async () => {
            setPageIsLoading(true);
            try {
                
                const abs = await apiGetAbsencesByUserAndFilter({ userId: data._id, annee: selectedYear, semestre: selectedSemestre });
                
                if(abs){
                    // console.log(absences)
                    handleAbsencesChange(abs);
                    
                    dispatch(updateUserAbsences(abs));
                }else{
                    handleAbsencesChange([]);
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }finally{
                setPageIsLoading(false);
            }
        };
        // if(data._id){
            fetchData();
        // }
        
    }, [dispatch, selectedSemestre, selectedYear, t]);


    // variable pour la pagination
    //
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data && data.absences.slice(indexOfFirstItem, indexOfLastItem);
    

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const lang = useSelector((state: RootState) => state.setting.language);
    const navigate = useNavigate();
    const [showAllDates, setShowAllDates] = useState<{ [monthYear: string]: boolean }>({});


    const groupAbsencesByMonthYear = () => {
        const groupedAbsences: { [monthYear: string]: { [date: string]: AbsenceType[] } } = {};

        absences.forEach((absence) => {
            const monthYear = format(new Date(absence.dateAbsence), lang === "fr" ? "MMMM yyyy" : "MMMM yyyy");
            const date = format(new Date(absence.dateAbsence), lang === "fr" ? "dd MMMM yyyy" : "dd MMMM yyyy");

            if (!groupedAbsences[monthYear]) {
                groupedAbsences[monthYear] = {};
            }
            if (!groupedAbsences[monthYear][date]) {
                groupedAbsences[monthYear][date] = [];
            }
            groupedAbsences[monthYear][date].push(absence);
        });

        return groupedAbsences;
    };


    const toggleDateGroup = (monthYear: string) => {
        setShowAllDates(prevState => ({
            ...prevState,
            [monthYear]: !prevState[monthYear]
        }));
    };

    // const handleDeleteClick = (absence: AbsenceType, isHourRemove: boolean) => {
    //     onEdit(absence, isHourRemove, false);
    // };

    // const handleJustifierClick = (absence: AbsenceType, isJustify:boolean) => {
    //     onEdit(absence, false, isJustify);
    // };

    const [absenceStates, setAbsenceStates] = useState<{ [absenceId: string]: boolean }>({});

    // Fonction pour déterminer l'état de chaque absence
    const determineAbsenceStates = () => {
        const states: { [absenceId: string]: boolean } = {};
        absences.forEach((absence) => {
            // Utilisez la valeur de la propriété 'etat' pour déterminer l'état de l'absence
            states[absence._id] = absence.etat === 1;
        });
        return states;
    };

    // Mettre à jour l'état initial des absences
    useEffect(() => {
        setAbsenceStates(determineAbsenceStates());
    }, [absences]);

    // Fonction pour changer l'état d'une absence
    const toggleAbsenceState = (absenceId: string) => {
        setAbsenceStates(prevStates => ({
            ...prevStates,
            [absenceId]: !prevStates[absenceId]
        }));
    };

    const renderAbsenceList = () => {
        const groupedAbsences = groupAbsencesByMonthYear();
        
        return Object.entries(groupedAbsences)
            .map(([monthYear, absencesByDate], index) => (
                <div key={index} >
                    <div className={`
                ${showAllDates[monthYear] && 'bg-primary text-white'}
                flex  items-center justify-start gap-x-1 mb-2 cursor-pointer  hover:bg-primary hover:text-white duration-300 p-2`} onClick={() => toggleDateGroup(monthYear)}>
                        <MdDateRange />
                        <h3 className="font-semibold">{monthYear}</h3>
                        {showAllDates[monthYear] ? <MdExpandLess /> : <MdExpandMore />}
                        <p className="pl-5">{nbTotalAbsences(Object.values(absencesByDate).flat())} H (Total) </p>
                        <p className="pl-5">{nbTotalAbsencesJustifier(Object.values(absencesByDate).flat())} H ({t('label.justifier')})  </p>
                        <p className="pl-5">{nbTotalAbsencesNonJustifier(Object.values(absencesByDate).flat())} H ({t('label.non_justifier')}) </p>
                    </div>

                    {showAllDates[monthYear] && Object.entries(absencesByDate).map(([date, absences], idx) => (
                        <div key={idx} className="flex">
                            <div className=" bg-primary w-0.5 rounded-full ml mr-8"></div>

                            <div className="flex flex-col w-full">
                                <div className={` 
                        ${showAllDates[date] && 'bg-form-strokedark text-white'}
                        flex px-5 items-center justify-start gap-x-1 mb-2 cursor-pointer hover:bg-form-strokedark hover:text-white  duration-300 p-2`} onClick={() => toggleDateGroup(date)}>
                                    <h3 className="font-semibold">{date}</h3>
                                    {showAllDates[date] ? <MdExpandLess /> : <MdExpandMore />}
                                    <p className="pl-5">{nbTotalAbsences(absences)} H (Total) </p>
                                    <p className="pl-5">{nbTotalAbsencesJustifier(absences)} H ({t('label.justifier')})</p>
                                    <p className="pl-5">{nbTotalAbsencesNonJustifier(absences)} H ({t('label.non_justifier')})</p>

                                </div>

                                {showAllDates[date] && absences.map((absence, i) => (
                                    <div className="flex  ml-0" key={i}>
                                        <div className=" bg-form-strokedark w-0.5 rounded-full  mr-2"></div>
                                        <div className="flex flex-col  lg:flex-row justify-start lg:justify-between items-start lg:items-center w-full hover:bg-[#1111] duration-300 px-4 rounded-sm py-3 lg:py-1 mb-1">
                                            <p>{`${absence.heureDebut} - ${absence.heureFin}`}</p>

                                            {/* <p >{nbTotalAbsences([absence])} {[absence].length > 1 ? t('menu.heure_d_absence') : t('menu.heures_d_absences')} </p> */}
                                            <p >{calculAbsence(absence)+" H"}</p>
                                            
                                            {absence?.dateCreation && (
                                                <p className="text-sm">
                                                    ({t('gestion_absence.ajouter_le')} : {lang === "fr" ?
                                                        new Date(absence?.dateCreation).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
                                                        : new Date(absence?.dateCreation).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} {t('gestion_absence.a')} {lang === "fr" ? `${new Date(absence?.dateCreation).getHours()}h${new Date(absence?.dateCreation).getMinutes()}` : new Date(absence?.dateCreation).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })})
                                                </p>
                                            )}

                                            {/* <button onClick={() => toggleAbsenceState(absence._id)}>
                                                {absenceStates[absence._id] ? "Justifiée" : "Non justifiée"}
                                            </button> */}
                                            
                                            <div className="flex">
                                            <label
                                                className={`mr-4 flex justify-center items-center hover:underline ${absence.etat == 0 ? 'text-red-500' : 'text-meta-3'}`}
                                            >
                                                {absence.etat === 0 ? <MdClose className="hover:underline grou" /> : <MdDone className="hover:underline grou"/>}
                                                {absence.etat === 0 ? t('label.non_justifier') : t('label.justifier')}
                                            </label>
                                                {/* <button
                                                    className="text-meta-1 flex justify-center items-center hover:underline"
                                                    onClick={() => handleDeleteClick(absence, true)}
                                                >
                                                    <MdDeleteForever className=" hover:underline grou" />
                                                    {t('Retirer')}
                                                </button> */}
                                                
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ));
    };

    return (
        <>
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-0 -mt-3 md:mt-0">
                <ButtonCreate
                     title={t('boutton.signaler_absence')}
                     isAbsence={true}
                     onClick={() => { data.role===config.roles.enseignant?navigate('/teacher/schedule'):navigate('/student/schedule') }}
                 />
                 <h5>{t('label.total_heure_absence')} : {nbTotalAbsences(absences)} {t('label.heure')}(s)</h5>
                 {/* <InputSearch hintText="Rechercher une matière" onSubmit={() => { }} /> */}
             </div>
             <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.absence')} </h1>
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
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2, 3]}
                                defaultValue={1} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} /> */}
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
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2, 3]}
                                defaultValue={1} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} /> */}

                        </div>
                    </div>
                </div>
                </div>

            {absences.length === 0 ? (
                <div className={`
            flex items-center justify-center
                my-0
                text-black bg-white
                dark:bg-boxdark dark:text-gray
                relative rounded-sm border border-stroke  py-24 px-5 shadow-default dark:border-strokedark  w-full`}
                >
                    <p>{t('gestion_absence.aucune_heure_d_absence_pendant_ce_semestre')}</p>
                </div>
            ) :

                <div className={`
            my-0
            text-black bg-white
            dark:bg-boxdark dark:text-gray
            relative rounded-sm border border-stroke pb-10  py-6 px-5 shadow-default dark:border-strokedark  w-full`}
                >
                    {/* <h1 className="font-semibold text-primary mb-8">{t('gestion_absence.liste_des_heures_d_absences_de_ce_semenstre')}</h1> */}
                    
                    {renderAbsenceList()}
                </div>
            }

        </>


    );
   
};


export default Table;