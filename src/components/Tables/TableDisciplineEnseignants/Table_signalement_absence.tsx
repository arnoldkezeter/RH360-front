import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { extractYear, generateYearRange, nbTotalAbsences } from "../../../fonctions/fonction";
import { setAnneeDisciplineEns, setSemestreDisciplineEns } from "../../../_redux/features/absence/discipline_enseignant_slice";
import { apiGetAllAbsencesWithEnseignantsByFilter } from "../../../services/discipline/api_discipline";
import LoadingOnTable from "../common/LoadingOnTable";
import { setErrorPageEtudiant, setEtudiantsLoading } from "../../../_redux/features/etudiant_slice";
import createToast from "../../../hooks/toastify";
import HeaderTableSignalementAbsence from "./HeaderSignalemetAbsence";
import BodyTableSignalementAbsence from "./BodyTableSignalementAbsence";



const TableSignalementAbsence = ({ type, listData }: { type: string, listData: SignalementAbsence[] }) => {

    // var listData: SignalementAbsence[] = [];

    // if (type === "enseignant") {
    //     listData = useSelector((state: RootState) => state.signalementAbsence.data);
    // } else {
    //     listData = useSelector((state: RootState) => state.signalementAbsence.data);
    // }

    const { t } = useTranslation();
    const dispatch = useDispatch();



    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };



    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const selectedSemestre = useSelector((state: RootState) => state.enseignantDisciplineSlice.selected.semestre)
    const [selectSemestre, setSelectSemestre] = useState(currentSemestre);
    const [selectedYear, setSelectYear] = useState(currentYear);


    const listSemestre = ['1', '2']
    const listAnnee = generateYearRange(currentYear, firstYear);

    const [annee, setAnnee] = useState<string | undefined>(`${firstYear}/${firstYear + 1}`);
    const [semestre, setSemestre] = useState<string | undefined>(selectedSemestre ? selectedSemestre.toString() : currentSemestre.toString());

    const handleAnneeSelect = (selected: string | undefined) => {
        if (selected) {
            setAnnee(selected);
            setSelectYear(extractYear(selected));
            dispatch(setAnneeDisciplineEns(parseInt(selected)))
        }
        // setFonction(selected);
        // dispatch(setSelectedEnseignant({ key: "fonction", value: selected }))

    };

    const handleSemestreSelect = (selected: string | undefined) => {
        if (selected) {
            setSelectSemestre(parseInt(selected))
            setSemestre(selected);
            dispatch(setSemestreDisciplineEns(parseInt(selected)));
        }

    };



    // recherche
    // const [searchText, setSearchText] = useState<string>('');
    // const [filteredData, setFilteredData] = useState<UserDiscipline[]>(data);

    // // Filtrer les matières en fonction de la langue
    // const filterEnseignantByContent = (enseignants: UserDiscipline[]) => {
    //     if (searchText === '') {
    //         const result: UserDiscipline[] = enseignants;
    //         return result;
    //     }
    //     return enseignants.filter(enseignant => {
    //         const prenom = enseignant?.prenom || "";
    //         // Vérifie si le code ou le libellé contient le texte de recherche
    //         return enseignant.nom.toLowerCase().includes(searchText.toLowerCase()) || prenom.toLowerCase().includes(searchText.toLowerCase());
    //     });
    // };

    // useEffect(() => {
    //     const result = filterEnseignantByContent(data);
    //     setFilteredData(result);
    // }, [searchText, data]);



    const [isInitialMount, setIsInitialMount] = useState(true);
    const pageIsLoadingOnTable = useSelector((state: RootState) => state.enseignantDisciplineSlice.pageIsLoadingOnTable);



    // start pagination
    const count: number = useSelector((state: RootState) => state.enseignantDisciplineSlice.data.totalItems);
    const itemsPerPage = useSelector((state: RootState) => state.enseignantDisciplineSlice.data.pageSize); // nombre delements maximum par page

    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);

    const startItem = currentPage === Math.ceil(count / itemsPerPage) ? count - itemsPerPage + 1 : indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);
    // Render page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber: number) => { setCurrentPage(pageNumber); };
    // end --------- pagination

    // useEffect(() => {
    //     if (annee && semestre) {
    //         dispatch(setAnneeDisciplineEns(currentYear));
    //         dispatch(setSemestreDisciplineEns(parseInt(semestre)));
    //     }



    //     if (isInitialMount) {
    //         setIsInitialMount(false);
    //         return;
    //     }


    //     const fetchEnseignantWithAbsences = async () => {
    //         dispatch(setEnseignantsDisciplineLoadingOnTable(true));

    //         try {
    //             if (semestre) {
    //                 const fetchedEnseignants = await apiGetAbsencesWithEnseignantsByFilter({
    //                     page: currentPage, semestre: selectSemestre, annee: selectedYear
    //                 });
    //                 if (fetchedEnseignants) {
    //                     dispatch(setEnseignantDiscipline(fetchedEnseignants));

    //                     dispatch(setErrorPageEnseignantDiscipline(null));
    //                 } else {
    //                     dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
    //                 }
    //             }
    //         } catch (error) {
    //             dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
    //         } finally {
    //             dispatch(setEnseignantsDisciplineLoadingOnTable(false));
    //         }
    //     }

    //     fetchEnseignantWithAbsences();

    // }, [data.length, annee, semestre, currentPage, t]);

    const fetchAllAbsEnseignant = async () => {
        try {


            const fetchedEnseignants = await apiGetAllAbsencesWithEnseignantsByFilter({ annee: selectedYear, semestre: selectSemestre });
            return fetchedEnseignants.enseignants;

            // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageEtudiant(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEtudiantsLoading(false)); // Définissez le loading à false après le chargement
        }
    }

    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const handleDownloadSelect = async (selected: string) => {
        // setFormatToDownload(selected);
        const mats = await fetchAllAbsEnseignant().then((absences) => {
            let title = "liste_des_absences_enseignant";
            if (lang !== 'fr') {
                title = "abscences_teacher_list";
            }
            if (selected === 'PDF') {

            } else if (selected === 'CSV') {

            } else {
            }
        })

    };

    
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {/* <InputSearch hintText={t('recherche.rechercher') + t('recherche.enseignant')} onSubmit={(text) => setSearchText(text)} /> */}
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2">
                    <div className=""> </div>{type === "enseignant" ? t('liste.signalement_absence_enseignants') : t('liste.signalement_absence_etudiants')}
                </h1>






                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8 relative min-h-[250px]">
                    <table className="w-full table-auto">
                        <HeaderTableSignalementAbsence />

                        {
                            pageIsLoadingOnTable ?
                                <LoadingOnTable /> :
                                <BodyTableSignalementAbsence data={listData} />

                        }
                    </table>
                </div>

                {/* Pagination */}

                {/* <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}
                /> */}
            </div>



        </div>
    );
};


export default TableSignalementAbsence;