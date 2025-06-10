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
import { FaFilter, FaSort } from "react-icons/fa";
import { extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { setErrorPageObjectif, setObjectifLoading, setObjectifs } from "../../../_redux/features/objectif_slice";
import createToast from "../../../hooks/toastify";
import { apiSearchObjectif, getObjectifByMatiereWithPagination } from "../../../api/api_objectif";
import Pagination from "../../Pagination/Pagination";
import { config } from "../../../config";

interface TableObjectifProps {
    data: ObjectifType[];
    onCreate:()=>void;
    onEdit: (objectif:ObjectifType) => void;
}

const Table = ({ data, onCreate, onEdit}: TableObjectifProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.objectifSlice.pageIsLoading);
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number | undefined>(currentSemestre);

    const dispatch = useDispatch();

    
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
   // variable pour la pagination
   
   const itemsPerPage =  useSelector((state: RootState) => state.objectifSlice.data.pageSize); // nombre d'éléments maximum par page
   const count = useSelector((state: RootState) => state.objectifSlice.data.totalItems);
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
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);

    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);

    useEffect(() => {

        const fetchObjectifs = async () => {
            dispatch(setObjectifLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyObjectifs: ObjectifReturnGetType = {
                    objectifs: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if(selectedMatiere && selectedMatiere._id && selectedSemestre){
                    const fetchedObjectifs = await getObjectifByMatiereWithPagination({ matiereId: selectedMatiere._id, page: currentPage, annee: selectedYear, semestre: selectedSemestre, langue:lang });
                    if (fetchedObjectifs) { // Vérifiez si fetchedObjectifs n'est pas faux, vide ou indéfini
                        dispatch(setObjectifs(fetchedObjectifs));
                    } else {
                        dispatch(setObjectifs(emptyObjectifs));
                    }
                }else {
                    dispatch(setObjectifs(emptyObjectifs));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageObjectif(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setObjectifLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchObjectifs();
    }, [dispatch, selectedMatiere, selectedYear, selectedSemestre, currentPage, t]); // Déclencher l'effet lorsque currentPage change
    
    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<ObjectifType[]>(data);


    // useEffect(() => {
    //     const result = filterObjectifByContent(data);
    //     setFilteredData(result);
    // }, [searchText, data]);
    useEffect(() => {
       if(searchText!==''){
            setIsSearch(true);
       }else{
            setIsSearch(false);
       }
    }, [searchText]);
    const latestQueryObjectif = useRef('');
    useEffect(() => {
        dispatch(setObjectifLoading(true));
        latestQueryObjectif.current = searchText;
        
        try{
            
            const filterObjectifByContent = async () => {
                if (searchText === '') {
                    if(isSearch){
                        setSelectedSemestre(currentSemestre)
                    }
                    const result: ObjectifType[] = data;
                    setFilteredData(result); 
                }else{
                    setSelectedSemestre(undefined);
                    let objectifsResult : ObjectifType[] = [];
                    if(selectedMatiere && selectedMatiere._id){
                        await apiSearchObjectif({ searchString:searchText, limit:10, langue:lang, matiereId:selectedMatiere?._id, annee:selectedYear }).then(result=>{
                            if (latestQueryObjectif.current === searchText) {
                                if(result){
                                    objectifsResult = result.objectifs;
                                    setFilteredData(objectifsResult);
                                }
                            }
                            
                        })
                    }else{
                        setSelectedSemestre(currentSemestre);
                        const result: ObjectifType[] = data;
                        setFilteredData(result); 
                    }
                }
        
                
            };
            filterObjectifByContent();
        }catch(e){
            dispatch(setErrorPageObjectif(t('message.erreur')));
        }finally{
            if (latestQueryObjectif.current === searchText) {
                dispatch(setObjectifLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

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
                    title={t('boutton.nouvel_objectif')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.objectif'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
                {selectedMatiere && (<div>
                    {lang === 'fr' ? selectedMatiere.libelleFr : selectedMatiere.libelleEn}
                </div>)}
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.objectif')} </h1>
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

// interface TableObjectifProps {
//     data?: ObjectifType[];
//     onCreate:()=>void;
//     onEdit: (objectif:ObjectifType) => void;
//     onEditMatiere: (matiere : MatiereType) => void;
//     onEditChapitre?: (chapitre : ChapitreType) => void;
//     chapitre: ChapitreType | null;
// }

// const Table = ({ data, onCreate, onEdit, chapitre, onEditMatiere, onEditChapitre}: TableObjectifProps) => {
//     const {t}=useTranslation();
//     const pageIsLoading = false;
//     const dispatch = useDispatch();
//     const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//     const itemsPerPage = 10; // nombre delements maximum par page
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
//     const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

//     const handlePageClick = (pageNumber: number) => {
//         setCurrentPage(pageNumber);
//     };
//     const [searchText, setSearchText] = useState<string>('');
//     const [filteredData, setFilteredData] = useState<ObjectifType[] | undefined>(data);
//     // Filtrer les matières en fonction de la langue
//     const filterObjectifByContent = (objectifs: ObjectifType[] | undefined) => {
//         if(objectifs){
//             if (searchText === '') {
//                 const result: ObjectifType[] = objectifs;
//                 return result;
//             }
//             return objectifs.filter(objectif => {
//                 const libelle = lang === 'fr' ? objectif.libelleFr : objectif.libelleEn;
//                 // Vérifie si le code ou le libellé contient le texte de recherche
//                 return objectif.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
//             });
//         }
//        return [];
//     };

//     const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
//     useEffect(() => {
        
//         const mat = matieres.find(m=>m._id===chapitre?.matiere);
//         if(mat){
//             onEditMatiere(mat)
//         }
//         if(mat && mat.chapitres && mat.chapitres.length>0){
//             const chap=chapitre && mat.chapitres.find(chap=>chap._id=== chapitre._id);
//             if(chap){
//                 onEditChapitre(chap);
//                 setFilteredData(chap.objectifs);
//             }
            
//         }
        
//     },[matieres]);

//     useEffect(() => {
//         const result = filterObjectifByContent(data);
//         setFilteredData(result);
//     }, [searchText, data]);

//     return (
//         <div>
//             {/* bouton creer ajouter un nouvel ... et search bar */}
//             <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
//                 <ButtonCreate
//                     title={t('boutton.nouvel_objectif')}
//                     onClick={() => { onCreate();dispatch(setShowModal()) }}
//                 />
//                 <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.objectif'))} onSubmit={(text) => setSearchText(text)} />
//             </div>
//             {/*! bouton creer ajouter un nouvel ... et search bar */}


//             {/*  */}
//             <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
//                 {chapitre && (<div>
//                     {lang === 'fr' ? chapitre.libelleFr : chapitre.libelleEn}
//                 </div>)}

//                 {/* DEBUT DU TABLE */}
//                 <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
//                     <table className="w-full table-auto">
//                         {/* en tete du tableau */}
//                         {
//                             pageIsLoading ?
//                                 <LoadingTable />
//                                 : filteredData?.length === 0 ?
//                                     <NoDataTable /> :
//                                     <HeaderTable />
//                         }

//                         {/* corp du tableau*/}

//                         {
//                             !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit}/>
//                         }




//                     </table>
//                 </div>

//                 {/* Pagination */}


//             </div>

//             {/* bouton downlod Download */}
//             {/* <div className="mt-7 mb-10">
//                 <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

//             </div> */}

//         </div>
//     );
// };




export default Table;