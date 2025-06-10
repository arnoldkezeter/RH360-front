import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { setChapitreLoading, setChapitres, setErrorPageChapitre } from "../../../_redux/features/chapitre_slice";
import { apiSearchChapitre, getChapitreByMatiereWithPagination } from "../../../api/api_chapitre";
import createToast from "../../../hooks/toastify";
import { extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";
import { FaFilter, FaSort } from "react-icons/fa";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import Pagination from "../../Pagination/Pagination";
import { config } from "../../../config";

interface TableChapitreProps {
    data: ChapitreType[];
    onCreate:()=>void;
    onEdit: (chapitre:ChapitreType) => void;
}


const Table = ({ data, onCreate, onEdit}: TableChapitreProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.chapitreSlice.pageIsLoading);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number | undefined>(currentSemestre);

    const dispatch = useDispatch();

    
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
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
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);

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
                if(selectedMatiere && selectedMatiere._id && selectedSemestre){
                    const fetchedChapitres = await getChapitreByMatiereWithPagination({ matiereId: selectedMatiere._id, page: currentPage, annee: selectedYear, semestre: selectedSemestre, langue:lang });
                        
                    if (fetchedChapitres) { // Vérifiez si fetchedChapitres n'est pas faux, vide ou indéfini
                        dispatch(setChapitres(fetchedChapitres));
                    } else {
                        dispatch(setChapitres(emptyChapitres));
                    }
                }else {
                    dispatch(setChapitres(emptyChapitres));
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
    }, [dispatch, selectedMatiere, selectedYear, selectedSemestre, currentPage, t]); // Déclencher l'effet lorsque currentPage change
    const [filteredData, setFilteredData] = useState<ChapitreType[]>(data);
    // Filtrer les matières en fonction de la langue
    const filterChapitreByContent = (chapitres: ChapitreType[] | undefined) => {
        if(chapitres){
            if (searchText === '') {
                const result: ChapitreType[] = chapitres;
                return result;
            }
            return chapitres.filter(chapitre => {
                const libelle = lang === 'fr' ? chapitre.libelleFr : chapitre.libelleEn;
                // Vérifie si le code ou le libellé contient le texte de recherche
                return chapitre.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
            });
        }
       return [];
    };
    // const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
    // useEffect(() => {
    //     console.log(matieres)
    //     const mat = matieres.find(m=>m._id===matiere?._id);
    //     if(mat && onEditMatiere){
    //         onEditMatiere(mat)
    //     }
    //     setFilteredData(mat?.chapitres);
    // },[matieres]);

    // useEffect(() => {
    //     const result = filterChapitreByContent(data);
    //     setFilteredData(result);
    // }, [searchText, data]);
    useEffect(() => {
        if(searchText!==''){
             setIsSearch(true);
        }else{
             setIsSearch(false);
        }
     }, [searchText]);

    const latestQueryChapitre = useRef('');
    useEffect(() => {
        dispatch(setChapitreLoading(true));
        latestQueryChapitre.current = searchText;
        try{
            
            const filterChapitreByContent = async () => {
                if (searchText === '') {
                    if(isSearch){
                        setSelectedSemestre(currentSemestre);
                    }
                    const result: ChapitreType[] = data;
                    setFilteredData(result); 
                }else{
                    setSelectedSemestre(undefined);
                    let chapitresResult : ChapitreType[] = [];
                    if(selectedMatiere && selectedMatiere._id){
                        await apiSearchChapitre({ searchString:searchText, limit:10, langue:lang, matiereId:selectedMatiere?._id, annee:selectedYear }).then(result=>{
                            if (latestQueryChapitre.current === searchText) {
                                if(result){
                                    chapitresResult = result.chapitres;
                                    setFilteredData(chapitresResult);
                                }
                            }
                            
                        })
                    }else{
                        setSelectedSemestre(currentSemestre);
                        const result: ChapitreType[] = data;
                        setFilteredData(result); 
                    }
                }
        
                
            };
            filterChapitreByContent();
        }catch(e){
            dispatch(setErrorPageChapitre(t('message.erreur')));
        }finally{
            if (latestQueryChapitre.current === searchText) {
                dispatch(setChapitreLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);


    const handleAnneeSelect = (selected: String | undefined) => {
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
            setSearchText('')
        }
    };

    const handleSemestreSelect = (selected: number | undefined) => {
        if(selected){
            setSelectedSemestre(selected);
            setSearchText('');
        }
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole) && <ButtonCreate
                    title={t('boutton.nouveau_chapitre')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.chapitre'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
                {selectedMatiere && (<div>
                    {lang === 'fr' ? selectedMatiere.libelleFr : selectedMatiere.libelleEn}
                </div>)}
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.chapitre')} </h1>
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

                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2, 3]}
                                defaultValue={1} // ou spécifie une valeur par défaut
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
                                defaultValue={formatYear(selectedYear)} // ou spécifie une valeur par défaut
                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2, 3]}
                                defaultValue={selectedSemestre} // ou spécifie une valeur par défaut
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
                                : filteredData?.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable matiere={selectedMatiere}/>
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit}/>
                        }




                    </table>
                </div>

                {/* Pagination */}

                { searchText==='' && filteredData && filteredData.length>0 && <Pagination
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
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;