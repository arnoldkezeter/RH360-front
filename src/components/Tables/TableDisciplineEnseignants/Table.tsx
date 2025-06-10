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
import { setAnneeDisciplineEns, setEnseignantDiscipline, setEnseignantsDisciplineLoadingOnTable, setErrorPageEnseignantDiscipline, setSemestreDisciplineEns } from "../../../_redux/features/absence/discipline_enseignant_slice";
import { apiGetAbsencesWithEnseignantsByFilter, apiSearchUserDiscipline, generateListAbsenceEnseignant } from "../../../services/discipline/api_discipline";
import LoadingOnTable from "../common/LoadingOnTable";
import createToast from "../../../hooks/toastify";
import Download from "../common/Download";
import { semestres } from "../../../pages/CommonPage/EmploiDeTemp";

interface TableDisciplineProps {
    data: UserDiscipline[];
    onEdit: (enseignant: UserDiscipline) => void;
}


const Table = ({ data, onEdit }: TableDisciplineProps) => {


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
    const selectedSemestre = useSelector((state: RootState) => state.enseignantDisciplineSlice.selected.semestre)
    const [selectSemestre, setSelectSemestre]=useState(currentSemestre);
    const [selectedYear, setSelectYear]=useState(currentYear);
    

    const listAnnee = generateYearRange(currentYear, firstYear);

    const [annee, setAnnee] = useState<string | undefined>(`${firstYear}/${firstYear + 1}`);
    const [semestre, setSemestre] = useState<number | undefined>(selectedSemestre ? selectedSemestre : currentSemestre);
    

    const handleAnneeSelect = (selected: string | undefined) => {
        if (selected) {
            setAnnee(selected);
            setSelectYear(extractYear(selected));
            dispatch(setAnneeDisciplineEns(parseInt(selected)));
            setSearchText('');
        }
        // setFonction(selected);
        // dispatch(setSelectedEnseignant({ key: "fonction", value: selected }))

    };

    const handleSemestreSelect = (selected: number | undefined) => {
        if (selected) {
            setSelectSemestre(selected)
            setSemestre(selected);
            dispatch(setSemestreDisciplineEns(selected));
            setSearchText('');
        }

    };



    // recherche
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UserDiscipline[]>(data);

    const latestQueryDiscipline = useRef('');
   
    useEffect(() => {
        
        dispatch(setEnseignantsDisciplineLoadingOnTable(true));
        latestQueryDiscipline.current = searchText;
        try{
            
            const filterDisciplineByContent = async () => {
                if (searchText === '') {
                    const result: UserDiscipline[] = data;
                    setFilteredData(result); 
                }else{
                    let disciplinesResult : UserDiscipline[] = [];
                    await apiSearchUserDiscipline({annee:selectedYear, semestre:selectSemestre, searchText:searchText}).then(result=>{
                        if (latestQueryDiscipline.current === searchText) {
                            if(result){
                                disciplinesResult = result.enseignants;
                                setFilteredData(disciplinesResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            filterDisciplineByContent();
        }catch(e){
            dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
        }finally{
            if (latestQueryDiscipline.current === searchText) {
                dispatch(setEnseignantsDisciplineLoadingOnTable(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);
    



    const [isInitialMount, setIsInitialMount] = useState(true);
    const pageIsLoadingOnTable = useSelector((state: RootState) => state.enseignantDisciplineSlice.pageIsLoadingOnTable);
    const [isDownload, setIsDownload]=useState(false);



    // start pagination

    const itemsPerPage =  useSelector((state: RootState) => state.enseignantDisciplineSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.enseignantDisciplineSlice.data.totalItems);
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
        if (annee && semestre) {
            dispatch(setAnneeDisciplineEns(currentYear));
            dispatch(setSemestreDisciplineEns(semestre));
        }

        const fetchEnseignantWithAbsences = async () => {
            dispatch(setEnseignantsDisciplineLoadingOnTable(true));

            try {
                // if (selectSemestre) {
                    const fetchedEnseignants = await apiGetAbsencesWithEnseignantsByFilter({
                        page: currentPage, semestre: selectSemestre, annee: selectedYear
                    });
                    if (fetchedEnseignants) {
                        dispatch(setEnseignantDiscipline(fetchedEnseignants));

                        dispatch(setErrorPageEnseignantDiscipline(null));
                    } else {
                        dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
                    }
                // }
            } catch (error) {
                dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
            } finally {
                dispatch(setEnseignantsDisciplineLoadingOnTable(false));
            }
        }

        fetchEnseignantWithAbsences();

    }, [dispatch, selectedYear, selectSemestre, currentPage, t]);


    const lang:string = useSelector((state: RootState) => state.setting.language); // fr ou en
    const handleDownloadSelect = async (selected: string) => {
        // setFormatToDownload(selected);
            try{
                setIsDownload(true);
                let title = "liste_des_absences_enseignant";
                if (lang !== 'fr') {
                    title = "abscences_teacher_list";
                }
                if(selected === 'PDF'){
                    await generateListAbsenceEnseignant({ langue:lang, annee:selectedYear, semestre:selectSemestre, fileType:'pdf'}).then((blob)=>{
                        // Créer un objet URL pour le blob PDF
                        if(blob){
                            createPDF(blob, title);
                        }
                    })
                    
                }else{
                    await generateListAbsenceEnseignant({ langue:lang, annee:selectedYear, semestre:selectSemestre, fileType:'xlsx'}).then((blob)=>{
                        // Créer un objet URL pour le blob PDF
                        if(blob){
                            createPDF(blob, title, 'xlsx');
                        }
                    })  
                }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }

    };

   
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.enseignant')} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.enseignant')} </h1>
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
                        <HeaderTable />

                        {
                            pageIsLoadingOnTable ?
                                <LoadingOnTable /> :
                                <BodyTable data={filteredData} onEdit={onEdit}/>

                        }
                    </table>
                </div>

                {/* Pagination */}

                {(searchText ==='' && filteredData && filteredData.length>0) && <Pagination
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